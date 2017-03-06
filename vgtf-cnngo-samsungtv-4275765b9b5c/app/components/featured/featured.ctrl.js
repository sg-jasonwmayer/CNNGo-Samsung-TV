(function() {
    'use strict';

    angular.module('featured.controller', []).controller('featuredController',
            featuredController);

    function featuredController($rootScope, $scope, $stateParams, pageData, $timeout, categoriesListData, $compile, focusController, playerService, analyticsReporter, APP_CONSTANTS, FocusConstant, autoPlayFactory, keyManagerService, KEY, EVENTS) {
        //Analytics - Report feature page event
        analyticsReporter.sendFeaturedPageEvent();
        
        // Assign key handler
        keyManagerService.resetKeyCallbackHandler();
        keyManagerService.setKeyCallbackHandler(KEY.keyName.COLOR_F0_RED, $rootScope.mainAutoRecedeHandler);
        keyManagerService.setKeyCallbackHandler([ KEY.keyName.ARROW_LEFT,
                                                  KEY.keyName.ARROW_UP,
                                                  KEY.keyName.ARROW_RIGHT,
                                                  KEY.keyName.ARROW_DOWN ], 
                                                  $rootScope.resetAutoRecedeTimer);

        for(var i = 0; i < pageData.length; i++) {
            var dataVar = 'playListData' + i; 
            var playListIdentifier = dataVar + "featured";
            $scope[dataVar]  = {};
            $scope[dataVar].data = pageData[i].content;
            $scope[dataVar].depth =  APP_CONSTANTS.navigationDepth.featured;
            
            var playList = '';

            if('smallCarousel' === pageData[i].rowType) {
                playList = $compile("<play-list-live id='" + i + "' title='" + pageData[i].label + "' listData='" + dataVar + "' playlistidentifier='" + playListIdentifier + "'></play-list-live>")($scope);
            }
            else if('posterCarousel' === pageData[i].rowType) {
                playList = $compile("<play-list-series id='" + i + "' title='" + pageData[i].label + "' listData='" + dataVar + "' playlistidentifier='" + playListIdentifier + "'></play-list-series>")($scope);
            }
            else {
                playList = $compile("<play-list id='" + i + "' title='" + pageData[i].label + "' listData='" + dataVar + "' playlistidentifier='" + playListIdentifier + "'></play-list>")($scope);
            }

            $('#listContainer').append(playList);
        }

        $scope.showFullOverlay = false;
        $scope.$on('globalNavDisplay', function(event, playListId) {
            if(!$scope.showFullOverlay && (playListId > 0.5)) {
                $scope.showFullOverlay = true;
            }
            else if ($scope.showGlobalNav && (playListId < 0.5)) {
                $scope.showFullOverlay = false;
            }
        });

        //$on broadcast from "SELECT" build the playlist based on media type. 
        $rootScope.$on('createPlayList', function(event, data) {
            if (data.type === 'clip') {
                var clipList = [];
                var currentIndex = 0;
                var laneName = "unknown";

                for(var i = 0; i < pageData.length; i++) {
                     if('carouselCollection' === pageData[i].rowType) {
                        for (var j = 0; j < pageData[i].content.length; j++) {
                             clipList.push(pageData[i].content[j]);
                             if (data.asset.id === pageData[i].content[j].id) {
                                currentIndex = j;
                                laneName = pageData[i].label;
                             }
                         };
                     }
                }

                autoPlayFactory.setPlayList(clipList, currentIndex);
                analyticsReporter.sendVODPageEvent(laneName);
            }

        })
   
        $scope.categoriesListData = {};
        $scope.categoriesListData.data = categoriesListData;
        $scope.categoriesListData.depth =  APP_CONSTANTS.navigationDepth.featured;
        
        var playListCategory = $compile("<play-list-categories id='" + pageData.length + "' title='Categories' listData='categoriesListData' playlistidentifier='categoriesfeatured'></play-list-categories>")($scope);
        $('#listContainer').append(playListCategory);

        $scope.$on('featuredPageLoaded', function(event, loaded) {
            if(loaded) {
                $timeout(function() {
                    var lastPlayingItem = JSON.parse(localStorage.getItem("lastPlayingItem"));
                    if(lastPlayingItem !== null){
                        $scope.$emit('createPlayList', { type : lastPlayingItem.type, asset : lastPlayingItem.data});                        
                        localStorage.removeItem("lastPlayingItem");
                        $rootScope.$broadcast(EVENTS.resumeLastPlayingContent, lastPlayingItem);
                    }
                    else if ($stateParams.previousFocusId === null) {
                        // Initiate auto play 
                        // build playlist
                        if (!autoPlayFactory.isPlayListPopulated()) {
                            $scope.$emit('createPlayList', { type : 'clip', asset : pageData[0].content[0]});
                        }
                        playerService.autoStart();
                    } else {
                        for (var i = 0; i <= $scope.categoriesListData.data.length; i ++) {
                            if ($scope.categoriesListData.data[i].id === $stateParams.previousFocusId) {
                                if (i > 3) {
                                    focusController.focus($('#' + $scope.categoriesListData.data[3].id).eq(0));
                                    var rightInterval = 3;
                                    var scrollInterval = setInterval(function () {
                                        if (rightInterval === i) {
                                            clearInterval(scrollInterval);
                                            $stateParams.previousFocusId = null;
                                        } else {
                                            var e = jQuery.Event("keydown");
                                            e.which = FocusConstant.DEFAULT.KEY_MAP.RIGHT;
                                            e.keyCode = FocusConstant.DEFAULT.KEY_MAP.RIGHT;
                                            $("body").trigger(e);
                                            rightInterval += 1;
                                        }
                                    }, 300)
                                } else {
                                    focusController.focus($('#' + $stateParams.previousFocusId));
                                    $stateParams.previousFocusId = null;
                                }
                                break;
                            }
                        }
                    }
                }, 0);
            }
        });
        
        $rootScope.$broadcast(EVENTS.displayMainContentLoading, false);
    }

})();
