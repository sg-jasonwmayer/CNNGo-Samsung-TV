(function() {
    'use strict';
  
    angular.module('appConstants').constant('ANALYTICS', {
        variables: {
            pageName: 'pageName',
            page: 'page', 
            section: 'section',
            subsection: 'subsection',
            appName: 'appName',
            businessUnit: 'businessUnit',
            templateType: 'templateType',
            contentType: 'contentType',
            authRequired: 'authRequired',
            codeVersion: 'codeVersion',
            mvpd: 'mvpd',
            adobeHashID: 'adobeHashID',
            pageView: 'pageView',
            videoID: 'videoID',
            liveStreamName: 'liveStreamName',
            contentTypeLevel2: 'contentTypeLevel2',
            autoStartType: 'autoStartType',
            videoStartEvent: 'videoStartEvent',
            liveVideoStartEvent: 'liveVideoStartEvent',
            episodeStartEvent: 'episodeStartEvent',
            segmentStartEvent: 'segmentStartEvent',
            videoPlayerType: 'videoPlayerType',
            videoCategory: 'videoCategory',
            videoLength: 'videoLength',
            videoTitle: 'videoTitle',
            broadcastFranchise: 'broadcastFranchise',
            videoTimeSpentEvent: 'videoTimeSpentEvent',
            videoCompleteEvent: 'videoCompleteEvent',
            interactionEvent: 'interactionEvent',
            interaction: 'interaction',
            linkTrackVars: 'linkTrackVars',
            videoEvent: 'videoEvent',
            debug: 'debugParam'
        },
        values: {
            page: {
                categoriesPrefix: 'cnn:samsungtv:',
                entry: 'cnn:samsungtv:watch cnn',
                featured: 'cnn:samsungtv:featured',
                live: 'cnn:samsungtv:live',
                menu: 'cnn:samsungtv:',
                shows: 'cnn:samsungtv:shows',
                showsDetailPrefix: 'cnn:samsungtv:shows/',
                search: 'cnn:samsungtv:search',
                settingsPrefix: 'cnn:samsungtv:settings/',
                VODClips: 'cnn:samsungtv:video'
            },
            section: {
                categories: 'categories',
                entry: 'watch cnn',
                featured: 'featured',
                live: 'live',
                shows: 'shows',
                showsDetail: 'shows',
                search: 'search',
                settings: 'settings',
                VODClips: 'featured',
                menu: {
                  featured: 'featured:',
                  shows: 'shows:',
                  live: 'live:',
                  search: 'search:',
                  settings: 'settings:'
                }

            },
            subsection: {
                entry: 'watch cnn: entry',
                featured: 'featured:',
                live: 'live:',
                categories: 'categories:nvs',
                shows: 'shows:',
                showsDetailPrefix: 'shows:',
                search: 'search:',
                settingsPrefix: 'settings:',
                VODClipsPrefix: 'featured:',
                menu: {
                  featured: 'featured',
                  shows: 'shows',
                  live: 'live',
                  search: 'search',
                  settings: 'settings'
                },
                settings: {
                  signIn: 'signIn',
                  accesibility: 'accesibility',
                  privacyPolicy: 'privacy',
                  termsConditions: 'terms'
                
                }
            },
            appName: {
                samsungtv: 'samsungtv'
            },
            businessUnit: {
              cnnDomestic: 'cnn domestic'
            },
            templateType: {
                sectionFront: 'adbp:section front',
                video: 'adbp:video',
                shows: 'adbp:shows',
                search: 'other:search',
                settings: 'other:settings',
                misc: 'adbp:misc'
            },
            contentType: {
              none: 'adbp:none',
              videoStart: 'adbp:video start'
            },
            mvpd: {
              none: 'no mvpd set'
            },
            adobeHashID: {
              none: 'no mvpd set'
            },
            events: {
                pageView: '1',
                videoStart: '1',
                videoComplete: '1',
                videoTimeSpent: '60',
                liveVideoStartEvent: '1'
            },
            videoPlayerType: {
                main: 'cnn:samsungtv',
                squeezeback: 'cnn:samsungtv:squeezeback'
            },
            videoCategory: {
                featured: 'featured',
                shows: 'shows',
                series: 'shows',
                live: 'live',
                mustSee: 'must see',
                rc: 'related coverage'
            },
            broadcastFranchise: {
                none: 'nvs'
            },
            autoStartType: {
                entry: 'samsungtv:autostart:live:entry',
                none: 'samsungtv:noautostart:live:none',
                vodauto: 'samsungtv:autostart:ondemand:none',
                vodnoauto: 'samsungtv:noautostart:ondemand:none',
                rcvideo: 'samsungtv:noautostart:rvideo:none',
                clip: 'samsungtv:noautostart:clip:none',
                clipauto: 'samsungtv:autostart:clip:none'
            },
            contentTypeLevel2: {
                live: 'video:live:tve:live:live:content',
                dvr: 'video:live:tve:dvr:insidelivebuffer:content',
                vodLinear: 'video:vod:tve:episode:c5linear:content',
                vodLinear_noAuth: 'video:vod:nontve:episode:c5linear:content',
                clip: 'video:vod:non tve:clip:clip:content',
                rcvideo: 'video:rcvideo:tve:clip:clip:content'
            },
            authRequired: {
                none: 'does not require authentication',
                yes: 'requires authentication'
            },
            liveVideoTitle: {
                cnnd: 'cnn news',
                cnni: 'cnni news',
                hln: 'hln news'
            }
        },
        videoEvent: {
            start: 'start',
            progress: 'progress',
            end: 'end'
        },
        videoType: {
            clip: 'clip',
            live: 'live',
            show: 'show'
        }
    });
})();