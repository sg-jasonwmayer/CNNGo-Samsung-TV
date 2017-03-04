(function () {
    'use strict';

    angular.module('exitModal.controller', []).controller('exitModalController',
        exitModalController);

    function exitModalController($rootScope, $scope, focusController, modalControllerService, APP_CONSTANTS, EVENTS, keyManagerService) {
        $scope.focusLevel = APP_CONSTANTS.navigationDepth.exitModal;

        function showExitModal(){
            keyManagerService.pushHistoryCallback(backKeyHandler);
            focusController.setDepth($scope.focusLevel, "exitModalGroup"); 
            focusController.focus("exitModalCancelButtonName");
        }

        function closeExitModal(){
            keyManagerService.updateHistoryCallback(backKeyHandler);
        }

        $scope.onFocusButton = function(targetID){
            console.log("Focus on " + targetID);
            $('#'+targetID).addClass("selectedButton");
        }

        $scope.onBlurButton = function(targetID){
            console.log("Focus removed from " + targetID);
            $('#'+targetID).removeClass("selectedButton");
        }

        $scope.exit = function(){
            $rootScope.$broadcast(EVENTS.exitingApp);
            tizen.application.getCurrentApplication().exit();
        };

        $scope.cancel = function(){
            closeExitModal();
            modalControllerService.closeModal(APP_CONSTANTS.modals.exitModal);
        };

        function backKeyHandler() {
            $scope.cancel();
        }

        $rootScope.$on(EVENTS.showExitModal, showExitModal);                    

        $rootScope.$on(EVENTS.hideExitModel, closeExitModal);

        $rootScope.$on(EVENTS.closeExitModal, $scope.cancel);

    }
})();
