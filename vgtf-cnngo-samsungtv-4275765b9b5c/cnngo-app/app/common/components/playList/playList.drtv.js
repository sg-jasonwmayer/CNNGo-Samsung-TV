(function() {
    'use strict';

    angular.module('playList.directive', []).directive('playList', playList);

    function playList() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/playList/playList.tmpl.html',
            controller : 'playListController',
            link : linkFn,
            scope: {
                listdata: '=',
                playlistidentifier: '='
            }
        };
    }
    
    var linkFn = function($scope, $element, $attr) {
        $scope.directiveName = 'playList';
        $scope.title = $attr.title;
        $scope.listCategory = $attr.id;
        $scope.playlistidentifier = $attr.playlistidentifier;
        $attr.focusOption ? ($scope.focusable = $scope.$eval($attr.focusOption)): ($scope.focusable = {
            depth : 1,
            group : $attr.id
        });
    };

})();