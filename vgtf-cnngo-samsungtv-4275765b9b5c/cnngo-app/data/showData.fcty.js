(function() {
	'use strict';

	angular.module('showData.factory', []).factory('showDataFactory', showDataFactory);

	function showDataFactory($http, $q, AuthManager) {
		var ODMUrl = 'http://odm.platform.cnn.com/client/api/v3.0/structure/tvos/allshows'
		var vodPapiUrl = 'http://api.platform.cnn.com/api/v1.5/vod/show/episodes/tvos/';
		var episodePapiUrl = 'http://api.platform.cnn.com/api/v1.5/vod/show/program/tvos/';


		var exports = {};
		exports.getVodData = getVodData;
		exports.getShowsData = getShowsData;
		exports.getEpisodeUrl = getEpisodeUrl;
		exports.getUnauthenticatedEpisodeUrl = getUnauthenticatedEpisodeUrl;

		function getShowsData() {
			return $http.get(ODMUrl).then(function(response) {
				var onDemandCollection = []

				if (!response.data) {
					console.log('Failed to get On-Demand Shows content. Response Empty');
					return;
				}
                
				var json = response.data.rows; 

				for(var i = 0; i < json.length; i++) {
					if (json[i]) {
                        if('posterCarousel' === json[i].rowType || 'posterSeriesFill' === json[i].rowType) {
							var onDemandShows = OnDemandClipCollection.getData(json[i]);

							if (onDemandShows) {
								onDemandCollection.push(onDemandShows);
							}
						}
					}
				}

				return onDemandCollection;
			});
		}

		function getVodData(seriesId, titleId) {
			return $http.get(getUrl(seriesId, titleId)).then(function(response) {
				var vodCollection = [];

				if (!response.data) {
					console.log('Failed to get VoD content. Response Empty.');
					return;
				}
				var json = response.data;
				if (isNaN(parseInt(json.length))) {
					var vod = OnDemandVodCollection.getData(json);
					vodCollection.push(vod);
				} else {
					for (var i = 0; i < json.length; i++) {
						var vod = OnDemandVodCollection.getData(json[i]);

						if (vod) {
							vodCollection.push(vod);
						}
					}
				}

				return vodCollection;
			});
		}

		function getUrl(seriesId, titleId) {
			if (seriesId === 0 || isNaN(parseInt(seriesId))) {
                return episodePapiUrl + titleId;
            } else {
            	return vodPapiUrl + seriesId + '?hasAvailOnly=true';
            }
		}

		function getUnauthenticatedEpisodeUrl(videoDataUrl) {
            var episodeUrl = undefined;
            
            if (!episodeUrl) {
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
                    episodeUrl = $xml.find('file[bitrate="connectedTV"]').text();
                    deferred.resolve(episodeUrl);
                }).error(function(error) {
                    console.log('Error retrieving video data content');
                    deferred.reject(error);
                });
                
                episodeUrl = deferred.promise;
            }
            
            return $q.when(episodeUrl);
        }

		function getEpisodeUrl(videoDataUrl) {
            var episodeUrl = undefined;
            
            if (!episodeUrl) {
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
                    episodeUrl = $xml.find('file[bitrate="connectedTV"]').text();
                    deferred.resolve(getEpisodeTokenUrl(episodeUrl));
                }).error(function(error) {
                    console.log('Error retrieving video data content');
                    deferred.reject(error);
                });
                
                episodeUrl = deferred.promise;
            }
            
            return $q.when(episodeUrl);
        }

		function getEpisodeTokenUrl(episodeUrl) {
            var deferred = $q.defer();
            
            getPlayToken(episodeUrl)
            .then(addToken)
            .then(function (completeEpisodeUrl) {
                if (undefined !== completeEpisodeUrl) {
                    deferred.resolve(completeEpisodeUrl);
                }
                else {
                    deferred.reject('Episode URL - Error');
                }
            })
            
            return deferred.promise;
        }
        
        function getPlayToken(episodeUrl) {
            var deferred = $q.defer();
            var url = episodeUrl;
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

		return exports;
	}
})();