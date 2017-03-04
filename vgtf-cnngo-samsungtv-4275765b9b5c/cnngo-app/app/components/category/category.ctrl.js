(function() {
    'use strict';

    angular.module('category.controller', []).controller('categoryController', categoryController);

	function categoryController($rootScope, $scope, $timeout, $state, $stateParams, $compile, categoryData, focusController, APP_CONSTANTS, playerService, analyticsReporter, autoPlayFactory, keyManagerService, KEY, EVENTS) {
	    
        $rootScope.currentGlobalNavItem = APP_CONSTANTS.globalNavigationItems.category.state;

        // Assign key handler
        keyManagerService.resetKeyCallbackHandler();
        keyManagerService.setKeyCallbackHandler(KEY.keyName.COLOR_F0_RED, $rootScope.mainAutoRecedeHandler);
        keyManagerService.setKeyCallbackHandler([KEY.keyName.ARROW_LEFT,
                KEY.keyName.ARROW_UP,
                KEY.keyName.ARROW_RIGHT,
                KEY.keyName.ARROW_DOWN
            ],
            $rootScope.resetAutoRecedeTimer);

        keyManagerService.pushHistoryCallback(backKeyHandler);

        $scope.categoryName = $stateParams.category;
        $scope.clips = categoryData;

        var playList = $compile('<play-list-category></play-list-category>')($scope);

        $('#listContainer').append(playList);

        function backKeyHandler() {
            if ($scope.showGlobalNavMainContent === true) {
                $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                
                focusController.setDepth(APP_CONSTANTS.navigationDepth.featured);
                $rootScope.currentGlobalNavItem = APP_CONSTANTS.globalNavigationItems.featured.state;
                $state.go('main.featured', {
                    previousFocus: $stateParams.previousFocusId
                });
            }
        }

        //$on broadcast from "SELECT" build the playlist.
        $rootScope.$on('createPlayList', function(event, data) {
            autoPlayFactory.setPlayList(categoryData);
        })

        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                // Set focus on the first video
                focusController.setDepth(APP_CONSTANTS.navigationDepth.categories);
                focusController.focus($('#' + $scope.clips[0].id));
            }, 200);
        });

        //Analytics - Report Category page event
        analyticsReporter.sendCategoriesPageEvent();

        $rootScope.$broadcast(EVENTS.displayMainContentLoading, false);
    }

})();
