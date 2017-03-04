'use strict';

var linkFn = function ($scope, $element, $attr) {
    $scope.title = $attr.title;
    $scope.listCategory = $attr.id * 1;
    $attr.focusOption ? ($scope.focusable = $scope.$eval($attr.focusOption)) : ($scope.focusable = {
        depth: 1,
        group: $attr.id
    });
};

app.directive('playList', function(){
    return {
        restrict: 'E',
        templateUrl: 'views/templates/playlist.html',
        scope: true,
        link: linkFn
    };
});

app.directive('playListSm', function(){
    return {
        restrict: 'E',
        templateUrl: 'views/templates/playlistSm.html',
        scope: true,
        link: linkFn
    };
}).directive('relatedPlayList', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/relatedPlaylist.html',
        scope: true
    };
});