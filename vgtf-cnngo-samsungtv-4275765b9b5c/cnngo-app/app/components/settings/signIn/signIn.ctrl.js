(function() {
    'use strict';

    angular.module('signIn.controller', []).controller('signInController',
            signInController);

            function signInController($rootScope, $scope, $state, focusController, Auth, AuthManager, EVENTS, APP_CONSTANTS, modalControllerService, keyManagerService){
                $scope.isModal = ($scope.isStandAlone == true);
                $scope.modalIsOpen = false; 
                $scope.leftFocusItem = ($scope.isModal === true) ? 'null' : 'signIn';
                $scope.newRegCodeButtonID = ($scope.isModal === true) ? 'newRegCodeModalBtn' : 'newRegCodeBtn';
                $scope.logoutButtonID = ($scope.isModal === true) ? 'logoutModalBtn' : 'logoutBtn';
                $scope.newRegCodeButtonName = ($scope.isModal === true) ? 'signinbtnmodal' : 'signinbtn';
                $scope.logoutButtonName = ($scope.isModal === true) ? 'signoutbtnmodal' : 'signoutbtn';
                $scope.newRegCodeButtonGroupName = ($scope.isModal === true) ? 'signInPageModal' : 'signInPage';
                $scope.focusLevel = ($scope.isModal === true) ? APP_CONSTANTS.navigationDepth.modalSignin : APP_CONSTANTS.navigationDepth.settings;
                $scope.regCode = null;
                $scope.isAuthenticated = AuthManager.isAuthenticated();
                $scope.selectedButton = null;
                $scope.cobrandLogoUrl = ($scope.isAuthenticated === true) ? AuthManager.getCurrentMvpd().cobrand[0].url : "#";

                $scope.callingPlaylistIdentifier = null;

                $rootScope.$on(EVENTS.onRegCode, function($event, regCode){
                    $scope.regCode = regCode;
                });

                $rootScope.$on(EVENTS.authNSuccess, function($event){
                    $scope.isAuthenticated = true;
                    $scope.cobrandLogoUrl = AuthManager.getCurrentMvpd().cobrand[0].url;
                    if($scope.isModal){
                        modalControllerService.closeModal(APP_CONSTANTS.modals.signIn, $scope.callingPlaylistIdentifier);
                        $scope.callingPlaylistIdentifier = null;
                    } else {
                        focusController.focus($('#signInLink'));
                    }

                });

                $rootScope.$on(EVENTS.authNLogout, function(){
                    $scope.isAuthenticated = false;
                    $scope.cobrandLogoUrl = "#";
                    if($scope.isModal === false){
                        focusController.focus($('#signInLink'));
                    }
                });

                $scope.getNewRegCode = function(){
                    $scope.regCode = null;
                    AuthManager.getNewRegCode();
                }

                $scope.logout = function(){
                    $scope.regCode = null;
                    AuthManager.logout();
                    $scope.getNewRegCode();
                }

                $scope.onFocusButton = function(targetID){
                    console.log("Focus on " + targetID);
                    $('#'+targetID).addClass("selectedButton");
                }

                $scope.onBlurButton = function(targetID){
                    console.log("Focus removed from " + targetID);
                    $('#'+targetID).removeClass("selectedButton");
                }

                if(!$scope.isAuthenticated && !$scope.isModal){
                    $scope.getNewRegCode();
                }

                function openSignInModal($event, callingPlaylistIdentifier){
                    keyManagerService.pushHistoryCallback(backKeyHandler);
                    
                    $scope.callingPlaylistIdentifier = callingPlaylistIdentifier;
                    if($scope.isModal === true){
                        $rootScope.$broadcast(EVENTS.onLoginPage);
                        $scope.getNewRegCode();
                        focusController.setDepth($scope.focusLevel, $scope.newRegCodeButtonGroupName); 
                        focusController.focus($("#"+$scope.newRegCodeButtonID));
                    }
                }

                function closeSignInModal(){
                    keyManagerService.updateHistoryCallback(backKeyHandler);
                    $rootScope.$broadcast(EVENTS.leftLoginPage);
                }
                
                function backKeyHandler() {
                    modalControllerService.closeModal(APP_CONSTANTS.modals.signIn, $scope.callingPlaylistIdentifier);
                    $scope.callingPlaylistIdentifier = null;
                }

                if($scope.isModal === true){

                    $rootScope.$on(EVENTS.showSignInModal, openSignInModal);                    

                    $rootScope.$on(EVENTS.hideSignInModel, closeSignInModal);

                    
                }
            }

  

})();
