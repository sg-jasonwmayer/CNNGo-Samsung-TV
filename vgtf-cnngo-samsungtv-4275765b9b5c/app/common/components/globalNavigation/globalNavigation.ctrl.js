(function() {
    'use strict';

    angular.module('globalNavigation.controller', []).controller(
            'globalNavigationController', globalNavigationController);

    function globalNavigationController($scope, $rootScope, APP_CONSTANTS,
            focusController, $timeout, $state, FocusConstant, $document, playerService, AuthManager, EVENTS, analyticsReporter ) {
        
        $scope.navItems = APP_CONSTANTS.globalNavigationItems;
        $scope.navDepth = APP_CONSTANTS.navigationDepth;
        $scope.cobrandingURL = null;
        $rootScope.currentGlobalNavItem = $scope.navItems.featured.state;
        $scope.globalNavActive = true;
        $rootScope.FirstMoveFromGlobalNav = false;

        $rootScope.$on(EVENTS.authNSuccess, function($event){
            var currentMVPD = AuthManager.getCurrentMvpd();
            if(currentMVPD.cobrand.length > 0){
                populateCobrandingIcon(currentMVPD.cobrand[0]);
            }
        });
        $rootScope.$on(EVENTS.authNExpired, function(){
            $scope.cobrandingURL = null;
        });
        $rootScope.$on(EVENTS.authNLogout, function(){
            $scope.cobrandingURL = null;
        });
        
        function populateCobrandingIcon(cobrand){            
            $scope.cobrandingURL = cobrand.url;
        };
        
        $scope.onFocus = function(targetState) {
            $scope.selectedGlobalNavItem = targetState;
            $rootScope.currentGlobalNavItem = targetState;
            $state.go(targetState);
            $scope.globalNavActive = true;
            
            if(targetState === $scope.navItems.featured.state) {
                $scope.settimer();   
            }
            $rootScope.FirstMoveFromGlobalNav = false;
        }
        
        $scope.onBlur = function(targetState) {
            $scope.globalNavActive = false;
            $rootScope.FirstMoveFromGlobalNav = true;
        }
        
        focusController.addBeforeKeydownHandler(function(context) {

            if($scope.globalNavActive && $rootScope.playerControlsVisible === false) {
                if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.RIGHT) {
                    switch ($rootScope.currentGlobalNavItem) {
                        case $scope.navItems.featured.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                        	// Stop the player when leaving featured page
                            analyticsReporter.sendMenuPageEvent();
                        	playerService.stopVideoPlayback();
                            focusController.setDepth($scope.navDepth.live);
                            focusController.focus($('#' + $scope.navItems.live.id));
                            break;
                        case $scope.navItems.live.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                            analyticsReporter.sendMenuPageEvent();
                            playerService.stopVideoPlayback();
                            focusController.setDepth($scope.navDepth.shows);
                            focusController.focus($('#' + $scope.navItems.shows.id));
                            break;
                        case $scope.navItems.shows.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                            analyticsReporter.sendMenuPageEvent();
                            focusController.setDepth($scope.navDepth.settings);
                            focusController.focus($('#' + $scope.navItems.settings.id));
                            break;
                    }
                    
                    return false;
                }
                else if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.LEFT) {
                    switch ($rootScope.currentGlobalNavItem) {
                        case $scope.navItems.live.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                            playerService.stopVideoPlayback();
                            analyticsReporter.sendMenuPageEvent();
                            focusController.setDepth($scope.navDepth.featured);
                            focusController.focus($('#' + $scope.navItems.featured.id));
                            break;
                        case $scope.navItems.shows.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                            playerService.stopVideoPlayback();
                            analyticsReporter.sendMenuPageEvent();
                            focusController.setDepth($scope.navDepth.live);
                            focusController.focus($('#' + $scope.navItems.live.id));
                            break;
                        case $scope.navItems.settings.state:
                            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
                            
                            analyticsReporter.sendMenuPageEvent();
                            focusController.setDepth($scope.navDepth.shows);
                            focusController.focus($('#' + $scope.navItems.shows.id));
                            break;
                    }
                    
                    return false;
                }
            }

        });
    }

})();