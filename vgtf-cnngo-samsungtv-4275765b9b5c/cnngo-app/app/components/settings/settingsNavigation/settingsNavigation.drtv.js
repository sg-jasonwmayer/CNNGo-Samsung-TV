(function() {
    'use strict';

    angular.module('settingsNavigation.directive', []).directive(
            'settingsNavigation', settingsNavigation);

    function settingsNavigation() {
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'app/common/components/settings/settingsNavigation/settingsNavigation.tmpl.html',
            controller : 'settingsNavigationController'
        };
    }

})();