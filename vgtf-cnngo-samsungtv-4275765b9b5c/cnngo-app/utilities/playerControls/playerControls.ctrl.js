(function () {
    'use strict';

    angular.module('playerControls.controller', []).controller('playerControlsController',
        playerControlsController);

    function playerControlsController($rootScope, $scope, $state, focusController, ENV, EVENTS, APP_CONSTANTS, KEY, keyManagerService) {
        $scope.isPlaying = false;
        $scope.playPauseImage = ($scope.isPlaying === true) ? "/assets/images/play.png" : "/assets/images/pause.png";
        $scope.timeElapsedText = "00:00";
        $scope.timeRemainingText = "00:00";
        $scope.bufferWidth = 0;
        $scope.progressWidth = 0;
        $scope.maxPlayerBarWidth = parseInt($scope.scrubberbarwidth);
        $scope.currentContentDuration = 0;
        $scope.hidePlayerControls = true;
        $scope.ffrwInterval = null;
        $scope.previousFocus = null;
        $scope.adDuration = 0;

        $rootScope.playerControlsVisible = false;

        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_PLAY], function () {
            $rootScope.$broadcast(EVENTS.videoResumedPressed);
        });
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_PAUSE], function () {
            $rootScope.$broadcast(EVENTS.videoPausedPressed);
        });
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_PLAY_PAUSE], function () {
            $rootScope.$broadcast(EVENTS.videoPlayPausedPressed);
        });
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_FAST_FORWARD, KEY.keyName.ARROW_RIGHT], function () {
            ffPressed();
        });
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_REWIND, KEY.keyName.ARROW_LEFT], function () {
            rewPressed();
        });

        //Key up handlers for FF and REW.
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_FAST_FORWARD, KEY.keyName.ARROW_RIGHT], function () {
            ffReleased();
        }, true);
        keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.MEDIA_REWIND, KEY.keyName.ARROW_LEFT], function () {
            rewReleased();
        }, true);

        function setTempKeyHandlers() {
            keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.ARROW_RIGHT], function () {
                if($scope.hidePlayerControls === false){
                    ffPressed();                    
                }
                return false;
            });
            keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.ARROW_LEFT], function () {
                rewPressed();
                return false;
            });

            //Key up handlers for FF and REW.
            keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.ARROW_RIGHT], function () {
                if($scope.hidePlayerControls === false){
                    ffReleased();
                }
                return false;
            }, true);
            keyManagerService.setPersistentKeyCallbackHandler([KEY.keyName.ARROW_LEFT], function () {
                rewReleased();
                return false;
            }, true);
        }

        function unsetTempKeyHandlers() {
            keyManagerService.unsetPersistentKeyCallbackHandler([KEY.keyName.ARROW_RIGHT, KEY.keyName.ARROW_LEFT]);

            //Key up handlers for FF and REW.
            keyManagerService.unsetPersistentKeyCallbackHandler([KEY.keyName.ARROW_RIGHT, KEY.keyName.ARROW_LEFT], true);
        }

        function ffPressed() {            
            $rootScope.$broadcast(EVENTS.videoFFPressed);
            clearInterval($scope.ffrwInterval);
            console.log("FF Pressed");
            $scope.ffrwInterval = setInterval(function () {
                console.log("FF Pressed Still");
                $rootScope.$broadcast(EVENTS.videoFFPressed);
            }, 500);
        }

        function ffReleased() {
            $rootScope.$broadcast(EVENTS.videoFFReleased);
            console.log("FF Released");
            clearInterval($scope.ffrwInterval);
        }

        function rewPressed() {
            $rootScope.$broadcast(EVENTS.videoRWReleased);
            clearInterval($scope.ffrwInterval);
            console.log("REW Pressed");
            $scope.ffrwInterval = setInterval(function () {
                console.log("Rew Pressed Still");
                $rootScope.$broadcast(EVENTS.videoRWPressed);
            }, 500);
        }

        function rewReleased() {
            $rootScope.$broadcast(EVENTS.videoRWReleased);
            clearInterval($scope.ffrwInterval);
            console.log("REW Released");
        }

        function correctForTimeDisplay(value) {
            value = (value < 0) ? 0 : value;
            return (value < 10) ? "0" + value : value;
        }

        if (isNaN($scope.maxPlayerBarWidth)) {
            //right now this is required... We could set this up to grab the width from the element if its not populated... For now i will thor an error...
            throw "$scope.maxPlayerBarWidth must be a number.";
        }

        $rootScope.$on(EVENTS.adBreakStart, function($event, adDuration) { 
            $scope.hidePlayerControls = true;
            $scope.adDuration = parseInt(Math.ceil(adDuration)) * 1000; 
        });

        $rootScope.$on(EVENTS.adBreakStop, function() { 
            $scope.hidePlayerControls = false; 
        });

        $scope.$on(EVENTS.playTimeUpdate, function (event, currentTime) {
            currentTime = parseInt(currentTime - $scope.adDuration);
            $scope.progressWidth = Math.floor((currentTime / ($scope.currentContentDuration - $scope.adDuration)) * $scope.maxPlayerBarWidth) + "px";
            //modify the time labels.
            var elapsedTime = Math.floor(currentTime / 1000);
            var elapsedMinutes = correctForTimeDisplay(Math.floor(elapsedTime / 60));
            var elapsedSeconds = correctForTimeDisplay(Math.floor(elapsedTime % 60));
            $scope.timeElapsedText = "" + elapsedMinutes + ":" + elapsedSeconds + "";

            var remainingTime = Math.floor((($scope.currentContentDuration - $scope.adDuration) - currentTime) / 1000);
            var remainingMinutes = correctForTimeDisplay(Math.floor(remainingTime / 60));
            var remainingSeconds = correctForTimeDisplay((remainingTime % 60));
            $scope.timeRemainingText = "" + remainingMinutes + ":" + remainingSeconds + "";
        });

        $scope.$on(EVENTS.bufferAmountUpdate, function (event, percentBuffered) {
            var parsedPercentBuffered = (parseInt(percentBuffered) / 100);
            var width = Math.floor($scope.maxPlayerBarWidth * parsedPercentBuffered);
            $scope.bufferWidth = width + "px";
        });

        $scope.$on(EVENTS.videoStopped, function () {
            $scope.isPlaying = false;
            $scope.bufferWidth = 0;
            $scope.progressWidth = 0;
            $scope.timeElapsedText = "00:00";
            $scope.timeRemainingText = "00:00";
        });

        $scope.$on(EVENTS.videoStarted, function (event, totalRunTime, totalTimeIncludingAds) {
            $scope.isPlaying = true;
            $scope.bufferWidth = 0;
            $scope.progressWidth = 0;
            $scope.timeElapsedText = "00:00";
            $scope.timeRemainingText = "00:00";
            $scope.currentContentDuration = parseInt(totalRunTime);
            $scope.adDuration = 0;
        });

        $scope.$on(EVENTS.videoPaused, function () {
            $scope.isPlaying = false;
            $scope.playPauseImage = "/assets/images/play.png";
        });

        $scope.$on(EVENTS.videoResumed, function () {
            $scope.isPlaying = true;
            $scope.playPauseImage = "/assets/images/pause.png";
        });

        $scope.$on(EVENTS.showPlayerControls, function () {
            $scope.hidePlayerControls = false;
            $rootScope.playerControlsVisible = true;
            setTempKeyHandlers();
            $scope.previousFocus = {
                element: focusController.getCurrentFocusItem(),
                depth: focusController.getCurrentDepth(),
                group: focusController.getCurrentGroup()
            };
            var element = $("#playPauseButtonId")[0];
            focusController.enable(element);
            focusController.setDepth(APP_CONSTANTS.navigationDepth.playerControls, "playerControlsGroup");
            focusController.focus(element);
        });

        $scope.$on(EVENTS.hidePlayerControls, function () {
            $scope.hidePlayerControls = true;
            $rootScope.playerControlsVisible = false;
            unsetTempKeyHandlers();
            if ($scope.previousFocus !== undefined) {
                focusController.setDepth($scope.previousFocus.depth, $scope.previousFocus.group);
                focusController.focus($scope.previousFocus.element);
                delete $scope.previousFocus;
            }
        });
    }
})();
