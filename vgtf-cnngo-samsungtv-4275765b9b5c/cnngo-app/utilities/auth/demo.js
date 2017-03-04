/* globals Auth */

// ### Logger
//
// Facade to console.

var logger = (function () {

	var loggerEl = document.getElementById('logger');
	var methodNames = [ 'error', 'warn', 'info', 'debug', 'log' ];
	var api = {};
	var slice = Function.prototype.call.bind(Array.prototype.slice);

	function log() {
		var args = slice(arguments);
		var logEntry = document.createElement('li');
		logEntry.innerText = args.join(' ');
		loggerEl.appendChild(logEntry);
	}

	function createApiFor(methodName) {
		this[methodName] = function () {
			var args = slice(arguments);
			args.unshift(methodName.toUpperCase());
			log.apply(null, args);
		};
	}

	methodNames.forEach(createApiFor, api);

	return api;

}());


logger.log('demo.js begin');


function loadError(message, description) {
	window.alert(message + '\n\n' + description);
}


function getUrlFromCobrand(cobrand) {
	logger.log('getUrlFromCobrand(' + JSON.stringify(cobrand) + ')');

	if (typeof cobrand !== 'object') {
		logger.log('getUrlFromCobrand - invalid param!');
		return;
	}

	if (!('url' in cobrand)) {
		logger.log('getUrlFromCobrand - no "url" found!');
		return;
	}

	return cobrand.url;
}

function getCobranding(mvpdId) {
	logger.log('getCobranding(' + mvpdId + ')');

	var mvpdConfig = Auth.getMvpdConfigEntry(mvpdId);

	logger.log('getCobranding - mvpd config entry for "' + mvpdId + '":', JSON.stringify(mvpdConfig));

	if (!mvpdConfig) {
		logger.log('getCobranding - no mvpdconfig!');
		return;
	}

	if (!('cobrand' in mvpdConfig)) {
		logger.log('getCobranding - no "cobrand" in mvpdconfig!');
		return;
	}

	var cobrand = mvpdConfig.cobrand;
	var type = typeof cobrand;

	if (type !== 'object') {
		logger.log('getCobranding - unexpected data type for "cobrand"!  (expected "object", not "' + type + '")');
		return;
	}

	if ('length' in cobrand) {
		if (!cobrand.length) {
			logger.log('getCobranding - "cobrand" was empty array!');
			return;
		}

		return getUrlFromCobrand(cobrand[0]);  // picking first in array
	}
	else {
		return getUrlFromCobrand(cobrand);
	}
}

function displayRegCodeFailureMessage() {
	loadError('Ooops!', 'Unable to obtain the registration code required to start authentication process.  Please try again.');
}

function displayRegCodeEntryMessage(regCode) {
	loadError('Activate CNN', 'Using a web browser, go to http://httpstream.turner.com/gino/cnnatv and provide the registration code "' + regCode + '" in order to sign in with your provider.');
}

function displayExpiredRegCodeMessage() {
	loadError('Registration Code Expired', 'Please try again.');
}

function displayAuthNSuccessMessage(mvpdId) {
	var mvpdconfig = Auth.getMvpdConfigEntry(mvpdId);
	logger.log('mvpd config entry for "' + mvpdId + '":', JSON.stringify(mvpdconfig));
	var message = 'mvpd ID = ' + mvpdId;
	if (mvpdconfig) {
		message += '\nmvpd displayName = ' + mvpdconfig.displayName;
	}
	loadError('AuthN Success', message);
}

function displayAuthZSuccessMessage(token) {
	loadError('AuthZ Success', 'token: ' + token + '\ncobranding: ' + getCobranding(Auth.getMvpdId()));
}

function displayAuthZFailureMessage(err) {
	switch (err.code) {
		case Auth.NOT_SUBSCRIBED:
			loadError('Not authorized', 'Your subscription package does not include this channel.');
		break;
		default:
			loadError('AuthZ Failure', 'Unknown error.');
	}
}


var _auth = (function () {

	var regCode = '';
	var brandResourceId = 'CNN';
	var brandVideoUrl = 'http://phls-live.cdn.turner.com/cnn/cnnx/hls/stream.m3u8';


	// getPlayToken(resourceId, videoPathOrUrl, callback)
	// -----------------------------------------
	//
	// - success: data = { mvpdId, expires }
	// - failure: err != null
	//

	// Auth.authNPoller.start(callback[, seconds=30])
	// -----------------------------------------
	//
	// The authNPoller will poll for authN success every 30 seconds.
	// Upon authN success or regCode expiry, the callback function
	// will be executed.
	//
	function waitForAuthNSuccessThenGetPlayToken(resourceId, videoUrl) {
		logger.log('waitForAuthNSuccessThenGetPlayToken', resourceId, videoUrl);

		function onGetPlayTokenReply(err, data/*, res*/) {
			if (err) {
				displayAuthZFailureMessage(err);
				return logger.error('getPlayToken failed', err);
			}

			logger.log('getPlayToken succeeded!', data, ' <-- token for video play');

			displayAuthZSuccessMessage(data);
		}

		function waitForAuthNSuccess(err/*, data, res*/) {
			if (!err) {
				// successful authN
				Auth.getPlayToken(resourceId, videoUrl, onGetPlayTokenReply);
			}
			else if (err.code === Auth.REGCODE_EXPIRED) {
				// regCode expired
				displayExpiredRegCodeMessage();
			}
		}

		Auth.authNPoller.start(waitForAuthNSuccess);
	}


	// getRegCode(callback)
	// --------------------
	//
	// - success: data == { regCode, expires }
	// - failure: err != null
	//
	function onGetRegCodeReply(err, data/*, res*/) {
		logger.log('getRegCode response', err || JSON.stringify(data));

		if (err || !data) {
			displayRegCodeFailureMessage();
			return logger.error('Failed to obtain regcode!');
		}

		regCode = data.regCode;

		logger.log('Obtained regcode!', regCode, ' <-- display to user along with URL for browser');

		displayRegCodeEntryMessage(regCode);

		waitForAuthNSuccessThenGetPlayToken(brandResourceId, brandVideoUrl);
	}


	// getMvpdList(callback)  -- **REMOVED!**
	// ---------------------


	// getAuthN(callback)
	// ------------------
	//
	// - success: data = { mvpdId, expires }
	// - failure: err != null
	//

	// logout(resourceId)
	// ------------------
	//
	// The logout call clears AuthN and AuthZ tokens from storage,
	// but it does **not** call the MVPD logout endpoint.
	//
	function onGetAuthNReply(err/*, data, res*/) {
		if (err) {
			logger.log('Not authN-ed', err);

			Auth.logout('CNN', function startActivationAfterLogout() {
				Auth.getRegCode(onGetRegCodeReply);
			});

			return;
		}

		logger.log('AuthN-ed with ' + Auth.getMvpdId());

		displayAuthNSuccessMessage(Auth.getMvpdId());

		Auth.getPlayToken(brandResourceId, brandVideoUrl, function (err, data/*, res*/) {
			if (err) {
				displayAuthZFailureMessage(err);
				return logger.error('getPlayToken failed', err);
			}

			logger.log('getPlayToken succeeded!', data, ' <-- token for video play');

			displayAuthZSuccessMessage(data);

			Auth.logout();
		});
	}

	// init(callback)
	// --------------
	//
	// - success: err == null
	// - failure: err != null
	//
	function onInit(err) {
		logger.log('init response', err);

		if (err) {
			loadError('Fatality!', 'Unable to init AccessEnabler.');
			throw err;
		}

		logger.log('AccessEnabler is ready!');

		// We defer AuthManager init ready until we have mvpdconfig *AND* Adobe MVPD list.
		// Now these calls are synchronous:
		var mvpds = Auth.getMVPDs();
		logger.log('' + mvpds.length + ' MVPDs');

		// And there are a few helper methods...
		var primaryMvpds = Auth.getPrimaryMVPDs();
		logger.log('' + primaryMvpds.length + ' primary MVPDs: ' + Auth.extractMvpdIds(primaryMvpds).join(', '));

		Auth.getAuthN(onGetAuthNReply);
	}

	return {
		onInit: onInit
	};

}());

function cvp_onMVPDConfigReceived(data) {

		Auth.init({
			deviceType : 'firetv',
			logLevel: 'all',
			ignoreGeo: true,
			// configEnv: 'preprod',  // pulls the preprod mvpdconfig from the CDN
			mvpdConfigUrl: data,  // specify a URL (only for dev!)
			// vendorEnv: 'staging',  // NOTE: this ENV needs to match 2nd screen vendorEnv!!
			serviceOrigin: 'https://auth-proxy-adobe.herokuapp.com',//'http://api.auth-staging.adobe.com',  // if you want more control versus `vendorEnv`
			requestorId: 'CNN',
			site: 'cnn',
			tokenUrl: 'http://token.vgtf.net/token/token_spe',
			publicKey: 'VcHzVjoZ7HePY0zDJbmGXvC76mahC2Tr',
			secretKey: 'uUb8s8FAM2GBEkrh'
		}, _auth.onInit);
	}

logger.log('demo.js end');
