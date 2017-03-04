'use strict';

angular.module('dataCache.service', []).service('dataCacheService', dataCacheService);

function dataCacheService() {

    var live = [];
    var featuredAutoPlayData = { videoId: null, isLive: false, isVod: false, isAuthenticatedContent: false, contentXMLPath: null, totalRunTime: null, seekTo: 0 };
    var liveAutoPlayData = { videoId: null };
    var showsAutoPlayData = { videoId: null, isAuthenticatedContent: true, contentXMLPath: null, totalRunTime: null, seekTo: 0 };
    var videoAnalyticsData = {videoType: null, videoId: null, videoCategory: null, videoTitle: null, videoLength: null, videoAutoStart: null};
    var playingObj = {};
    var currentVideoLength = null;
    
    this.clearDataCache = clearDataCache;
    this.setLiveData = setLiveData;
    this.getLiveData = getLiveData;
    this.setFeaturedAutoPlayVideoData = setFeaturedAutoPlayVideoData;
    this.setFeaturedAutoPlaySeekTime = setFeaturedAutoPlaySeekTime;
    this.setShowsAutoPlaySeekTime = setShowsAutoPlaySeekTime;
    this.getFeaturedAutoPlayData = getFeaturedAutoPlayData;
    this.setLiveAutoPlayData = setLiveAutoPlayData;
    this.getLiveAutoPlayData = getLiveAutoPlayData;
    this.setShowsAutoPlayData = setShowsAutoPlayData;
    this.getShowsAutoPlayData = getShowsAutoPlayData;
    this.setVideoAnalyticsData = setVideoAnalyticsData;
    this.getVideoAnalyticsData = getVideoAnalyticsData;
    this.getAnalyticsVideoType = getAnalyticsVideoType;
    this.setPlaying = setPlaying;
    this.getPlaying = getPlaying;
    this.clearPlaying = clearPlaying;
    this.getCurrentVideoLength = getCurrentVideoLength;
    this.setCurrentVideoLength = setCurrentVideoLength;
    
    function getCurrentVideoLength(){
        return currentVideoLength;
    }

    function setCurrentVideoLength(length){
        currentVideoLength = length;
    }
    
    function setLiveData(liveData) {
        live = liveData;
    }
    
    function getLiveData() {
        return live;
    }
    
    function setFeaturedAutoPlayVideoData(videoId, isLive, isVod, isAuthenticatedContent, contentXMLPath, totalRunTime) {
        featuredAutoPlayData.videoId = videoId;
        featuredAutoPlayData.isLive = isLive;
        featuredAutoPlayData.isVod = isVod;
        featuredAutoPlayData.isAuthenticatedContent = isAuthenticatedContent;
        featuredAutoPlayData.contentXMLPath = contentXMLPath;
        featuredAutoPlayData.totalRunTime = totalRunTime;
    }
    
    function setFeaturedAutoPlaySeekTime(seekTime) {
        featuredAutoPlayData.seekTo = seekTime;
    }

    function setShowsAutoPlaySeekTime(seekTime){
        showsAutoPlayData.seekTo = seekTime;
    }
    
    function getFeaturedAutoPlayData() {
        return featuredAutoPlayData;
    }
    
    function setLiveAutoPlayData(videoId) {
        liveAutoPlayData.videoId = videoId;
    }
    
    function getLiveAutoPlayData() {
        return liveAutoPlayData;
    }

    function setShowsAutoPlayData(videoId, isAuthenticatedContent, contentXMLPath, totalRunTime) {
        showsAutoPlayData.videoId = videoId;
        showsAutoPlayData.isAuthenticatedContent = isAuthenticatedContent;
        showsAutoPlayData.contentXMLPath = contentXMLPath;
        showsAutoPlayData.totalRunTime = totalRunTime;
    }
    
    function getShowsAutoPlayData() {
        return showsAutoPlayData;
    }
    
    function setVideoAnalyticsData(videoType, videoId, videoCategory, videoTitle, videoLength, videoAutoStart) {
        videoAnalyticsData.videoType = videoType;
        videoAnalyticsData.videoId = videoId;
        videoAnalyticsData.videoCategory = videoCategory;
        videoAnalyticsData.videoTitle = videoTitle;
        videoAnalyticsData.videoLength = videoLength;
        videoAnalyticsData.videoAutoStart = videoAutoStart;
    }
    
    function getVideoAnalyticsData() {
        return videoAnalyticsData;
    }
    
    function getAnalyticsVideoType() {
        return videoAnalyticsData.videoType;
    }
    
    function clearDataCache() {
        this.live = [];
        this.featuredAutoPlayData = { videoId: null, isLive: false, isVod: false, isAuthenticatedContent: false, contentXMLPath: null, seekTo: 0 };
        this.liveAutoPlayData = { videoId: null };
        this.showsAutoPlayData = { videoId: null, isAuthenticatedContent: true, contentXMLPath: null, seekTo: 0 };
        this.videoAnalyticsData = {videoType: null, videoId: null, videoCategory: null, videoTitle: null, videoLength: null, videoAutoStart: null};
        clearPlaying();
    }

    function setPlaying(obj) { this.playingObj = obj; }
    function getPlaying() { return this.playingObj; }
    function clearPlaying() { this.playingObj = {}; }
}