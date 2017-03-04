'use strict';

angular.module('player.service', []).service('playerService', playerService);

function playerService(clipDataFactory, autoPlayFactory, showDataFactory, liveDataFactory, $timeout, $rootScope, dataCacheService, AuthManager, APP_CONSTANTS, EVENTS, ENV, modalControllerService, analyticsReporter, ANALYTICS, AdManagerService, UtilService) {
    
    var player = $('#avPlayer');

    var _withinAdBreak = false;
    var pausedDueToSeek = false;
    
    this.open = open;
    this.play = play;
    this.stop = stop;
    this.pause = pause;
    this.ff = ff;
    this.rew = rew;
    this.playClip = playClip;
    this.playLive = playLive;
    this.autoStart = autoStart;
    this.playEpisode = playEpisode;
    this.playUnauthenticatedEpisode = playUnauthenticatedEpisode;
    this.autoStartLive = autoStartLive;
    this.autoStartVod = autoStartVod;
    this.contentLength = null;
    this.stopVideoPlayback = stopVideoPlayback;
    
    var currentlyPlayingContent = null;

    $rootScope.$on(EVENTS.videoResumedPressed, onPlayPressed);
    $rootScope.$on(EVENTS.videoPausedPressed, onPausedPressed);
    $rootScope.$on(EVENTS.videoFFPressed, onFFPressed);
    $rootScope.$on(EVENTS.videoRWPressed, onRWPressed);
    $rootScope.$on(EVENTS.videoFFPressed, onFFReleased);
    $rootScope.$on(EVENTS.videoRWPressed, onRWReleased);
    $rootScope.$on(EVENTS.videoPlayPausedPressed, onPlayPausePressed);

    function onPlayPressed(){
        if(webapis.avplay.getState() === 'PAUSED'){
            $rootScope.$broadcast(EVENTS.videoResumed);
            webapis.avplay.play();
        }
    }

    function onPausedPressed(){
        if(webapis.avplay.getState() === 'PLAYING'){
            $rootScope.$broadcast(EVENTS.videoPaused);
            webapis.avplay.pause();
        }
    }

    function onFFPressed(){
        if(webapis.avplay.getState() === 'PLAYING'){
            webapis.avplay.pause();
            pausedDueToSeek = true;
        }
        ff();
    }

    function onRWPressed() {
        if(webapis.avplay.getState() === 'PLAYING'){
            webapis.avplay.pause();
            pausedDueToSeek = true;
        }
        rew();
    }

    function onFFReleased(){
        if(webapis.avplay.getState() === 'PAUSED' && pausedDueToSeek === true){
            webapis.avplay.play();
            pausedDueToSeek = false;
        }
    }

    function onRWReleased() {
        if(webapis.avplay.getState() === 'PAUSED' && pausedDueToSeek === true){
            webapis.avplay.play();
            pausedDueToSeek = false;
        }
    }

    function onPlayPausePressed(){
        if(webapis.avplay.getState() === 'PAUSED'){
            $rootScope.$broadcast(EVENTS.videoResumed);
            webapis.avplay.play();
        }
        else if(webapis.avplay.getState() === 'PLAYING'){
            $rootScope.$broadcast(EVENTS.videoPaused);
            webapis.avplay.pause();
        }
    }
    
    $rootScope.$on(EVENTS.adBreakStart, function() { _withinAdBreak = true; });

    $rootScope.$on(EVENTS.adBreakStop, function() { _withinAdBreak = false; });

    $rootScope.$on(EVENTS.retryPlayback, function($event, data){
        onPlayerUrlDataSuccess(data.url, data.retryCount);
    });

    $rootScope.$on(EVENTS.exitingApp, function($event){
        if(currentlyPlayingContent !== null){
            currentlyPlayingContent.playTime = parseInt(webapis.avplay.getCurrentTime());
            localStorage.setItem("lastPlayingItem", JSON.stringify(currentlyPlayingContent));
        }
    });

    $rootScope.$on(EVENTS.resumeLastPlayingContent, function($event, content){
        if(content !== null){
            switch(content.type){
                case "clip":
                    playClip(content.data);
                    if(content.playTime != undefined && content.playTime != null && content.playTime >= 0){
                        webapis.avplay.seekTo(content.playTime, function(){
                            console.log("Seek to " + content.playTime + " Successful!");
                        }, function(){
                            console.log("Seek to " + content.playTime + " Failed!");
                        });
                    }
                    break;
                case "show":
                    if(content.data.isAuthenticatedContent){
                        playEpisode(content.data);
                    } else{
                        playUnauthenticatedEpisode(content.data);
                    }   
                    webapis.avplay.seekTo(content.playTime, function(){
                        console.log("Seek to " + content.playTime + " Successful!");
                    }, function(){
                        console.log("Seek to " + content.playTime + " Failed!");
                    });
                    break;
                case "live":
                    playLive(content.data);
                    break;
            }
        }
    });

    function onPlaybackError(url, retryCount){
        var error = $.extend({
            retryURL: url,
            retryCount: retryCount
        }, ENV.errors.retryVideo);
        modalControllerService.showModal(APP_CONSTANTS.modals.informationModal, error);
    }

    function open(url, retryCount) {
        $('#avPlayer').show();
        var success = false;
        var listener = {
            onbufferingstart: function () {
                console.log("Buffering start.");
                $rootScope.$broadcast(EVENTS.displayVideoContentLoading, true);
            },
            onbufferingprogress: function (percent) {
                //console.log("Buffering progress data : " + percent);
                $rootScope.$broadcast(EVENTS.bufferAmountUpdate, percent);
            },
            onbufferingcomplete: function () {
                console.log("Buffering complete.");
                $rootScope.$broadcast(EVENTS.bufferAmountUpdate, 100);
                $rootScope.$broadcast(EVENTS.displayVideoContentLoading, false);
            },
            oncurrentplaytime: function (currentTime) {
                //console.log("Current playtime: " + currentTime);
                $rootScope.$broadcast(EVENTS.playTimeUpdate, currentTime);
                if(currentlyPlayingContent !== null && currentlyPlayingContent.type === 'clip') {
                    var currentPlaytimeSecs = Math.floor(currentTime/1000);
                    var currentDurationSecs = Math.floor(webapis.avplay.getDuration()/1000);
                    var countdownTime = currentDurationSecs - currentPlaytimeSecs;
                    
                    if(countdownTime >= 1 && countdownTime <= 5 ) {
                        var autoProgressState = autoPlayFactory.getAutoProgressState();
                        if(autoProgressState) {
                            var nextClip = autoPlayFactory.peekNextClip();
                            if(null !== nextClip) {
                                nextClip.countdownTime = countdownTime;
                                $rootScope.$broadcast('showUpNextOverlay', nextClip);
                            }
                        }
                    }
                }
            },
            onevent: function (eventType, eventData) {
                console.log("Event type: " + eventType + ", Data: " + eventData);
            },
            onstreamcompleted: function () {
                console.log("Stream Completed");
                
                var autoProgressState = autoPlayFactory.getAutoProgressState();
                if(autoProgressState) {
                    playNextClip();
                }
                else {
                    stop();
                }
                
            }.bind(this),
            onerror: function (eventType) {
                console.log("Player error : " + eventType);
            }
        };
        
        if (!url) {
            console.log('Invalid player url');
        }
        
        console.log('Player open : ' + url);
        
        try {
            webapis.avplay.open(url);
            webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
            webapis.avplay.setListener(listener);
            success = true;
        } catch (e) {
            console.log(e);
            onPlaybackError(url, retryCount);
            success = false;
        }

        return success;
    }

    function play(data, retryCount) {
        // Report video start analytics data
        var videoType = dataCacheService.getAnalyticsVideoType();
            
        if(ANALYTICS.videoType.clip === videoType) {
            // Report clip video start analytics data
            analyticsReporter.sendClipsVideoAnalytics(ANALYTICS.videoEvent.start);
        }
        else if(ANALYTICS.videoType.live === videoType) {
            // Report live video start analytics data
            analyticsReporter.sendLiveVideoAnalytics(ANALYTICS.videoEvent.start);
        }
        else if(ANALYTICS.videoType.show === videoType){
            analyticsReporter.sendVODVideoAnalytics(ANALYTICS.videoEvent.start);
        }
        
        // Start video progress beacon
        analyticsReporter.startVideoProgressBeacon();
        
        try {
            var currentPlatform = UtilService.getCurrentPlatform();
            var videoBufferTime = 0;
            if(currentPlatform === APP_CONSTANTS.platform.tizen2015) {
                videoBufferTime = 500;
            }
            
            if (webapis.avplay.getState() === 'IDLE') {
                webapis.avplay.prepare();                
                setTimeout(function() {
                    webapis.avplay.play();
                }, videoBufferTime);
                
                var duration = webapis.avplay.getDuration();
                $rootScope.$broadcast(EVENTS.videoStarted, duration, duration);
            } else if(webapis.avplay.getState() === 'PAUSED'){
                webapis.avplay.play();
                $rootScope.$broadcast(EVENTS.videoResumed);
            }

            $rootScope.$broadcast(EVENTS.playbackSucceeded);
        }
        catch(e) {
            console.log(e);
            onPlaybackError(data, retryCount);
        }
        
    }
    
    function stop() {
        $rootScope.$broadcast('hideUpNextOverlay');
        
        // Report video end analytics data
        var videoType = dataCacheService.getAnalyticsVideoType();
            
        if(ANALYTICS.videoType.clip === videoType) {
            analyticsReporter.sendClipsVideoAnalytics(ANALYTICS.videoEvent.end);
        }
        else if(ANALYTICS.videoType.show === videoType) {
            analyticsReporter.sendVODVideoAnalytics(ANALYTICS.videoEvent.end);
        }
        $rootScope.$broadcast(EVENTS.videoStopped);
        // Stop video progress beacon
        analyticsReporter.stopVideoProgressBeacon();
        
        webapis.avplay.stop();
    }
    
    function pause() {
        if(webapis.avplay.getState() === 'PLAYING'){
            webapis.avplay.stop();
            $rootScope.$broadcast(EVENTS.videoPaused);
        }
        else if(webapis.avplay.getState() === 'PAUSED'){
            webapis.avplay.play();
            $rootScope.$broadcast(EVENTS.videoPaused);
        }
    }
    
    function ff() {
        if (_withinAdBreak) { return; }
        webapis.avplay.jumpForward('3000');
    }
    
    function rew() {
        if (_withinAdBreak) { return; }

        var seekSpeed = ENV.videoSeekSpeed * 1000;
        webapis.avplay.jumpBackward(seekSpeed, function() {
            console.log("Rewind Success", seekSpeed);
        }, function(err) {
            console.log("Rewind Failure", err);
        });
    }
    
    function autoStart() {
        $timeout(function() {
            var clip = autoPlayFactory.getAutoStartClip();
            if(clip.isLive) {
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.live, clip.id, ANALYTICS.values.section.live, ANALYTICS.values.liveVideoTitle[clip.id], 0, true);
                playLive(clip);                
            }
            else if(clip.isVod){
                if(AuthManager.isAuthenticated() === true){
                    dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, clip.id, clip.episodeName, clip.title, Math.floor(clip.totalRunTime), true);
                    playEpisode(clip, clip.videoId)
                }else if(clip.isAuthenticatedContent === false){
                    dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, clip.id, clip.episodeName, clip.title, Math.floor(clip.totalRunTime), true);
                    playUnauthenticatedEpisode(clip, clip.videoId)
                } else{
                    console.error("Error: Attempted to play Authenticated content via autostart and the user is not authenticated.");
                }
            }
            else {
                autoPlayFactory.setClipVideoAnalyticsData(clip.id);
                playClip(clip);
            }
            
        }, 1000);
    }
    
    function autoStartLive() {
        $timeout(function() {
            var live = autoPlayFactory.getAutoStartLive();
            dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.live, live.id, ANALYTICS.values.section.live, ANALYTICS.values.liveVideoTitle[live.id], 0, true);
            playLive(live);
        }, 1000);
    }

    function autoStartVod(vod){
        var content = vod || autoPlayFactory.getAutoStartShowsData();
        $timeout(function() {
            if(AuthManager.isAuthenticated() === true){
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, content.id, content.episodeName, content.title, Math.floor(content.totalRunTime), true);
                playEpisode(content, content.videoId)
            }else if(content.isAuthenticatedContent === false){
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, content.id, content.episodeName, content.title, Math.floor(content.totalRunTime), true);
                playUnauthenticatedEpisode(content, content.videoId);
            } else{
                console.error("Error: Attempted to play Authenticated content via autostart and the user is not authenticated.");
            }
        }, 1000);
    }
    
    function playClip(clip) {
        $rootScope.$broadcast(EVENTS.displayVideoContentLoading, true);
        
        dataCacheService.setFeaturedAutoPlayVideoData(clip.id, false);
        currentlyPlayingContent = {
            data: clip,
            type: 'clip'
        };
        dataCacheService.setPlaying(clip);

        var videoDataUrl = autoPlayFactory.getVideoUrl(clip.id);
        $rootScope.$broadcast('showPlayingBadge', clip.id);
        
        if(null !== videoDataUrl) {
            clipDataFactory.getClipUrl(videoDataUrl)
            .then(function(clipUrl){
                var currentPlatform = UtilService.getCurrentPlatform();
                if(currentPlatform === APP_CONSTANTS.platform.tizen2015) {
                    clipUrl += "&set-akamai-hls-revision=4";
                }
                
                return AdManagerService.injectAds(clip.type, clip.videoID, clipUrl, clip.adBlocks);
            })
            .then(onPlayerUrlDataSuccess, onError)
        }
        else {
            console.log('Unable to play clip');
        }
    }

    function playEpisode(episode, id) {
        $rootScope.$broadcast(EVENTS.displayVideoContentLoading, true);
        
        currentlyPlayingContent = {
            data: episode,
            type: 'show'
        };
        $rootScope.$broadcast('showPlayingBadge', id);
        dataCacheService.setPlaying(episode);
        showDataFactory.getEpisodeUrl(episode.contentXMLPath)
        .then(function(episodeUrl){
            return AdManagerService.injectAds(episode.type, episode.videoID, episodeUrl, episode.adBlocks);
        })
        .then(onPlayerUrlDataSuccess, onError);
    }

    function playUnauthenticatedEpisode(unauthEpisode, id) {
        $rootScope.$broadcast(EVENTS.displayVideoContentLoading, true);
        
        currentlyPlayingContent = {
            data: unauthEpisode,
            type: 'show'
        };
        $rootScope.$broadcast('showPlayingBadge', id);
        dataCacheService.setPlaying(unauthEpisode);
        showDataFactory.getUnauthenticatedEpisodeUrl(unauthEpisode.contentXMLPath)
        .then(function(unauthEpisodeUrl){
            return AdManagerService.injectAds("clip", unauthEpisode.videoID, unauthEpisodeUrl, "");
        })        
        .then(onPlayerUrlDataSuccess, onError);
    }
    
    function playLive(live) {
        $rootScope.$broadcast(EVENTS.displayVideoContentLoading, true);
        
        currentlyPlayingContent = {
            data: live,
            type: 'live'
        };
        if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
            dataCacheService.setFeaturedAutoPlayVideoData(live.id, true);
        }
        else if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.live.state) {
            dataCacheService.setLiveAutoPlayData(live.id);
        }
        
        $rootScope.$broadcast('showPlayingBadge', live.id);
        dataCacheService.setPlaying(live);
        liveDataFactory.getLiveUrl(live.id)
        .then(function(liveUrl){
            return AdManagerService.injectAds(live.id, ENV.ad.target.live, liveUrl, "");
        }) 
        .then(onPlayerUrlDataSuccess, onError);
    }
    
    function playNextClip() {
        var nextClip = autoPlayFactory.getNextClip();
        if(null !== nextClip) {
            autoPlayFactory.setClipVideoAnalyticsData(nextClip.id);
            playClip(nextClip);
        }
    }
    
    function onPlayerUrlDataSuccess(data, retryCount) {
        if(webapis.avplay.getState() === 'PLAYING' || webapis.avplay.getState() === 'PAUSED') {
            stop(); 
        }
        
        if(open(data, retryCount) === true){
            play(data, retryCount);
        }
    }
    
    function stopVideoPlayback() {
        if(webapis.avplay.getState() === 'PLAYING' || webapis.avplay.getState() === 'PAUSED') {
            stop(); 
        }
    }
    
    function onError(error) {
        console.log('Error - Unable to get data from the service');
    }
}
