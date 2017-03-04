(function() {
    'use strict';

    angular
        .module('app.utilities')
        .service('AdManagerService', AdManagerService);

     /**
      * @class AdManagerService
      *
      * @classdesc
      * Service for Ad management. Used to manipulate video URLs to inject ads.
      *
      * @ngInject
      *
    */
    function AdManagerService (uuid4, ENV, UtilService) {
        var self = {};

        // Public functions
        self.injectAds = injectAds;
        self.incrementAdViews = incrementAdViews;

        // Private variables
        var _manifestPattern = ENV.ad.manifestPattern;
        var _clipAdViewPattern = ENV.ad.clips.adPattern || [true];
        var _clipAdIndex = 0;

        return self;

        // Hoisted Public/Private Helper Functions

        /**
        * Increaments the clip index that determines when an ad should be injected into a video.
        * Can potentially keep track of how many total ads a user has viewed in a session.
        */
        function incrementAdViews () {
            _clipAdIndex = _incrementCircularIndex(_clipAdIndex, _clipAdViewPattern.length);
        }

        /**
        * Uses the clip ad view pattern to determine if an ad should be viewed at this time.
        * 
        * @return {Boolean} Whether or not ads should be injected.
        */
        function _shouldInjectAds () {
            var shouldInject = _clipAdViewPattern[_clipAdIndex];

            // Auto incrementing for now. TODO: Make use of the incrementAdViews() function at the right time.
            _clipAdIndex = _incrementCircularIndex(_clipAdIndex, _clipAdViewPattern.length);

            return shouldInject;
        };

        /**
        * Increments the input index and outputs it, unless it is greater than or equal
        * to the max, in which case zero is returned.
        * @param {Integer} idx the index to increment
        * @param {Integer} max the exclusive maximum the index should reach
        *
        * @return the incremented index or zero.
        */
        function _incrementCircularIndex (idx, max) {
            idx++;
            if (idx >= max) { idx = 0; }

            return idx;
        }

        /**
        * Take the content and potentially create a new URL with ads injected by the server.
        * @param {String} type The type of content ads should be injected for.
        * @param {String} videoId The content identifier. These are of the form 'urn:ngtv-show:####' or just a hex string.
        * @param {String} contentUrl The full URL of the video file.
        * @param {String} adBlocks The prime time ad blocks string from time machine
        * 
        * @return {String} A video URL that will potentially have ads injected.
        */
        function injectAds (type, videoId, contentUrl, adBlocks) {
            console.log("injecting ads");
            var adTarget = '',
                targetId = '';
            var id_prefix = "";

            _manifestPattern = ENV.ad.manifestPattern;

            switch (type) {
                case 'live':
                    var _stream;
                    if (contentUrl.startsWith(ENV.urls['cnni'])) {
                        adTarget = ENV.ad.target.cnni;
                        targetId = ENV.ad.targetId.cnni;
                        _stream = 'cnni';
                    } else if (contentUrl.startsWith(ENV.urls['hln'])) {
                        adTarget = ENV.ad.target.hln;
                        targetId = ENV.ad.targetId.hln;
                        _stream = 'hln';
                    } else {
                        adTarget = ENV.ad.target.live;
                        targetId = ENV.ad.targetId.live;
                        _stream = 'cnn';
                    }

                    if (!!ENV.ad.adtoggle && ENV.ad.adtoggle[_stream] == false) {
                        console.log("ads disabled for " + _stream);
                        return contentUrl;  // No ad injection
                    }

                    _manifestPattern = ENV.ad.manifestPatternStream;
                    break;
                case 'clip':
                    if (_shouldInjectAds() === false || ENV.ad.adtoggle.clips === false) {
                        console.log("no ad injection");
                        return contentUrl; // No ad injection.
                    }
                    id_prefix = ENV.ad.clips.idPrefix;
                    adTarget = ENV.ad.target.preroll;
                    break;
                case 'episode':
                    if (ENV.ad.adtoggle.vod === false) {
                        console.log("no ad injection");
                        return contentUrl; // No ad injection.
                    }                
                    adTarget = ENV.ad.target.midroll;
                    break;
                default:
                    console.log("no ad injection");
                    return contentUrl; // No ad injection
            }

            // Construct the arguments
            var opts = {
                url: ENV.urls.adManifest,
                id: id_prefix + videoId,
                assetId: ENV.ad.assetId,
                eid: videoId.replace(/\//g, '_'), // Replace all '/' with '_' to create a loosely encoded ID,
                b64url: btoa(unescape(encodeURIComponent(contentUrl))), // Perform extra manipulations to prevent errors with unicode strings
                adobeZone: ENV.ad.zone,
                target: adTarget,
                sid: uuid4.generate(),
                uuid: UtilService.getDeviceId(), 
                timeline: adBlocks,
                trackingMode: ENV.ad.trackingMode,
                trackingVersion: ENV.ad.trackingVersion,
                targetId: targetId,
                debug: ENV.ad.debug
            };
            // DEBT: The following line assumes structural elements about the pattern. 
            // Remove the "pttimeline={timeline}" section if we don't have adBlocks since Adobe doesn't like an empty one
            var pattern = (adBlocks === '') ? _manifestPattern.replace('&pttimeline={timeline}', '') : _manifestPattern;

            return UtilService.replacePattern(opts, pattern);
        };
    };

})();