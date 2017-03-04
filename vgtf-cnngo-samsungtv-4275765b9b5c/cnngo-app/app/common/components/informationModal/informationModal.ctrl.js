(function() {
    'use strict';

    angular.module('informationModal.controller', []).controller('informationModalController',
            informationModalController);

            function informationModalController($rootScope, $scope, $state, focusController, Auth, AuthManager, ENV, EVENTS, APP_CONSTANTS, modalControllerService){
                $scope.id = null;
                $scope.message = "";
                $scope.title = null;
                $scope.dismissText = "";
                $scope.dismissButtonID = "infoModalDismiss"
                $scope.informationModalButtonGroupName = "informationModal";
                $scope.focusLevel = APP_CONSTANTS.navigationDepth.informationModal;
                $scope.retryCount = 0;
                $scope.retryURL = null;
                $scope.isFatal = false;                

                $scope.dismiss = function(){
                    if($scope.isFatal === true){
                        AuthManager.logout();
                        tizen.application.getCurrentApplication().exit();
                    } else {
                        modalControllerService.closeModal(APP_CONSTANTS.modals.informationModal);
                        $rootScope.$broadcast(EVENTS.hideInformationModel, $scope.callingPlaylistIdentifier);
                    }
                }

                $scope.onFocusButton = function(buttonId){
                    console.log("Focus on " + buttonId);
                    $('#'+buttonId).addClass("selectedButton");
                }

                $scope.onBlurButton = function(buttonId){
                    console.log("Focus removed from " + buttonId);
                    $('#'+buttonId).removeClass("selectedButton");
                }

                function openInformationModal($event, data){
                    if(data != undefined && data != null){
                        $scope.id = data.id;
                        $scope.message = data.message;
                        $scope.dismissText = data.dismissText || "OK";
                        $scope.title = data.title;        
                        $scope.retryCount = data.retryCount || 0;
                        $scope.isFatal = data.fatal || false;            
                    }
                    focusController.setDepth($scope.focusLevel, $scope.informationModalButtonGroupName); 
                    focusController.focus($("#"+$scope.dismissButtonID));

                    if($scope.id == ENV.errors.retryVideo.id){
                        $scope.retryURL = data.retryURL;
                        handleRetry();
                    } else if($scope.id == ENV.errors.generalError.id) {
                        resetRetry();
                        //Close App?
                    }else {
                        resetRetry();
                    }
                }

                function resetRetry(){
                    $scope.retryCount = 0;
                    $scope.retryURL = null;
                }

                function handleRetry(){
                    if($scope.retryCount >= 2){
                        //give up!
                        var error = $.extend({
                            fatal: true
                        }, ENV.errors.generalError);
                        openInformationModal(null, error);
                    } else {
                        $scope.retryCount += 1;
                        //try again
                        var counterCount = 0;
                        var interval = setInterval(function(){
                            switch(counterCount){
                                case 0:
                                    $scope.message += "3";
                                    break;
                                case 1:
                                    $scope.message += ", 2";
                                    break;
                                case 2:
                                    $scope.message += ", 1...";
                                    break;
                                default:
                                    //retry video
                                    $rootScope.$broadcast(EVENTS.retryPlayback, {url: $scope.retryURL, retryCount: $scope.retryCount})
                                    clearInterval(interval);
                                    break;
                            }
                            counterCount++;
                        }, 1000);
                    }
                }

                function closeInformationModal(){
                    $scope.title = null;
                }

                $rootScope.$on(EVENTS.showInformationModal, openInformationModal);                    

                $rootScope.$on(EVENTS.hideInformationModel, closeInformationModal);

                $rootScope.$on(EVENTS.playbackSucceeded, function(){
                    resetRetry();
                });
            }
})();
