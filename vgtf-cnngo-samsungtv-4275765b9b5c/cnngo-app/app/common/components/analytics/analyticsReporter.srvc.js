'use strict';

angular.module('analytics.service', []).service('analyticsReporter', analyticsReporter);

function analyticsReporter(ANALYTICS, analyticsFactory, Auth, AuthManager, dataCacheService, $interval, $rootScope, APP_CONSTANTS) {
    
    var progressBeaconPromise;
    
    this.sendFeaturedPageEvent = sendFeaturedPageEvent;
    this.sendEntryPageEvent = sendEntryPageEvent;
    this.sendLivePageEvent = sendLivePageEvent;
    this.sendSettingsPageEvent = sendSettingsPageEvent;
    this.sendCategoriesPageEvent = sendCategoriesPageEvent;
    this.sendClipsVideoAnalytics = sendClipsVideoAnalytics;
    this.sendLiveVideoAnalytics = sendLiveVideoAnalytics;
    this.sendVODVideoAnalytics = sendVODVideoAnalytics;
    this.sendVODPageEvent = sendVODPageEvent;
    this.sendShowsPageEvent = sendShowsPageEvent;
    this.sendMenuPageEvent = sendMenuPageEvent;
    this.sendShowsDetailsPageEvent = sendShowsDetailsPageEvent;
    this.startVideoProgressBeacon = startVideoProgressBeacon;
    this.stopVideoProgressBeacon = stopVideoProgressBeacon;

    
    // Function constructor for page analytics data
    function PageAnalyticsData(pageData) {
        this[ANALYTICS.variables.page] =  pageData[ANALYTICS.variables.page];
        this[ANALYTICS.variables.section] = pageData[ANALYTICS.variables.section];
        this[ANALYTICS.variables.subsection] = pageData[ANALYTICS.variables.subsection];
        this[ANALYTICS.variables.appName] = ANALYTICS.values.appName.samsungtv;
        this[ANALYTICS.variables.businessUnit] = ANALYTICS.values.businessUnit.cnnDomestic;
        this[ANALYTICS.variables.templateType] = pageData[ANALYTICS.variables.templateType];
        this[ANALYTICS.variables.contentType] = ANALYTICS.values.contentType.none;
        this[ANALYTICS.variables.codeVersion] = "1.0"; // TODO: Get app version from config
        this[ANALYTICS.variables.pageView] = ANALYTICS.values.events.pageView;
        this[ANALYTICS.variables.mvpd] = ANALYTICS.values.mvpd.none;
        this[ANALYTICS.variables.adobeHashID] = ANALYTICS.values.adobeHashID.none;
    }
    
    // Function constructor for video analytics data
    function VideoAnalyticsData(videoData) {
        this[ANALYTICS.variables.videoPlayerType] =  videoData[ANALYTICS.variables.videoPlayerType];
        this[ANALYTICS.variables.videoCategory] =  videoData[ANALYTICS.variables.videoCategory];
        this[ANALYTICS.variables.page] =  videoData[ANALYTICS.variables.page];
        this[ANALYTICS.variables.section] = videoData[ANALYTICS.variables.section];
        this[ANALYTICS.variables.subsection] = videoData[ANALYTICS.variables.subsection];
        this[ANALYTICS.variables.appName] = ANALYTICS.values.appName.samsungtv;
        this[ANALYTICS.variables.videoTitle] = videoData[ANALYTICS.variables.videoTitle];
        this[ANALYTICS.variables.businessUnit] = ANALYTICS.values.businessUnit.cnnDomestic;
        this[ANALYTICS.variables.templateType] = videoData[ANALYTICS.variables.templateType];
        this[ANALYTICS.variables.contentType] = videoData[ANALYTICS.variables.contentType];
        this[ANALYTICS.variables.authRequired] = videoData[ANALYTICS.variables.authRequired];
        this[ANALYTICS.variables.codeVersion] = "1.0"; // TODO: Get app version from config
        this[ANALYTICS.variables.videoID] = videoData[ANALYTICS.variables.videoID];
        this[ANALYTICS.variables.contentTypeLevel2] = videoData[ANALYTICS.variables.contentTypeLevel2];
        this[ANALYTICS.variables.linkTrackVars] = ''; // TODO: Value to be set
    }
    
    function sendFeaturedPageEvent() {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.featured;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.featured;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.featured;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.sectionFront;
        
        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }

    function sendShowsPageEvent() {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.shows;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.shows;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.shows;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.sectionFront;
        
        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }

    function sendShowsDetailsPageEvent(showName) {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.showsDetailPrefix + showName;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.shows;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.showsDetailPrefix + showName;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.sectionFront;
        
        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }

    function sendEntryPageEvent() {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.entry;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.entry;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.entry;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.misc;

        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }
  
    
    function sendVODPageEvent(laneName) {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.VODClips;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.VODClips;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.VODClipsPrefix + laneName;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.video;

        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }


    function sendCategoriesPageEvent(page) {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.categories + page;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.categories; 
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.nvs;
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.sectionFront;

        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }

     function sendLivePageEvent() {
        var pageData = {};
       pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.live;
       pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.live;
       pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.live;
       pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.sectionFront;
       
         var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
         analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
     }

     function sendSettingsPageEvent(page) {
        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.settings;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.settings;
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.settings + page; 
        pageData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.settings;

        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);

     }

      function sendMenuPageEvent(page) {

        var pageData = {};
        pageData[ANALYTICS.variables.page] = ANALYTICS.values.page.menu;
        pageData[ANALYTICS.variables.section] = ANALYTICS.values.section.menu + page; 
        pageData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection + page;

        var pageAnalyticsDataObj = new PageAnalyticsData(pageData);
        analyticsFactory.sendPageEvent(pageAnalyticsDataObj);
    }

    function sendClipsVideoAnalytics(videoEvent) {

        var videoEventType = '';
        var clipAnalyticsData = dataCacheService.getVideoAnalyticsData();

        var videoData = {};
        videoData[ANALYTICS.variables.videoPlayerType] = ANALYTICS.values.videoPlayerType.main;
        videoData[ANALYTICS.variables.videoCategory] =  clipAnalyticsData.videoCategory;
        videoData[ANALYTICS.variables.page] =  ANALYTICS.values.page.featured;
        videoData[ANALYTICS.variables.section] = ANALYTICS.values.section.featured;
        videoData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.featured;
        videoData[ANALYTICS.variables.videoTitle] = clipAnalyticsData.videoTitle;
        videoData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.video;
        videoData[ANALYTICS.variables.contentType] = ANALYTICS.values.contentType.videoStart;
        videoData[ANALYTICS.variables.authRequired] = ANALYTICS.values.authRequired.none;
        videoData[ANALYTICS.variables.videoID] = clipAnalyticsData.videoId;
        videoData[ANALYTICS.variables.contentTypeLevel2] = ANALYTICS.values.contentTypeLevel2.clip;
        
        var videoAnalyticsDataObj = new VideoAnalyticsData(videoData);
        
        if(videoEvent === ANALYTICS.videoEvent.start) {
            videoAnalyticsDataObj[ANALYTICS.variables.videoLength] =  clipAnalyticsData.videoLength;
            videoAnalyticsDataObj[ANALYTICS.variables.mvpd] = AuthManager.getCurrentMvpdAnalytics() || ANALYTICS.values.mvpd.none;
            videoAnalyticsDataObj[ANALYTICS.variables.adobeHashID] = Auth.getAdobeUserId() || ANALYTICS.values.adobeHashID.none;
            videoAnalyticsDataObj[ANALYTICS.variables.autoStartType] = clipAnalyticsData.videoAutoStart ? ANALYTICS.values.autoStartType.clipauto : ANALYTICS.values.autoStartType.clip;
            videoAnalyticsDataObj[ANALYTICS.variables.videoStartEvent] = ANALYTICS.values.events.videoStart;
            videoAnalyticsDataObj[ANALYTICS.variables.broadcastFranchise] = clipAnalyticsData.videoTitle || ANALYTICS.values.broadcastFranchise.none;
            videoEventType = ANALYTICS.variables.videoStartEvent;
        }
        else if(videoEvent === ANALYTICS.videoEvent.progress) {
            videoAnalyticsDataObj[ANALYTICS.variables.videoLength] =  clipAnalyticsData.videoLength;
            videoAnalyticsDataObj[ANALYTICS.variables.videoTimeSpentEvent] = ANALYTICS.values.events.videoTimeSpent;
            videoAnalyticsDataObj[ANALYTICS.variables.broadcastFranchise] = clipAnalyticsData.videoTitle || ANALYTICS.values.broadcastFranchise.none;
            videoEventType = ANALYTICS.variables.videoTimeSpentEvent;
        }
        else if(videoEvent === ANALYTICS.videoEvent.end) {
            videoAnalyticsDataObj[ANALYTICS.variables.videoLength] =  clipAnalyticsData.videoLength;
            videoAnalyticsDataObj[ANALYTICS.variables.videoCompleteEvent] = ANALYTICS.values.events.videoComplete;
            videoAnalyticsDataObj[ANALYTICS.variables.broadcastFranchise] = clipAnalyticsData.videoTitle || ANALYTICS.values.broadcastFranchise.none;
            videoEventType = ANALYTICS.variables.videoCompleteEvent;
        }
        
        analyticsFactory.sendVideoEvent(videoAnalyticsDataObj, videoEventType);
    }
    
    function sendLiveVideoAnalytics(videoEvent) {

        var videoEventType = '';
        var liveAnalyticsData = dataCacheService.getVideoAnalyticsData();

        var videoData = {};
        videoData[ANALYTICS.variables.videoPlayerType] = ANALYTICS.values.videoPlayerType.main;
        videoData[ANALYTICS.variables.videoCategory] =  liveAnalyticsData.videoCategory;
        
        if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
            videoData[ANALYTICS.variables.page] =  ANALYTICS.values.page.featured;
            videoData[ANALYTICS.variables.section] = ANALYTICS.values.section.featured;
            videoData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.featured;
        }
        else {
            videoData[ANALYTICS.variables.page] =  ANALYTICS.values.page.live;
            videoData[ANALYTICS.variables.section] = ANALYTICS.values.section.live;
            videoData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.live;
        }
        
        videoData[ANALYTICS.variables.videoTitle] = liveAnalyticsData.videoTitle;
        videoData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.video;
        videoData[ANALYTICS.variables.contentType] = ANALYTICS.values.contentType.videoStart;
        videoData[ANALYTICS.variables.authRequired] = ANALYTICS.values.authRequired.yes;
        videoData[ANALYTICS.variables.videoID] = liveAnalyticsData.videoId;
        videoData[ANALYTICS.variables.contentTypeLevel2] = ANALYTICS.values.contentTypeLevel2.live;
        
        var videoAnalyticsDataObj = new VideoAnalyticsData(videoData);
        
        if(videoEvent === ANALYTICS.videoEvent.start) {
            videoAnalyticsDataObj[ANALYTICS.variables.liveStreamName] =  liveAnalyticsData.videoTitle;
            videoAnalyticsDataObj[ANALYTICS.variables.mvpd] = AuthManager.getCurrentMvpdAnalytics() || ANALYTICS.values.mvpd.none;
            videoAnalyticsDataObj[ANALYTICS.variables.adobeHashID] = Auth.getAdobeUserId() || ANALYTICS.values.adobeHashID.none;
            videoAnalyticsDataObj[ANALYTICS.variables.autoStartType] = liveAnalyticsData.videoAutoStart ? ANALYTICS.values.autoStartType.entry : ANALYTICS.values.autoStartType.none;
            videoAnalyticsDataObj[ANALYTICS.variables.videoStartEvent] = ANALYTICS.values.events.videoStart;
            videoAnalyticsDataObj[ANALYTICS.variables.liveVideoStartEvent] = ANALYTICS.values.events.liveVideoStartEvent;
            videoEventType = ANALYTICS.variables.liveVideoStartEvent;
        }
        else if(videoEvent === ANALYTICS.videoEvent.progress) {
            videoAnalyticsDataObj[ANALYTICS.variables.liveStreamName] =  liveAnalyticsData.videoTitle;
            videoAnalyticsDataObj[ANALYTICS.variables.mvpd] = AuthManager.getCurrentMvpdAnalytics() || ANALYTICS.values.mvpd.none;
            videoAnalyticsDataObj[ANALYTICS.variables.adobeHashID] = Auth.getAdobeUserId() || ANALYTICS.values.adobeHashID.none;
            videoAnalyticsDataObj[ANALYTICS.variables.videoTimeSpentEvent] = ANALYTICS.values.events.videoTimeSpent;
            videoEventType = ANALYTICS.variables.videoTimeSpentEvent;
        }
        
        analyticsFactory.sendVideoEvent(videoAnalyticsDataObj, videoEventType);
    }

    function sendVODVideoAnalytics(videoEvent){
        var videoEventType = '';
        var vodAnalyticsData = dataCacheService.getVideoAnalyticsData();

        var videoData = {};
        videoData[ANALYTICS.variables.videoPlayerType] = ANALYTICS.values.videoPlayerType.main;
        
        if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
            videoData[ANALYTICS.variables.page] =  ANALYTICS.values.page.featured;
            videoData[ANALYTICS.variables.section] = ANALYTICS.values.section.featured;
            videoData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.featured;
            videoData[ANALYTICS.variables.videoCategory] =  ANALYTICS.values.videoCategory.featured;
        } 
        else if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.shows.state) {
            videoData[ANALYTICS.variables.page] =  ANALYTICS.values.page.shows;
            videoData[ANALYTICS.variables.section] = ANALYTICS.values.section.shows;
            videoData[ANALYTICS.variables.subsection] = ANALYTICS.values.subsection.shows;
            videoData[ANALYTICS.variables.videoCategory] =  ANALYTICS.values.videoCategory.shows;
        }
        
        videoData[ANALYTICS.variables.videoTitle] = vodAnalyticsData.videoTitle;
        videoData[ANALYTICS.variables.templateType] = ANALYTICS.values.templateType.video;
        videoData[ANALYTICS.variables.contentType] = ANALYTICS.values.contentType.videoStart;
        videoData[ANALYTICS.variables.authRequired] = ANALYTICS.values.authRequired.yes;
        videoData[ANALYTICS.variables.videoID] = vodAnalyticsData.videoId;
        videoData[ANALYTICS.variables.contentTypeLevel2] = ANALYTICS.values.contentTypeLevel2.vodLinear;
        
        var videoAnalyticsDataObj = new VideoAnalyticsData(videoData);
        
        if(videoEvent === ANALYTICS.videoEvent.start) {
            videoAnalyticsDataObj[ANALYTICS.variables.liveStreamName] =  vodAnalyticsData.videoTitle;
            videoAnalyticsDataObj[ANALYTICS.variables.autoStartType] = vodAnalyticsData.videoAutoStart ? ANALYTICS.values.autoStartType.entry : ANALYTICS.values.autoStartType.none;
            videoAnalyticsDataObj[ANALYTICS.variables.videoStartEvent] = ANALYTICS.values.events.videoStart;
            videoEventType = ANALYTICS.variables.videoStartEvent;
        }
        else if(videoEvent === ANALYTICS.videoEvent.progress) {
            videoAnalyticsDataObj[ANALYTICS.variables.liveStreamName] =  vodAnalyticsData.videoTitle;
            videoAnalyticsDataObj[ANALYTICS.variables.mvpd] = AuthManager.getCurrentMvpdAnalytics() || ANALYTICS.values.mvpd.none;
            videoAnalyticsDataObj[ANALYTICS.variables.adobeHashID] = Auth.getAdobeUserId() || ANALYTICS.values.adobeHashID.none;
            videoAnalyticsDataObj[ANALYTICS.variables.videoTimeSpentEvent] = ANALYTICS.values.events.videoTimeSpent;
            videoEventType = ANALYTICS.variables.videoTimeSpentEvent;
        }
        else if(videoEvent === ANALYTICS.videoEvent.end) {
            videoAnalyticsDataObj[ANALYTICS.variables.videoLength] =  vodAnalyticsData.videoLength;
            videoAnalyticsDataObj[ANALYTICS.variables.videoCompleteEvent] = ANALYTICS.values.events.videoComplete;
            videoAnalyticsDataObj[ANALYTICS.variables.broadcastFranchise] = vodAnalyticsData.videoTitle || ANALYTICS.values.broadcastFranchise.none;
            videoEventType = ANALYTICS.variables.videoCompleteEvent;
        }
        
        analyticsFactory.sendVideoEvent(videoAnalyticsDataObj, videoEventType);
    }
    
    function startVideoProgressBeacon() {
        stopVideoProgressBeacon();
        progressBeaconPromise = $interval(videoProgressBeacon, 60000);
    }
    
    function stopVideoProgressBeacon() {
        $interval.cancel(progressBeaconPromise);
    }
    
    function videoProgressBeacon() {
        var videoType = dataCacheService.getAnalyticsVideoType();
        
        if(ANALYTICS.videoType.clip === videoType) {
            sendClipsVideoAnalytics(ANALYTICS.videoEvent.progress);
        }
        else if(ANALYTICS.videoType.live === videoType) {
            sendLiveVideoAnalytics(ANALYTICS.videoEvent.progress);
        }
        else if(ANALYTICS.videoType.show === videoType){
            sendVODVideoAnalytics(ANALYTICS.videoEvent.progress)
            

        }
    }
    
}