(function() {
    'use strict';

    angular.module('player.directive', []).directive('player', player);

    function player() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/player/player.tmpl.html',
            controller : 'playerController',
            controllerAs: 'pc'

        };
    }

})();