'use strict';
var app = angular.module('app.style1', [
    'ngSanitize',
    'caph.ui',
    'caph.media'
]).config(['focusControllerProvider', function (focusControllerProvider) {
    focusControllerProvider.setInitialDepth(1);
}]);

(function () {

    var toggleMenuView = false;
    
    function log(msg) {
    	console.log(msg);
    }


    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = [
            'MediaPlay',	
            'MediaPause',
            'MediaStop',
            'MediaFastForward',
            'MediaRewind',            
            '0',
            '1',
            '2',
            '3',
            'ColorF0Red'
        ];

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
        	console.log(e.keyCode);
            switch (e.keyCode) {
                case 415:   // MediaPlay
                	break;
                case 19:    // MediaPause
                    break;
                case 413:   // MediaStop
                    break;
                case 417:   // MediaFastForward
                    break;
                case 412:   // MediaRewind
                    break;
                case 48: //Key 0
                    break;
                case 49: //Key 1
                    break;
                case 50: //Key 2
                    break;
                case 51: //Key 3
                    break;
                case 403: //Key Red A
                	if(toggleMenuView) {
                		toggleMenuView = false;
                		document.getElementById("displayWrapper").style.display = 'block';
                	}
                	else {
                		toggleMenuView = true;
                		document.getElementById("displayWrapper").style.display = 'none';
                	}
                    break;
                case 10009: // Return
                    //tizen.application.getCurrentApplication().hide();
                    break;
                default:
            }
        });
    }


    /**
     * Function initialising application.
     */
    window.onload = function () {

        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        registerKeys();
        registerKeyHandler();
    }
}());
