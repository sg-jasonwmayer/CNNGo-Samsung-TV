(function() {
    'use strict';
    angular.module('liveData.factory', []).factory('liveDataFactory', liveDataFactory);
    
    function liveDataFactory(APP_CONSTANTS, ENV, $q, AuthManager) {
        
        var exports = {};
        
        exports.getLiveUrl = getLiveUrl;
        
        function getLiveUrl(liveId) {
            var deferred = $q.defer();
            
            getPlayToken(liveId)
            .then(addToken)
            .then(function (liveUrl) {
                if (undefined !== liveUrl) {
                    deferred.resolve(liveUrl);
                }
                else {
                    deferred.reject('Live URL - Error');
                }
            })
            
            return deferred.promise;
        }
        
        function getPlayToken(liveId) {
            var deferred = $q.defer();
            var url = getLiveBaseUrl(liveId);

            AuthManager.getPlayToken(url, function (err, token) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({url: url, token: "hdnea=" + token});
                }
            });

            return deferred.promise;
        }
        
        function addToken(obj) {
            var sep = (obj.url.indexOf('?') === -1) ? '?' : '&';
            
            return obj.url + sep + obj.token;
        }
        
        function getLiveBaseUrl(liveId) {
            var liveUrl;
            
            if(liveId === APP_CONSTANTS.liveChannel.CNNI) {
                liveUrl = ENV.urls.cnni;
            }
            else if(liveId === APP_CONSTANTS.liveChannel.HLN) {
                liveUrl = ENV.urls.hln;
            }
            else {
                liveUrl = ENV.urls.liveFeed;
            }
            
            return liveUrl;
        }
        
        return exports;
    }
    
})();