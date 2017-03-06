(function() {
    'use strict';

    angular.module('appFilters').filter('imageTransform', imageTransform);

    function imageTransform() {
        function transform(imageUrl, param1, param2) {
            if(typeof imageUrl === 'undefined' || imageUrl === '') {
                return '';
            }
            
            var settings = '';
            
            if(typeof param1 !== 'undefined' && param1 !== '') {
                settings += param1 + ',';
            }
            
            if(typeof param2 !== 'undefined' && param2 !== '') {
                settings += param2;
            }
            
            var targetImageUrl = imageUrl.replace('org', settings);
            return targetImageUrl;
        }

        return transform;
    }
})();
