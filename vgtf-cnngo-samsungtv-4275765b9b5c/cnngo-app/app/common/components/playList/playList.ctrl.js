(function() {
    'use strict';

    angular.module('playList.controller', []).controller('playListController',
        playListController);


    function playListController($scope, $rootScope, $timeout, $state, FocusUtil, playerService, focusController, FocusConstant, appDataService, AuthManager, EVENTS, APP_CONSTANTS, dataCacheService, modalControllerService, analyticsReporter, ANALYTICS, keyManagerService) {
        $scope.displayVodContainer = false;
        $scope.isFocusedOnEpisode = false;
        $scope.isActivePlaylist = false;
        $scope.navItems = APP_CONSTANTS.globalNavigationItems;
        $scope.vodData = [];

        $scope.currentFocusItem = focusController.getCurrentFocusItem();

        $scope.selectedSeries = '';

        $scope.isAuthenticated = AuthManager.isAuthenticated();

        $rootScope.$on(EVENTS.hideSignInModel, function($event, playlistidentifier) {
            $scope.isAuthenticated = AuthManager.isAuthenticated();
            if ($scope.playlistidentifier == playlistidentifier) {
                if ($scope.isAuthenticated === true) {
                    $timeout(function() {
                        $scope.$emit('overlayAutoRecede', false);
                    }, 1000);
                    if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
                        playerService.autoStart();
                        return false;
                    } else if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.live.state) {
                        playerService.autoStartLive();
                        return false;
                    }
                    else if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.shows.state) {
                        playerService.autoStartVod();
                        return false;
                    }
                }
            }
        });

        $rootScope.$on(EVENTS.authNExpired, function() {
            $scope.isAuthenticated = false;
        });

        focusController.addBeforeKeydownHandler(function(context) {
            if ($scope.isActivePlaylist === true) {
                if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.RIGHT) {
                    if ($scope.isLastItem) {
                        return false;
                        // TODO : To turn looping back on, uncomment the below code and delete the 'return false' above.
                        // if ($scope.displayVodContainer && ($scope.vodData.length <= APP_CONSTANTS.wrapLimit.playList)) {
                        //     return false;
                        // } else if ($scope.listData.length <= APP_CONSTANTS.wrapLimit[$scope.directiveName]) {
                        //     return false;
                        // }
                    }
                } else if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.LEFT) {
                    if ($scope.isFirstItem) {
                        return false;
                        // TODO : To turn looping back on, uncomment the below code and delete the 'return false' above.
                        // if ($scope.displayVodContainer && ($scope.vodData.length <= APP_CONSTANTS.wrapLimit.playList)) {
                        //     return false;
                        // } else if ($scope.listData.length <= APP_CONSTANTS.wrapLimit[$scope.directiveName]) {
                        //     return false;
                        // }
                    }
                }
            }
        });

        focusController.addAfterKeydownHandler(function(context) {
            if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.DOWN && $scope.isFocusedOnEpisode && $scope.displayVodContainer||
                context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.UP && $scope.isFocusedOnEpisode && $scope.displayVodContainer) {
                keyManagerService.updateHistoryCallback(hideVodContainer);
                hideVodContainer();
            }
        })

        function hideVodContainer() {
            $scope.displayVodContainer = false;
            $scope.isFocusedOnEpisode = false;
            $scope.vodData = [];

            focusController.focus($scope.selectedSeries);

            $rootScope.resetAutoRecedeTimer();

            if ($scope.selectedSeries !== '') {
              $scope.selectedSeries.removeClass('selectedSeries');
              $scope.selectedSeries = '';
            }
        }

        // The callback function which is called when each list component get the 'focus'.
        $scope.focus = function($event, category, data, $index, $first, $last) {
            $scope.isActivePlaylist = true;
            $scope.isFirstItem = $first;
            $scope.isLastItem = $last;
            $scope.$emit('globalNavDisplay', category);

            if (!$scope.isFocusedOnEpisode) {
                $rootScope.$broadcast('seriesSelected', data.item);
            }
            var top = getTop();
            var scrollCount = category;

      var moveValue = top * scrollCount;
      if ($('.listItem').length - 1 === parseInt(scrollCount)) {
        moveValue = -(($('#listContainer').height() - $(window).height()) + 100);
      }

      // Translate each list component to up or down.
      moveContainer(category, 'listContainer', moveValue);
      if (!data || !data.item || data.item.loaded === false) {
        return;
      }

            if($rootScope.FirstMoveFromGlobalNav === true){
                $rootScope.FirstMoveFromGlobalNav = false;
                if($rootScope.currentGlobalNavItem === $scope.navItems.live.state){
                    focusController.focus($("#cnnd"));
                } else {
                    focusController.focus($("#" + data.listData[0].id));
                }
            }
        };

        // The callback function which is called when each list component lose the 'focus'.
        $scope.blur = function($event, category, data) {
            $scope.isActivePlaylist = false;
            $scope.isFirstItem = false;
            $scope.isLastItem = false;
            $scope.isOverviewDark = true;
        };

        $scope.select = function($event, category, data, $index) {
            $timeout(function() {
                $scope.$emit('overlayAutoRecede', false);
            }, 1000);

            $rootScope.$broadcast('createPlayList', { type : 'clip', asset : data.item });
            dataCacheService.setCurrentVideoLength(data.item.totalRunTime);
            dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.clip, data.item.videoID, data.item.episodeName, data.item.title, Math.floor(data.item.totalRunTime), false);
            playerService.playClip(data.item);
        };

        $scope.selectEpisode = function($event, item) {
            $scope.isAuthenticated = AuthManager.isAuthenticated();
            if($scope.isAuthenticated === true) {
                $timeout(function() {
                    $scope.$emit('overlayAutoRecede', false);
                }, 1000);
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, item.id, item.episodeName, item.title, Math.floor(item.totalRunTime), false);
                dataCacheService.setCurrentVideoLength(item.totalRunTime);
                playerService.playEpisode(item, item.id);
            } else if(item.isAuthenticatedContent === false){
                $timeout(function() {
                    $scope.$emit('overlayAutoRecede', false);
                }, 1000);
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, item.id, item.episodeName, item.title, Math.floor(item.totalRunTime), false);
                dataCacheService.setCurrentVideoLength(item.totalRunTime);
                playerService.playUnauthenticatedEpisode(item, item.id);
            } else {
                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.show, item.id, item.episodeName, item.title, Math.floor(item.totalRunTime), false);
                if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
                    dataCacheService.setFeaturedAutoPlayVideoData(item.id, false, true, item.isAuthenticatedContent, item.contentXMLPath);
                }
                else if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.shows.state) {
                    dataCacheService.setShowsAutoPlayData(item.id, item.isAuthenticatedContent, item.contentXMLPath);
                }
                modalControllerService.showModal(APP_CONSTANTS.modals.signIn, $scope.playlistidentifier);
            }
        }

        $scope.selectLive = function($event, data, $index) {
            //Need to check authentication each time we select content.
            $scope.isAuthenticated = AuthManager.isAuthenticated();
            if($scope.isAuthenticated) {
                $timeout(function() {
                    $scope.$emit('overlayAutoRecede', false);
                }, 1000);

                dataCacheService.setVideoAnalyticsData(ANALYTICS.videoType.live, data.item.titleID, ANALYTICS.values.section.live, ANALYTICS.values.liveVideoTitle[data.item.titleID], 0, false);
                var live = {id: data.item.titleID };
                playerService.playLive(live);
            }
            else {
                if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
                    dataCacheService.setFeaturedAutoPlayVideoData($scope.listData[$index].titleID, true, false, true, null);
                }
                else if($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.live.state) {
                    dataCacheService.setLiveAutoPlayData($scope.listData[$index].titleID);
                }
                modalControllerService.showModal(APP_CONSTANTS.modals.signIn, $scope.playlistidentifier);
            }
        };

        $scope.selectCategory = function(category, id, $index) {
            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
            $state.go('main.featured.category', { category : category, previousFocusId : id  });
        };

        var moveContainer = function(category, regionId, targetTop) {
            $('#' + regionId).css({
                transform: 'translate3d(0, ' + targetTop + 'px, 0)'
            });
        };

        $scope.$watchCollection('listdata', function(listdata) {
            if (listdata && listdata.data) {
                $scope.listData = listdata.data;
                $scope.listDepth = listdata.depth;
            }
        });

        $scope.getVods = function(seriesId, titleId, listCategory, id, title) {
            analyticsReporter.sendShowsDetailsPageEvent(title);
            $scope.vodData.length = 0;

            // Make call to papi to return episodes for a selected Series
            getVodData(seriesId, titleId).then(function(response) {
                for (var i = 0; i < response.length; i++) {
                    $scope.vodData.push(response[i]);
                }

                $('list-' + listCategory + '-vod').eq(0).trigger('reload');

                $scope.seriesTitle = $scope.vodData[0].title;
                $scope.seasonNumber = $scope.vodData[0].seasonNumber;
                $scope.backgroundUrl = $scope.vodData[0].backgroundPath;

                $rootScope.disableAutoRecedeTimer();

                var focusTimeout = setTimeout(function() {
                    $scope.selectedSeries = $('#' + id);
                    $scope.selectedSeries.addClass('selectedSeries');

                    if (titleId !== 0) {
                        for (var i = 0; i <= $scope.vodData.length; i++) {
                            if ($scope.vodData[i].titleId === titleId) {
                                if (i >= 3) {
                                    focusController.focus($('#' + $scope.vodData[3].id).eq(0));
                                    var rightInterval = 3;
                                    var scrollInterval = setInterval(function () {
                                        if (rightInterval === i) {
                                            clearInterval(scrollInterval);
                                        } else {
                                            var e = jQuery.Event("keydown");
                                            e.which = FocusConstant.DEFAULT.KEY_MAP.RIGHT;
                                            e.keyCode = FocusConstant.DEFAULT.KEY_MAP.RIGHT;
                                            $("body").trigger(e);
                                            rightInterval += 1;
                                        }
                                    }, 300)
                                } else {
                                    focusController.focus($('#' + $scope.vodData[i].id).eq(0));
                                }

                                break;
                            }

                        }
                    } else {
                      focusController.focus($('#' + $scope.vodData[0].id).eq(0));
                    }

                $scope.displayVodContainer = true;
                window.clearTimeout(focusTimeout);
                keyManagerService.pushHistoryCallback(hideVodContainer);
            }, 0);

        });
    };

        $scope.focusVod = function($event, category, data, $index, $first, $last) {
            $scope.currentFocus = $index;
            $scope.seriesTitle = data.item.title;
            $scope.seasonNumber = data.item.seasonNumber;
            $scope.backgroundUrl = data.item.backgroundPath;
            $scope.isFocusedOnEpisode = true;
            category = parseInt(category) + 1.5;
            $scope.focus($event, category, data, $index, $first, $last);
        }

        function getVodData(seriesId, titleId) {
            var promise = appDataService.getVodData(seriesId, titleId);
            return promise;
        }


        $scope.focusCategory = function ($event, data, $index, itemLength, $first, $last) {
            $scope.isActivePlaylist = true;
            $scope.isFirstItem = $first;
            $scope.isLastItem = $last;

            var ITEMS_PER_COLUMN = 4;
            var category = (parseInt($index/ITEMS_PER_COLUMN));

            var moveValue = -320 * category;
            if ($index >= itemLength - ITEMS_PER_COLUMN) {
              moveValue = -(($('#listContainer').height() - $(window).height()) + 275);
            }

            moveContainer(category, 'listContainer', moveValue);
            if (!data || !data.item || data.item.loaded === false) {
              return;
            }
        }

        var getTop = function() {
          if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
            return -420;
          } else if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.shows.state) {
            return -480
          }
        }

        $scope.$on('showPlayingBadge', function(event, videoId) {
          $scope.nowPlayingId = videoId;
        });
    }

})();
