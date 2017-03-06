(function() {
    'use strict';

    angular.module('settingsNavigation.controller', []).controller(
            'settingsNavigationController', settingsNavigationController);

    function settingsNavigationController($scope, $rootScope, APP_CONSTANTS,
            focusController, $timeout, $state) {
        $scope.navItems = APP_CONSTANTS.settingsNavigationItems;

        $timeout(function() {
            focusController.focus($('#'
                    + APP_CONSTANTS.settingsNavigationItems.featured.id));
        }, 500);

        $scope.changeState = function(targetState) {
            $state.go(targetState);
        }
    }

})();