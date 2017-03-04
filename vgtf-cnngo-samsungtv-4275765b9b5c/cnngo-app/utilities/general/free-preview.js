'use strict';

angular
.module('app.utilities')
.service('FreePreview', FreePreview);

/**
* FireTV manage free preview
*
* @class FreePreview
*
* @requires $rootScope
* @requires ENV
* @requires MementoService
* @requires EVENTS
* @requires $interval 
* @requires $timeout
* @requires $q
* @requires $http
* @requires $state
*
* @ngInject
*/
function FreePreview($rootScope, ENV, MementoService, EVENTS, $interval, $timeout, $q, $http, $state) {
	var _previewTimer;
	var _enabled = false; 
	var _CTAinterval, _CTATimeout;
	var _graceEndTime;

	var exports = {}; 
		exports.startPreview = startPreview;
		exports.isEnabled = isEnabled;
		exports.getPreviewStatus = getPreviewStatus;
		exports.getCTAInterval = getCTAInterval;
		exports.getCTATimeout = getCTATimeout;
		exports.startPolling = startPreviewPolling;
		exports.endPreviewTimer = endPreviewTimer;


	/**
	* startFreePreview
	*
	* @public
	*
	* begin preview
	*/ 
	function startPreview(previewData) {
		startPreviewPolling(previewData.ttl);
		_enabled = true;
		_CTAinterval = previewData.extraData.previewCTAInterval;
		_CTATimeout = previewData.extraData.previewCTATimeout;
	}

	/**
	* isEnabled
	*
	* @public
	*
	* return enabled state of preview
	*/ 
	function isEnabled() {
		return _enabled;
	}

    /**
     * Retreives the Event Based Preview status as a promise.
     *
     * @returns {HttpPromise} Returns a promise object with the standard `.then`
     * method and two http specific methods: `success` and `error`.
     *
     * @public
     * SHOULD BE IN DATASERVICE - CAUSES CIRCULAR DEPENDENCY WILL BE RESOLVED LATER
     */
    function getPreviewStatus(){
      MementoService.debug("requesting Preview Status");
      var deferred = $q.defer();

      var _url =  ENV.preview.eventBased.previewStatus;

      $http({
        method: 'GET',
        url: _url,
        data: {},
        headers: {} //'Content-Type': 'application/json'
      })
      .success(function(data, status, headers, config) {
        MementoService.debug("getPreviewStatus enabled: " + data.enabled);
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        MementoService.error("getPreviewStatus failed");
        deferred.reject(null);
      })
      ;

      return deferred.promise;        
    } 

    /**
     * Returns CTAInterval
     *
     *
     * @public
     */
    function getCTAInterval(){ return _CTAinterval * 1000; }

    /**
     * Returns CTATimeout
     *
     *
     * @public
     */
    function getCTATimeout(){ return _CTATimeout * 1000; }

	/**
	* startPreviewPolling
	*
	* @public
	*
	* begin preview timer
	*/ 
	function startPreviewPolling(ttl) {
		if (!ttl || isNaN(ttl)) {
			MementoService.error("FreePreview startPreviewPolling ttl is invalid. Default to 450");
			ttl = 900;
		}

		if (!!_previewTimer) { endPreviewTimer(); }
		_previewTimer = $interval(
			function(){
				
				getPreviewStatus()
				.then( function(previewData) {
					if (previewData.enabled == _enabled) { return; } // state hasn't changed ignore
					if (previewData.enabled != true) {
						MementoService.debug("Free Preview has ended");
						endPreview()
					} else {
						MementoService.debug("Free Preview has started");
						startPreview(previewData);
					}
				}, 
				function error(reason) { 
					MementoService.error(error);
          if (_enabled == true) endPreview(); // Only end the preview if we are in a preview
				});				
			},
			ttl * 1000
		);
	}

	/**
	* endPreviewTimer
	*
	* @public
	*
	* end preview timer
	*/ 
	function endPreviewTimer() {
		_enabled = false;
		$interval.cancel(_previewTimer);
		_previewTimer = undefined;
	}

	/**
	* endPreview
	*
	* @private
	*
	* begin grace period then redirect
	*/
	function endPreview(){
		_enabled = false;
		_graceEndTime = new Date(Date.now() + (ENV.preview.eventBased.gracePeriod_ms / 1000));

		$timeout(
			function gracePeriod() {
				document.getElementsByClassName('master-header')[0].style.display = 'block';
				document.getElementsByClassName('master-container')[0].style.paddingTop = '146px';
				$state.go('main.confirmation', {'confirmation_type': 'eventBasedPreview'});
			},
			ENV.preview.eventBased.gracePeriod_ms
		);

	}

	return exports;
}