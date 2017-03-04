(function() {
    'use strict';

    angular.module('informationModal.directive', []).directive(
            'informationModal', informationModal);

  /* @ngInject */
  function informationModal() {
    return {
      restrict: 'E',
      templateUrl: 'app/common/components/informationModal/informationModal.tmpl.html',
      controller: 'informationModalController'
    };
  }

})();