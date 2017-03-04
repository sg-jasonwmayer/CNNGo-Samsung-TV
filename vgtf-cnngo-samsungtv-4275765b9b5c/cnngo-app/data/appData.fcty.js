(function() {
    'use strict';
    angular.module('appData.factory', []).factory('appDataFactory', appDataFactory);
    
    function appDataFactory($http, dataCacheService) {
        var ODMUrl = 'http://odm.platform.cnn.com/client/api/v3.0/structure/tvos';
        
        var exports = {};
        exports.getOnDemandClips = getOnDemandClips;
        exports.buildDataCache = buildDataCache;
        
        function getOnDemandClips() {
            return $http.get(ODMUrl).then(function(response) {
                var onDemandCollection = [];
                
                if (!response.data) {
                    console.log('Failed to get On-Demand content. Response Empty.');
                    return;
                }

                var json = response.data.rows;

                for (var i = 0; i < json.length; i++) {
                    if (json[i]) {
                        if('carouselCollection' === json[i].rowType || 'smallCarousel' === json[i].rowType || 'posterCarousel' === json[i].rowType) {
                            var onDemandClips = OnDemandClipCollection.getData(json[i]);
                            
                            if (onDemandClips) {
                                onDemandCollection.push(onDemandClips);
                            }
                        }                           
                    }
                }

                return onDemandCollection;
            });
        }
        
        function buildDataCache(featuredData) {
            for(var i = 0; i < featuredData.length; i++) {
                 if('smallCarousel' === featuredData[i].rowType) {
                     dataCacheService.setLiveData(featuredData[i].content);
                 }
            }
        }
        
        return exports;
    }
    
})();