(function() {
    'use strict';

    angular.module('playerControls.directive', []).directive(
            'playerControls', playerControls);

  /* @ngInject */
  function playerControls() {
    return {
        restrict: 'E',
        templateUrl: 'utilities/playerControls/playerControls.tmpl.html',
        controller: 'playerControlsController',
        scope: {
            scrubberbarwidth: '=?scrubberbarwidth'
        }
      };
    }

})();