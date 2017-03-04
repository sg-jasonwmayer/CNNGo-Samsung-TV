
(function() {
    'use strict';

   angular.module('settings.controller', ['ui.router'])
		  .controller('settingsController', settingsController)


	function settingsController($rootScope, $scope, $window, $state, focusController, FocusConstant, AuthManager, analyticsReporter, EVENTS, keyManagerService, APP_CONSTANTS )
	{
        // Assign key handler
        keyManagerService.resetKeyCallbackHandler();
        keyManagerService.pushHistoryCallback(backKeyHandler);
        
        function backKeyHandler() {
            $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
            focusController.setDepth(APP_CONSTANTS.navigationDepth.featured);
            focusController.focus($('#' + APP_CONSTANTS.globalNavigationItems.featured.id));
        }       

		$scope.transition = 'slide-top';
		$scope.tabs = ['signIn', 'accessibility', 'privacyPolicy', 'termsConditions'];
		$scope.currentIndex = -1;
		$scope.maxIndex = $scope.tabs.length-1;
		$scope.left = false;
		$scope.onMenu = false;
		$scope.settingsNavActive = false;
		$scope.currentsettingsNavItem = null;
		$scope.signInTitle = (AuthManager.isAuthenticated() === true) ? 'Sign Out' : 'Sign In';

		focusController.addBeforeKeydownHandler(function(context) {
            if($scope.currentsettingsNavItem == $scope.tabs[0]){
				if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.RIGHT) {
					focusController.setGroup("signInPage");
					$("#signInLink").addClass("settingsSelected");
					$scope.onMenu = false;
					if(AuthManager.isAuthenticated() === true){
						focusController.focus($("#logoutBtn"));
					} else {
						focusController.focus($("#newRegCodeBtn"));
					}					
				} else if (context.event.keyCode === FocusConstant.DEFAULT.KEY_MAP.LEFT) {
					$scope.onMenu = true;
				}
			}
        });

		$rootScope.$on(EVENTS.authNSuccess, function($event){
			$scope.signInTitle = 'Sign Out';
		});

		$rootScope.$on(EVENTS.authNLogout, function(){
			$scope.signInTitle = 'Sign In';
		});

		$scope.onFocus = function(targetState) {
			$scope.onMenu = true;
			nav(targetState, true);
        }
        
        $scope.onBlur = function(targetState) {
			removeSelectionClassFromSections();
            $scope.settingsNavActive = false;
        }

		next();
		// nav('signIn', false);
		// onFocus('main.settings.signIn');

		function next()
		{
			$scope.currentIndex = $scope.currentIndex+1 < $scope.maxIndex ? $scope.currentIndex+1 : 0;
			var name = $scope.tabs[$scope.currentIndex];
			$state.go( 'main.settings.' + name );
		}

		function nav(name, skipFocus){		
			removeSelectionClassFromSections();	
            $scope.currentsettingsNavItem = name;
            $scope.settingsNavActive = true;
			$('#' + name + 'Link').addClass('settingsSelected');
			if(skipFocus !== true)
				focusController.focus($('#' + name + 'Link'));
			$state.go( 'main.settings.' + name );			
		}

		function removeSelectionClassFromSections(){
			if ($scope.onMenu === true) {
				for(var i = 0; i < $scope.tabs.length; i++){
					$('#' + $scope.tabs[i] + 'Link').removeClass('settingsSelected');
				}
			}
		}

		$scope.signIn = function()
		{
			$scope.transition = 'slide-top';
			next();
		}

		$scope.accessibility = function()
		{
			$scope.transition = 'slide-top';
			next();
		}

		$scope.privacyPolicy = function()
		{
			$scope.transition = 'slide-top';
			next();
		}

		$scope.termsConditions = function()
		{
			$scope.transition = 'slide-top';
			next();
		}

		//Analytics - Report Settings page event
        analyticsReporter.sendSettingsPageEvent();
        
        $rootScope.$broadcast(EVENTS.displayMainContentLoading, false);
	}
	

})();
