(function() {
    'use strict';

    angular.module('settingsNavigation.controller', []).controller(
            'settingsNavigationController', settingsNavigationController);

    function settingsNavigationController($scope, $rootScope, APP_CONSTANTS,
            focusController, $timeout, $state, FocusConstant, $document) {
        
        $scope.navItems = APP_CONSTANTS.settingsNavigationItems;
        $scope.navDepth = APP_CONSTANTS.navigationDepth;
        $scope.currentsettingsNavItem = $scope.navItems.featured.state;
        $scope.settingsNavActive = true;
        
        $scope.onFocus = function(targetState) {
            $scope.currentsettingsNavItem = targetState;
            $state.go(targetState);
            $scope.settingsNavActive = true;
        }
        
        $scope.onBlur = function(targetState) {
            $scope.settingsNavActive = false;
        }
        
        $timeout(function() {
            focusController.focus($('#' + $scope.navItems.featured.id));
        }, 500);
        
        focusController.addBeforeKeydownHandler(function(context) {
            if($scope.settingsNavActive) {
                if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.UP) {
                    switch ($scope.currentsettingsNavItem) {
                        case $scope.navItems.featured.state:
                            focusController.setDepth($scope.navDepth.search);
                            focusController.focus($('#' + $scope.navItems.search.id));
                            break;
                        case $scope.navItems.search.state:
                            focusController.setDepth($scope.navDepth.settings);
                            focusController.focus($('#' + $scope.navItems.settings.id));
                            break;
                    }
                    
                    return false;
                }
                else if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.DOWN) {
                    switch ($scope.currentsettingsNavItem) {
                        case $scope.navItems.search.state:
                            focusController.setDepth($scope.navDepth.featured);
                            focusController.focus($('#' + $scope.navItems.featured.id));
                            break;
                        case $scope.navItems.settings.state:
                            focusController.setDepth($scope.navDepth.search);
                            focusController.focus($('#' + $scope.navItems.search.id));
                            break;
                    }
                    
                    return false;
                }
            }

        });
    }

})();