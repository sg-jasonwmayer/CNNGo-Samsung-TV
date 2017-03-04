(function() {
	'use strict';

	angular.module('playListCategory.directive', []).directive('playListCategory', playListCategory);

	function playListCategory() {
		return {
			restrict 	 : 'E',
			templateUrl  : 'app/common/components/playList/playListCategory.tmpl.html',
			controller   : 'playListController',
			scope		 : true
		};
	}
})();