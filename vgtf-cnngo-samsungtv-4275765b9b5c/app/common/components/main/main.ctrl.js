(function() {
    'use strict';

    angular.module('main.controller', ['app.utilities']).controller('mainController', mainController);

    function mainController($rootScope, $scope, $state, APP_CONSTANTS, focusController, $timeout, Auth, AuthManager, ENV, EVENTS, TokenService, modalControllerService, keyManagerService) {
        $scope.showGlobalNavMainContent = true;
        $scope.showGlobalNav = true;
        $scope.displayVideoContentLoading = true;
        $scope.displayMainContentLoading = true;
        var globalNavMainContentTimer = null;
        $scope.currentPlayListId = 0;
        console.log('Checking for auth objects...');
        console.log(Auth);
        console.log(AuthManager);
        console.log('Initializing Authentication services.');
        AuthManager.init(ENV);
        Auth.authNPoller.stop();
        TokenService.startTokenManagement();

        $rootScope.$on(EVENTS.authNExpired, function() {
            modalControllerService.showModal(APP_CONSTANTS.modals.informationModal, ENV.errors.authExpired);
        });

        $rootScope.$on(EVENTS.triggerExit, function() {
            modalControllerService.showModal(APP_CONSTANTS.modals.exitModal);
        });

        setTimeout(function() {
            modalControllerService.init("modalContainer", [{
                Id: "signIn",
                directiveTagName: "sign-in",
                directiveAttributes: "is-stand-alone=\"true\"",
                openCallback: function(playlistIdentifier) {
                    $rootScope.$broadcast(EVENTS.showSignInModal, playlistIdentifier);
                },
                closeCallback: function(playlistIdentifier) {
                    $rootScope.$broadcast(EVENTS.hideSignInModel, playlistIdentifier);
                }
            }, {
                Id: "informationModal",
                directiveTagName: "information-modal",
                openCallback: function(data) {
                    $rootScope.$broadcast(EVENTS.showInformationModal, data);
                },
                closeCallback: function() {
                    $rootScope.$broadcast(EVENTS.hideInformationModel);
                }
            }, {
                Id: "exitModal",
                directiveTagName: "exit-modal",
                openCallback: function() {
                    $rootScope.$broadcast(EVENTS.showExitModal);
                },
                closeCallback: function() {
                    $rootScope.$broadcast(EVENTS.hideExitModel);
                }
            }]);
        }, 5000);
        
        $rootScope.mainAutoRecedeHandler = function () {
            if($scope.showGlobalNavMainContent === false){
                if($scope.currentPlayListId < 2) {
                    $scope.globalNavHeaderDisplay(true);
                }
                $scope.mainContentDisplay(true);
                $scope.showGlobalNavMainContent = true;
                $scope.setglobalNavMainContentTimer();
            } else if ($scope.showGlobalNavMainContent === true) {
                $scope.globalNavHeaderDisplay(false);
                $scope.mainContentDisplay(false);
                $scope.showGlobalNavMainContent = false;
            }
        };

        $rootScope.resetAutoRecedeTimer = function() {
            $scope.setglobalNavMainContentTimer();
        };

        $rootScope.disableAutoRecedeTimer = function() {
          $timeout.cancel(globalNavMainContentTimer);
        };

        function onChange(data) {
            switch (webapis.network.getActiveConnectionType()) {
                case webapis.network.NetworkActiveConnectionType.WIFI:
                case webapis.network.NetworkActiveConnectionType.CELLULAR:
                case webapis.network.NetworkActiveConnectionType.ETHERNET:
                    console.log("Network is currently connected.");
                    break;
                case webapis.network.NetworkActiveConnectionType.DISCONNECTED:
                default:
                    console.log("Network is currently disconnected.");
                    modalControllerService.showModal(APP_CONSTANTS.modals.informationModal, ENV.errors.noInternet);
            }
        }

        webapis.network.addNetworkStateChangeListener(onChange);

        $scope.setglobalNavMainContentTimer = function() {
            if (globalNavMainContentTimer) {
                $timeout.cancel(globalNavMainContentTimer);
            }

            globalNavMainContentTimer = $timeout(function() {
                if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
                    $scope.showGlobalNavMainContent = false;
                    $scope.globalNavHeaderDisplay(false);
                    $scope.mainContentDisplay(false);
                }
                globalNavMainContentTimer = null;
            }, APP_CONSTANTS.sliderTimer.autoRecede);
        };

        $scope.$on('globalNavDisplay', function(event, playListId) {
            $scope.currentPlayListId = playListId;

            if ($scope.showGlobalNav && (playListId > 1)) {
                $scope.showGlobalNav = false;
                $scope.globalNavHeaderDisplay(false);
            } else if (!$scope.showGlobalNav && (playListId < 1.5)) {
                $scope.showGlobalNav = true;
                $scope.globalNavHeaderDisplay(true);
            }
        });

        $scope.globalNavHeaderDisplay = function(state) {
            if (state) {
                $("#masterHeader").animate({
                    'top': '0'
                }, APP_CONSTANTS.sliderTimer.header);
            } else {
                $("#masterHeader").animate({
                    'top': '-120'
                }, APP_CONSTANTS.sliderTimer.header);
            }
        };

        $scope.mainContentDisplay = function(state) {
            if (state) {
                $rootScope.$broadcast(EVENTS.hidePlayerControls);
                $rootScope.$broadcast('toggleUpNextOverlayDisplay', false);
                keyManagerService.updateHistoryCallback($rootScope.mainAutoRecedeHandler);
                $("#mainContent").animate({
                    'margin-top': '0'
                }, APP_CONSTANTS.sliderTimer.mainContent);
            } else {
                $rootScope.$broadcast(EVENTS.showPlayerControls);
                keyManagerService.pushHistoryCallback($rootScope.mainAutoRecedeHandler);
                $rootScope.$broadcast('toggleUpNextOverlayDisplay', true);
                $("#mainContent").animate({
                    'margin-top': '1080'
                }, APP_CONSTANTS.sliderTimer.mainContent);
            }
        };

        $scope.$on('overlayAutoRecede', function(event, state) {
            $scope.globalNavHeaderDisplay(state);
            $scope.mainContentDisplay(state);
            $scope.showGlobalNavMainContent = state;
        });

        $scope.$on('$viewContentLoaded', function(event) {
            if ($rootScope.currentGlobalNavItem === APP_CONSTANTS.globalNavigationItems.featured.state) {
                $scope.$broadcast('featuredPageLoaded', true);
            }
        });
        
        $scope.$on(EVENTS.displayVideoContentLoading, function(event, state) {
            $scope.displayVideoContentLoading = state;
        });
        
        $scope.$on(EVENTS.displayMainContentLoading, function(event, state) {
            $scope.displayMainContentLoading = state;
        });
    }
})();
