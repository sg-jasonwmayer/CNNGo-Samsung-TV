(function() {
    'use strict';

    angular.module('playListLive.directive', []).directive('playListLive', playListLive);

    function playListLive() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/playList/playListLive.tmpl.html',
            controller : 'playListController',
            link : linkFn,
            scope: {
                listdata: '=',
                playlistidentifier: '='
            }
        };
    }
    
    var linkFn = function($scope, $element, $attr) {
        $scope.directiveName = 'playListLive';
        $scope.title = $attr.title;
        $scope.listCategory = $attr.id;
        $scope.playlistidentifier = $attr.playlistidentifier;
        $scope.focusable = {
            depth : 1,
            group : $attr.id
        };
    };

})();