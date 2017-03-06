(function() {
    'use strict';

    angular.module('playListSeries.directive', []).directive('playListSeries', playListSeries);

    function playListSeries() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/playList/playListSeries.tmpl.html',
            controller : 'playListController',
            link : linkFn,
            scope: {
                listdata: '=',
                playlistidentifier: '='
            }
        };
    }
    
    var linkFn = function($scope, $element, $attr) {
        $scope.directiveName = 'playListSeries';
        $scope.title = $attr.title;
        $scope.listCategory = $attr.id;
        $scope.playlistidentifier = $attr.playlistidentifier;
        $scope.focusable = {
            depth : 1,
            group : $attr.id
        };
    };

})();