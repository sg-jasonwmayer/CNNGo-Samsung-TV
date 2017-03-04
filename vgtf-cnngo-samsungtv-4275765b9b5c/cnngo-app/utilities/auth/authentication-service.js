'use strict';

angular
    .module('app.utilities')
    .service('AuthManager', AuthManager);

/**
 * This service manages Adobe Pass Authentication
 *
 * @class AuthManager
 *
 * @ngInject */
function AuthManager($rootScope, Auth, EVENTS) {
    var exports = {};
    var isAuthN = false;
    var onLoginPage = false;

    exports.init = init;
    exports.isAuthenticated = isAuthenticated;
    exports.getPlayToken = getPlayToken;
    exports.getMediaToken = getMediaToken;
    exports.getNewRegCode = getNewRegCode;
    exports.getCobranding = getCobranding;
    exports.getCurrentMvpd = getCurrentMvpd;
    exports.getCurrentMvpdAnalytics = getCurrentMvpdAnalytics;
    exports.logout = logout;

    $rootScope.$on(EVENTS.onLoginPage, function() {
        onLoginPage = true;
    });

    $rootScope.$on(EVENTS.leftLoginPage, function() {
        onLoginPage = false;
        Auth.authNPoller.stop();
    });

    function logout() {
        isAuthN = false;
        $rootScope.$broadcast(EVENTS.authNLogout);
        Auth.logout();
    }

    function isAuthenticated() {
        return isAuthN;
    }

    function getNewRegCode() {
        Auth.getRegCode(onGetRegCodeReply);
    }

    function log(message, description) {
        // window.alert(message + '\n\n' + description);
        console.log(message + '\n\n' + description);
    }

    function getUrlFromCobrand(cobrand) {
        if (typeof cobrand !== 'object') {
            console.log('getUrlFromCobrand - invalid param!');
            return;
        }

        if (!('url' in cobrand)) {
            console.log('getUrlFromCobrand - no "url" found!');
            return;
        }

        return cobrand.url;
    }

    function getCurrentMvpd() {
        var mvpdId = Auth.getMvpdId();

        if (!mvpdId) {
            return null;
        }

        return Auth.getMvpdConfigEntry(mvpdId);
    }
    
    function getCurrentMvpdAnalytics() {
        return Auth.getMvpdIdForAnalytics();
    }

    function getCobranding() {
        var mvpdId = Auth.getMvpdId();

        if (!mvpdId) {
            return '';
        }

        console.log('getCobranding(' + mvpdId + ')');

        var mvpdConfig = Auth.getMvpdConfigEntry(mvpdId);

        console.log('getCobranding - mvpd config entry for "' + mvpdId + '":', JSON.stringify(mvpdConfig));

        if (!mvpdConfig) {
            console.log('getCobranding - no mvpdconfig!');
            return;
        }

        if (!('cobrand' in mvpdConfig)) {
            console.log('getCobranding - no "cobrand" in mvpdconfig!');
            return;
        }

        var cobrand = mvpdConfig.cobrand;
        var type = typeof cobrand;

        if (type !== 'object') {
            console.log('getCobranding - unexpected data type for "cobrand"!  (expected "object", not "' + type + '")');
            return;
        }

        if ('length' in cobrand) {
            if (!cobrand.length) {
                console.log('getCobranding - "cobrand" was empty array!');
                return;
            }

            return getUrlFromCobrand(cobrand[0]); // picking first in array
        } else {
            return getUrlFromCobrand(cobrand);
        }
    }

    function displayRegCodeFailureMessage() {
        log('Ooops!', 'Unable to obtain the registration code required to start authentication process.  Please try again.');
    }

    function displayRegCodeEntryMessage(regCode) {
        log('Activate CNN', 'Using a web browser, go to http://httpstream.turner.com/gino/cnnatv and provide the registration code "' + regCode + '" in order to sign in with your provider.');
    }

    function displayExpiredRegCodeMessage() {
        log('Registration Code Expired', 'Please try again.');
    }

    function displayAuthNSuccessMessage(mvpdId) {
        var mvpdconfig = Auth.getMvpdConfigEntry(mvpdId);
        console.log('mvpd config entry for "' + mvpdId + '":', JSON.stringify(mvpdconfig));
        var message = 'mvpd ID = ' + mvpdId;
        if (mvpdconfig) {
            message += '\nmvpd displayName = ' + mvpdconfig.displayName;
        }
        log('AuthN Success', message);
    }

    function displayAuthZSuccessMessage(token) {
        log('AuthZ Success', 'token: ' + token + '\ncobranding: ' + getCobranding(Auth.getMvpdId()));
    }

    function displayAuthZFailureMessage(err) {
        switch (err.code) {
            case Auth.NOT_SUBSCRIBED:
                log('Not authorized', 'Your subscription package does not include this channel.');
                break;
            default:
                log('AuthZ Failure', 'Unknown error.');
        }
    }

    var regCode = '';
    var brandResourceId = 'CNN';

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
    function waitForAuthNSuccessThenGetPlayToken(resourceId) {
        function waitForAuthNSuccess(err /*, data, res*/ ) {
            if (!err) {
                // successful authN
                isAuthN = true;
                $rootScope.$broadcast(EVENTS.authNSuccess);
            } else if (err.code === Auth.REGCODE_EXPIRED) {
                // regCode expired
                isAuthN = false;
                $rootScope.$broadcast(EVENTS.authNExpired);
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
    function onGetRegCodeReply(err, data /*, res*/ ) {
        console.log('getRegCode response', err || JSON.stringify(data));

        if (err || !data) {
            displayRegCodeFailureMessage();
            return console.log('Failed to obtain regcode!');
        }

        regCode = data.regCode;
        $rootScope.$broadcast(EVENTS.onRegCode, regCode);

        console.log('Obtained regcode!', regCode, ' <-- display to user along with URL for browser');
        displayRegCodeEntryMessage(regCode);

        waitForAuthNSuccessThenGetPlayToken(brandResourceId);
    }

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
    function onGetAuthNReply(err /*, data, res*/ ) {
        if (err) {
            console.log('Not authN-ed', err);
            Auth.logout('CNN', function startActivationAfterLogout() {
                if (onLoginPage) {
                    console.log('attempting to get regcode');
                    Auth.getRegCode(onGetRegCodeReply);
                }
            });

            $rootScope.$broadcast(EVENTS.authN_Failed);
            return;
        }

        console.log('AuthN-ed with ' + Auth.getMvpdId());
        displayAuthNSuccessMessage(Auth.getMvpdId());
        $rootScope.$broadcast(EVENTS.authNSuccess);
        isAuthN = true;
    }

    function getPlayToken(videoUrl, callback) {
        Auth.getPlayToken(brandResourceId, videoUrl, callback);
    }

    function getMediaToken(resourceId, callback) {
        Auth.getMediaToken(resourceId, callback);
    }

    // init()
    // --------------
    //
    // - success: err == null
    // - failure: err != null
    //
    function init(config) {
        if(Auth.isReady()){
            onInit();
        }
        else {
            Auth.init({
                logLevel: 'all',
                serviceOrigin: config.authentication.serviceOrigin,
                deviceType : config.authentication.deviceType,
                requestorId:  config.authentication.requestorId,
                site: config.authentication.site,
                tokenUrl: config.authentication.tokenUrl,
                publicKey: config.authentication.publicKey,
                secretKey: config.authentication.secretKey,
                timeout: 5000
            }, onInit);
        }
    }

    function onInit(err) {
        console.log('init response', err);

        if (err) {
            $rootScope.$broadcast(EVENTS.authN_Failed);

            log('Fatality!', 'Unable to init AccessEnabler.');
            throw err;
        }

        console.log('AccessEnabler is ready!');

        // We defer AuthManager init ready until we have mvpdconfig *AND* Adobe MVPD list.
        // Now these calls are synchronous:
        var mvpds = Auth.getMVPDs();
        console.log('' + mvpds.length + ' MVPDs');

        // And there are a few helper methods...
        var primaryMvpds = Auth.getPrimaryMVPDs();
        console.log('' + primaryMvpds.length + ' primary MVPDs: ' + Auth.extractMvpdIds(primaryMvpds).join(', '));

        Auth.getAuthN(onGetAuthNReply);
    }

    return exports;
}

