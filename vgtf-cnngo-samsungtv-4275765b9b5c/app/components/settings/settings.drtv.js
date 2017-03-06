(function() {
    'use strict';

    angular.module('settings.directive', []).directive(
            'settings', settings);

  /* @ngInject */
  function settings() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/settings/settings.tmpl.html',
      controller: 'settingsController',
      controllerAs: 'sc',
    };
  }

})();