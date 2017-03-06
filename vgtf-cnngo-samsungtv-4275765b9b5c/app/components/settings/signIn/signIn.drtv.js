(function() {
    'use strict';

    angular.module('signIn.directive', []).directive(
            'signIn', signIn);

  /* @ngInject */
  function signIn() {
    return {
      restrict: 'E',
      scope: {
          isStandAlone: '=isStandAlone'
      },
      templateUrl: 'app/components/settings/signIn/signIn.tmpl.html',
      controller: 'signInController'
    };
  }

})();