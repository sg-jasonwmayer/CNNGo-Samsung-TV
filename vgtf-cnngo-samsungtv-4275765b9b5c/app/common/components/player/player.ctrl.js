(function() {
    'use strict';

    angular.module('player.controller', []).controller('playerController', playerController);

    function playerController(playerService, dataCacheService, $rootScope, EVENTS, $scope) {
    	var vm = this;
    		vm.adDuration = 0;
            vm.adCurrentTime;
            vm.upNextOverlayDisplayState = false;
            vm.showUpNextOverlay = false;
            vm.overlayDisplayed = true;

		var _withinAd = false;

    	vm.getAdCurrentTime = function() {
    		vm.adCurrentTime =  Math.max(0, parseInt(vm.adDuration - (webapis.avplay.getCurrentTime() / 1000)));

    		if (!_withinAd && vm.adCurrentTime > 0) {
                console.log("AD start");
                $rootScope.$broadcast(EVENTS.adBreakStart, vm.adDuration);
                _withinAd = true;
    		} else if (_withinAd && vm.adCurrentTime == 0) {
                console.log("AD stop");
    			_withinAd = false;
    			$rootScope.$broadcast(EVENTS.adBreakStop);
    		}

            if (_withinAd) { console.log("adCurrentTime: " + vm.adCurrentTime)}

    		return vm.adCurrentTime;
    	}

        $scope.$on('showUpNextOverlay', function(event, nextClip) {
            if(!vm.showUpNextOverlay) {
                if(!vm.overlayDisplayed) {
                    vm.showUpNextOverlay = true;
                }
                vm.upNextOverlayDisplayState = true;
                vm.upNextURL = nextClip.imageUrl;
                vm.upNextCounter = nextClip.countdownTime;
                vm.upNextTitle = nextClip.title;
            }
            else {
                vm.upNextCounter = nextClip.countdownTime;
            }
        });

        $scope.$on('hideUpNextOverlay', function(event) {
            vm.upNextOverlayDisplayState = false;
            vm.showUpNextOverlay = false;
        });

        $scope.$on('toggleUpNextOverlayDisplay', function(event, state) {
            vm.overlayDisplayed = !state;
            if(vm.upNextOverlayDisplayState) {
                $vm.showUpNextOverlay = state;
            }
        });

        $rootScope.$on(EVENTS.playbackSucceeded, calcAdDuration);
    	function calcAdDuration(){
            vm.adDuration = 0;
            
			var _playObj = dataCacheService.getPlaying();
			if (!_playObj.type || _playObj.type != 'clip') {
				return; 
			}

			var _actualDuration = webapis.avplay.getDuration() / 1000;

			if ((_actualDuration - _playObj.totalRunTime) > 1) {
				vm.adDuration = _actualDuration - _playObj.totalRunTime;				
			}
    	}

    	return vm;
    }

})();
