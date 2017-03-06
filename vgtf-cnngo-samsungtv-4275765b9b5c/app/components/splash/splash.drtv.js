(function() {
    'use strict';

    angular
        .module('splash.directive', [])
        .directive('splash', splash);

    function splash() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/components/splash/splash.tmpl.html',
            controller: 'splashController'
        };
    }

}
)
();