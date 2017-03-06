(function() {
  'use strict';

  angular.module('shows.controller', []).controller('showsController', showsController);

  function showsController($rootScope, $scope, showsData, $timeout, $compile, APP_CONSTANTS, AuthManager, analyticsReporter, EVENTS, keyManagerService, focusController) {
    // Assign key handler
    keyManagerService.resetKeyCallbackHandler();
    keyManagerService.pushHistoryCallback(backKeyHandler);

    function backKeyHandler() {
      $rootScope.$broadcast(EVENTS.displayMainContentLoading, true);
      focusController.setDepth(APP_CONSTANTS.navigationDepth.featured);
      focusController.focus($('#' + APP_CONSTANTS.globalNavigationItems.featured.id));
    }

    analyticsReporter.sendShowsPageEvent();

    $scope.currentShowsTitle = showsData[0].content[0].title;
    $scope.currentShowsSeason = showsData[0].content[0].seasonNumber;
    $scope.currentShowsDescription = showsData[0].content[0].description;
    $scope.currentShowsBackground = showsData[0].content[0].backgroundPath;

    $scope.isAuthenticated = AuthManager.isAuthenticated();
    $scope.isPlayingEpisode = false;

    $rootScope.$on(EVENTS.hideSignInModel, function($event){
      $scope.isAuthenticated = AuthManager.isAuthenticated();
    });

    $rootScope.$on(EVENTS.authNExpired, function(){
      $scope.isAuthenticated = false;
    });

		$rootScope.$on('seriesSelected', function($event, data) {
			$scope.currentShowsBackground = data.backgroundPath;
			$scope.currentShowsTitle = data.title;
			$scope.currentShowsSeason = data.seasonNumber;
			$scope.currentShowsDescription = data.description;
		});
		
		for(var i = 0; i < showsData.length; i++) {
			var dataVar = 'playListsData' + i;
            var playListIdentifier = dataVar + "shows";
		
			var playList = '';

			if ('posterCarousel' === showsData[i].rowType) {
				$scope[dataVar] = {};
				$scope[dataVar].data = showsData[i].content;
				$scope[dataVar].depth = APP_CONSTANTS.navigationDepth.shows;

				playList = $compile("<play-list-series id='" + i + "' title='" + showsData[i].label + "' listData='" + dataVar + "' playlistidentifier='" + playListIdentifier + "'></play-list-series")($scope);
				$('#listContainer').append(playList);
			} 
            else if ('posterSeriesFill' === showsData[i].rowType) {
            	// TODO : There is currently a bug when looping on these rows are turned on. The wrap limit for a series is set to 6 in the APP_CONSTANTS, which should 
                // stop the row from wrapping even with loop="true" on the html element. The first row will loop, the second will not, and altnerate all the way down. 
                // Need to look into what is causing this when we turn looping back on for the play lists. 
                
            	$scope[dataVar] = [];
            	var rowData = [];
            	var rowId = i;
            	for (var j = 0; j < showsData[i].content.length; j++) {
            		rowData.push(showsData[i].content[j]);

            		if (rowData.length === 6) {
            			var row = {};
            			row.data = rowData;
            			row.depth = APP_CONSTANTS.navigationDepth.shows;
            			$scope[dataVar].push(row);
                        playListIdentifier = 'playListsData' + rowId + "shows";
            			rowData = [];
            			if (rowId !== i) showsData[i].label = '';
            			playList = $compile("<play-list-series id='" + rowId + "' title='" + showsData[i].label + "' listData='" + dataVar + '[' + ($scope[dataVar].length - 1).toString() + ']' + "' playlistidentifier='" + playListIdentifier + "'></play-list-series")($scope);
            			$('#listContainer').append(playList);

            			rowId++;
            		}
            	}

            	if (rowData.length > 0) {
            		var row = {};
        			row.data = rowData;
        			row.depth = APP_CONSTANTS.navigationDepth.shows;
        			$scope[dataVar].push(row);
                    playListIdentifier = 'playListsData' + rowId + "shows";
        			rowData = [];
        			if (rowId !== i) showsData[i].label = '';
        			
        			playList = $compile("<play-list-series id='" + rowId + "' title='" + showsData[i].label + "' listData='" + dataVar + '[' + ($scope[dataVar].length - 1).toString() + ']' + "' playlistidentifier='" + playListIdentifier + "'></play-list-series")($scope);
        			$('#listContainer').append(playList);
				}
            }
		}
		
		$rootScope.$broadcast(EVENTS.displayMainContentLoading, false);
	}
})();
