(function() {
    'use strict';

    angular.module('globalNavigation.directive', []).directive(
            'globalNavigation', globalNavigation);

    function globalNavigation() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/globalNavigation/globalNavigation.tmpl.html',
            controller : 'globalNavigationController',
            scope: {
                settimer: '&'
            }
        };
    }

})();