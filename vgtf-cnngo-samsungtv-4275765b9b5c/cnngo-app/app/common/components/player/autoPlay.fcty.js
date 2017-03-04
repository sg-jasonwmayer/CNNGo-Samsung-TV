(function() {
    'use strict';
    angular.module('autoPlay.factory', []).factory('autoPlayFactory', autoPlayFactory);
    
    function autoPlayFactory(dataCacheService, ANALYTICS) {
    	
        var clipPlayList = [];
        var currentAutoPlayIndex = 0;
        var autoProgressState = true;
        
        var exports = {};
        
        exports.getAutoProgressState = getAutoProgressState;
        exports.setPlayList = setPlayList;
        exports.getVideoUrl = getVideoUrl;
        exports.peekNextClip = peekNextClip;
        exports.getNextClip = getNextClip;
        exports.getAutoStartClip = getAutoStartClip;
        exports.getAutoStartLive = getAutoStartLive;
        exports.getAutoStartShowsData = getAutoStartShowsData;
        exports.isPlayListPopulated = isPlayListPopulated;
        exports.setClipVideoAnalyticsData = setClipVideoAnalyticsData;
        
        // Build clip play list data
        function setPlayList(playList, currentIndex) {
        	//Set clip play list
            currentAutoPlayIndex = currentIndex;
        	clipPlayList = playList;
        }
        
        // Get content xml path for clip id
        function getVideoUrl(clipId) {
            var autoPlayIndex  = clipPlayList.map(function(o) { return o.id; }).indexOf(clipId);
            if(-1 !== autoPlayIndex) {
                currentAutoPlayIndex = autoPlayIndex;
            }
            else {
                console.log('Unable to find clip id in the auto play list');
                return null;
            }
            
            console.log(currentAutoPlayIndex);
            return clipPlayList[currentAutoPlayIndex].contentXMLPath;
        }
        
        function getAutoProgressState() {
            return autoProgressState;
        }
        
        function getNextClip() {
            if((currentAutoPlayIndex + 1) < clipPlayList.length) {
                currentAutoPlayIndex += 1;
            }
            else {
                currentAutoPlayIndex = 0;
            }
            
            return clipPlayList[currentAutoPlayIndex];
        }
        
        function peekNextClip() {
            var autoPlayIndex;
            if((currentAutoPlayIndex + 1) < clipPlayList.length) {
                autoPlayIndex = currentAutoPlayIndex + 1;
            }
            else {
                autoPlayIndex = 0;
            }
            
            return clipPlayList[autoPlayIndex];
        }
        
        function getAutoStartClip() {
            var clip = {};
            var featuredAutoPlayData = dataCacheService.getFeaturedAutoPlayData();

            if(featuredAutoPlayData.isVod === true){
                clip = featuredAutoPlayData;
            }
            else if(null !== featuredAutoPlayData.videoId) {
                clip.id = featuredAutoPlayData.videoId;
            }
            else {
                clip = clipPlayList[0];
            }
            
            clip.isLive = featuredAutoPlayData.isLive;
            clip.isVod = featuredAutoPlayData.isVod;
            
            return clip;
        }
        
        function getAutoStartLive() {
            var live = {};
            var liveData = dataCacheService.getLiveData();
            
            var liveAutoPlayData = dataCacheService.getLiveAutoPlayData();
            
            if(null !== liveAutoPlayData.videoId) {
                live.id = liveAutoPlayData.videoId;
            }
            else {
                live.id = liveData[0].titleID;
            }
            
            return live;
        }

        function getAutoStartShowsData() {
            var showsData = dataCacheService.getShowsAutoPlayData();

            return showsData;
        }

        function isPlayListPopulated() {
            return clipPlayList.length > 0;
        }
        
        function setClipVideoAnalyticsData(clipId) {
            var autoPlayIndex  = clipPlayList.map(function(o) { return o.id; }).indexOf(clipId);
            if(-1 !== autoPlayIndex) {
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.clip , clipPlayList[autoPlayIndex].videoID, clipPlayList[autoPlayIndex].episodeName, clipPlayList[autoPlayIndex].title, Math.floor(clipPlayList[autoPlayIndex].totalRunTime), true);
            }
            else {
                console.log('Unable to set analytics data for clip');
            }
            
        }
        
        return exports;
    }
    
})();