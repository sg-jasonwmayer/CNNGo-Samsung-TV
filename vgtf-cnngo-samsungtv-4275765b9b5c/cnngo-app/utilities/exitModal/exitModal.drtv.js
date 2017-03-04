(function() {
    'use strict';

    angular.module('exitModal.directive', []).directive(
            'exitModal', exitModal);

  /* @ngInject */
  function exitModal() {
    return {
      restrict: 'E',
      templateUrl: 'utilities/exitModal/exitModal.tmpl.html',
      controller: 'exitModalController'
    };
  }

})();