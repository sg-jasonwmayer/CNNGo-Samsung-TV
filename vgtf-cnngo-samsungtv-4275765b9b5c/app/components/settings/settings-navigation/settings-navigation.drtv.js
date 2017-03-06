(function() {
    'use strict';

    angular.module('settingsNavigation.directive', []).directive(
            'settingsNavigation', settingsNavigation);

    function settingsNavigation() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/settingsNavigation/settingsNavigation.tmpl.html',
            controller : 'settingsNavigationController'
        };
    }

})();