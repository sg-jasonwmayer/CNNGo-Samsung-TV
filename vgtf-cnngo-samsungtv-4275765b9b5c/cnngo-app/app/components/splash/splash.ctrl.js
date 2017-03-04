(function() {
    'use strict';

    angular.module('splash.controller', []).controller('splashController', splashController);

    function splashController(playerService, APP_CONSTANTS, focusController, analyticsReporter) {
        console.log('Inside the splash controller');
        
        //Analytics - Report Entry page event
        analyticsReporter.sendEntryPageEvent();
        
        document.getElementById('splashPlayer').play();
        
        $('#splashPlayer').bind("ended", function() {
        	$('.splashContainer').hide();
            $('#avPlayer').hide();

            focusController.focus($('#' + APP_CONSTANTS.globalNavigationItems.featured.id));
        });        
    }
})();