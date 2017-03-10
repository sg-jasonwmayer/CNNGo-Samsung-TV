(function() {
    'use strict';
    angular.module('live.controller', []).controller('liveController', liveController);

    function liveController($rootScope, $scope, dataCacheService, APP_CONSTANTS, AuthManager, EVENTS, playerService, analyticsReporter, keyManagerService, KEY, focusController) {
        // Assign key handler
        keyManagerService.resetKeyCallbackHandler();
        keyManagerService.setKeyCallbackHandler(KEY.keyName.COLOR_F0_RED, $rootScope.mainAutoRecedeHandler);
        keyManagerService.pushHistoryCallback(backKeyHandler);
        
        function backKeyHandler() {
            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
            focusController.setDepth(APP_CONSTANTS.navigationDepth.featured);
            focusController.focus($('#' + APP_CONSTANTS.globalNavigationItems.featured.id));
        }
        
        
        $scope.isAuthenticated = AuthManager.isAuthenticated();
        $scope.liveData  = {};
        $scope.liveData.data = dataCacheService.getLiveData();
        $scope.liveData.depth =  APP_CONSTANTS.navigationDepth.live;
        
        $rootScope.$on(EVENTS.hideSignInModel, function($event){
            $scope.isAuthenticated = AuthManager.isAuthenticated();
        });

        $rootScope.$on(EVENTS.authNExpired, function(){
            $scope.isAuthenticated = false;
        });
        
        if($scope.isAuthenticated === true){
            playerService.autoStartLive();    
        }

        //Analytics - Report Live page event
       analyticsReporter.sendLivePageEvent();
       
       $rootScope.$broadcast(EVENTS.displayMainContentLoading, false);
    }
})();
