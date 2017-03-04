'use strict';

app.controller('controller', ['$rootScope', '$scope', '$timeout', '$document', 'FocusUtil', 'FocusConstant', 'focusController', 'CONSTANT', function ($rootScope, $scope, $timeout, $document, FocusUtil, FocusConstant, focusController, CONSTANT) {

    /* CONSTANT values definition */
    $scope.CATEGORY = CONSTANT.CATEGORY;
    $scope.DEPTH = {
        INDEX: 1,
        DETAIL: 2,
        PLAYER: 3,
        SETTING: 4
    };

    /* Initial values are defined. */
    $scope.currentCategory = $scope.CATEGORY.COLORS;
    $scope.currentDepth = $scope.DEPTH.INDEX;
    $scope.isOverviewDark = true;
    $scope.showMediaController = false;
    var lastDepth = $scope.currentDepth;
    var items = CONSTANT.ITEMS;
    $scope.dataCategory = [items, items, items, items];
    $scope.relatedPlaylist = [items];
    
    $scope.log = function(msg) {
        console.log(msg);
    };

    $document.on('ready', function(){
        $timeout(function(){
        	$scope.config = {
				//url: 'http://ht.cdn.turner.com/cnn/big/world/2016/10/04/philippines-duterte-obama-go-to-hell.cnn_ios_150.mp4',
				//url: 'http://cnnios-f.akamaihd.net/i/cnn/big/world/2016/10/04/philippines-duterte-obama-go-to-hell.cnn_825537_ios_,650,840,1240,3000,.mp4.csmil/master.m3u8?__a__=off&amp;__b__=1240',
				//url: 'http://phls-live.cdn.turner.com/cnn/cnnx/hls/stream.m3u8?hdnea=st=1475609592~exp=1475609892~acl=/*~hmac=8cd08d0bfd9cb177cbf8e4a5fd2fa0ed8f0ffb811b65d88c963ead60ead33d83',
				//url: 'http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8',
				url: 'http://ht.cdn.turner.com/cnn/big//world/2016/10/04/philippines-duterte-obama-go-to-hell.cnn_825537_768x432_1300k.mp4',
				player: document.getElementById('av-player'),
				logger: $scope.log
        	};
        	
        	
            /* Fill up the array for each list component. */
            updateCategoryListData(CONSTANT.PREPARED_DATA.COLORS, $scope.CATEGORY.COLORS, true);
            updateCategoryListData(CONSTANT.PREPARED_DATA.ALPHABETS, $scope.CATEGORY.ALPHABETS, true)
            updateCategoryListData(CONSTANT.PREPARED_DATA.NUMBERS, $scope.CATEGORY.NUMBERS, true);
            $scope.isInitCompleted = true;  // 'Welcome' page will be disappear by this line.

            $timeout(function () { // Set 'focus' to specific element by 'focus' controller.
                focusController.focus($('#0-color_0'));
            }, 2000);
            
            $scope.player = new VideoPlayer($scope.config);
            $scope.player.open($scope.config.url);
            
            updateTopMenu(1);
            
            $timeout(function () {
            	$scope.player.play();
            }, 3000);
            
        }, 7000);
    });

    var lastFocusedGroup;
    var currentItemData;

    var isScrolling = false;
    $scope.onScrollStart = function () {
        isScrolling = true;
    };
    $scope.onScrollFinish = function () {
        isScrolling = false;
    };

    // The callback function which is called when each list component get the 'focus'.
    $scope.focus = function ($event, category, data, $index) {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            var scrollCount = category;
            // Translate each list component to up or down.
            moveContainer(category, 'list-category', -CONSTANT.SCROLL_HEIGHT_OF_INDEX * scrollCount);
            if (!data || !data.item || data.item.loaded === false) {
                return;
            }
            currentItemData = data.item;
            isScrolling === false;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    };

    // The callback function which is called when each list component lose the 'focus'.
    $scope.blur = function ($event, category, data) {
        $scope.isOverviewDark = true;
    };

    
    $scope.selectedPlay = function ($event, category, item, $index) {
    	$scope.player.stop();
    	$timeout(function () {
    		$scope.player.play();
        }, 1000);
    }
    
    $scope.buttonFocusInDetail = function ($event, $originalEvent) {
        $scope.isOverviewDark = false;
    };

    $scope.changeDisplayDepth = function($event, depth){
        changeDepth(depth);
    };

    // 'Changing depth' means the scene is changed.
    var changeDepth = function(depth, callback) {
    	updateTopMenu(depth);
    	
        lastDepth = $scope.currentDepth;
        $scope.currentDepth = depth;
        $timeout(function () {
            focusController.setDepth(depth);
            if(depth === $scope.DEPTH.DETAIL){
                //focusController.focus('btnPlay');
            }
            callback && callback();
        }, CONSTANT.EFFECT_DELAY_TIME);
    };
    
    function updateTopMenu(depth) {
    	$('#featured').removeClass('menu-item-focused');
    	$('#search').removeClass('menu-item-focused');

    	if(depth === $scope.DEPTH.INDEX) {
    		$('#featured').addClass('menu-item-focused');
    	}
    	else if(depth === $scope.DEPTH.DETAIL) {
    		$('#search').addClass('menu-item-focused');
    	}
    	
    }

    // Update and reload data for each list component.
    function updateCategoryListData(response, category, reload) {
        $scope.dataCategory[category] = response;
        $timeout(function(){
            reload && $('#list-' + category).trigger('reload');
        }, 0);
    };

    // Translate specific element using css property 'transform'.
    var moveContainer = function(category, regionId, targetTop) {
        if (category === $scope.currentCategory) {
            return;
        }
        $('#' + regionId).css({
            transform: 'translate3d(0, ' + targetTop + 'px, 0)'
        });
        $scope.currentCategory = category;
    };

}
]);