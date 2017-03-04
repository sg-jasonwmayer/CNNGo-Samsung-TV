(function() {
    'use strict';
    angular.module('clipData.factory', []).factory('clipDataFactory', clipDataFactory);
    
    function clipDataFactory($http, $q) {

        var clipUrl = 'http://api.platform.cnn.com/api/v1.5/clips/categories/tvos';
        var categoryUrl = 'http://api.platform.cnn.com/api/v1.5/clips/category/tvos/';
        
        var exports = {};
        exports.getClipsCategories = getClipsCategories;
        exports.getClipUrl = getClipUrl;
        exports.getCategoryData = getCategoryData;
        
        function getClipsCategories() {
            return $http.get(clipUrl).then(function(response) {
                var clipCategories = [];
                
                if (!response.data) {
                    console.log('Failed to get categories content. Response Empty.');
                    return;
                }

                var json = response.data;

                for (var i = 0; i < json.length; i++) {
                    if (json[i]) {
                        var clipCategory = ClipCategory.getData(json[i]);
                        
                        if (clipCategory) {
                            clipCategories.push(clipCategory);
                        }                         
                    }
                }

                return clipCategories;
            });
        }
        
        function getClipUrl(videoDataUrl) {
            var clipUrl = undefined;
            
            if (!clipUrl) {
                // create deferred object using $q
                var deferred = $q.defer();
                
                $http({
                    method  : 'GET',
                    url     : videoDataUrl,
                    transformResponse : function(data) {
                        // string to XML document object
                        return $.parseXML(data);
                    }
                }).success(function(data, status, headers, config) {
                    console.dirxml(data);  // XML document object
                    var $xml = $(data);
                    clipUrl = $xml.find('file[bitrate="connectedTV"]').text();

                    deferred.resolve(clipUrl);
                }).error(function(error) {
                    console.log('Error retrieving video data content');
                    deferred.reject(error);
                });
                
                clipUrl = deferred.promise;
            }
            
            return $q.when(clipUrl);
        }
        
        function getCategoryData(category) {
            return $http.get(categoryUrl + category + '/48').then(function(response) {

                var categoryClips = [];

                if (!response.data) {
                    console.log('Failed to get category content. Response Empty.');
                    return;
                }
                var json = response.data.clips;

                for (var i = 0; i < json.length; i++) {
                    if (json[i]) {
                        var onDemandClip = OnDemandClip.getData(json[i]);

                        if (onDemandClip) {
                            categoryClips.push(onDemandClip);
                        }
                    }
                }

                return categoryClips;
            });
        }
        
        return exports;
    }
    
})();