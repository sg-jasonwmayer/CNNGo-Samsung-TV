(function() {
    'use strict';

    angular.module('playListCategories.directive', []).directive('playListCategories', playListCategories);

    function playListCategories() {
        return {
            restrict : 'E',
            templateUrl : 'app/common/components/playList/playListCategories.tmpl.html',
            controller : 'playListController',
            link : linkFn,
            scope: {
                listdata: '=',
                playlistidentifier: '='
            }
        };
    }
    
    var linkFn = function($scope, $element, $attr) {
        $scope.directiveName = 'playListCategories';
        $scope.title = $attr.title;
        $scope.listCategory = $attr.id;
        $scope.playlistidentifier = $attr.playlistidentifier;
        $attr.focusOption = {
            depth : 1,
            group : $attr.id
        };
    };

})();