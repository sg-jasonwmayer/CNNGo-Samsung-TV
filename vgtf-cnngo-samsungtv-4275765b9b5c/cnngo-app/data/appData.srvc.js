'use strict';

angular.module('appData.service', []).service('appDataService', appDataService);

function appDataService(appDataFactory, clipDataFactory, autoPlayFactory, showDataFactory) {
    var exports = {};
    exports.getFeaturedData = getFeaturedData;
    exports.getCategoriesListData = getCategoriesListData;
    exports.getCategoryData = getCategoryData;
    exports.getVodData = getVodData;
    exports.getShowsData = getShowsData;

    function getFeaturedData() {
        console.log("getFeaturedData");
        return appDataFactory.getOnDemandClips().then(onFeaturedDataSuccess, onError);
    }
    
    function onFeaturedDataSuccess(data) {
        console.log("onFeaturedDataSuccess");
        // Build the clip data playlist for featured page data - TODO: Move to buildDataCache
        // autoPlayFactory.buildClipPlayList(data);
        
        //Build data cache
        appDataFactory.buildDataCache(data);
        
        return data;
    }
    
    function getCategoriesListData() {
        console.log("getCategoriesListData");
        return clipDataFactory.getClipsCategories().then(onCategoriesListDataSuccess, onError);
    }
    
    function onCategoriesListDataSuccess(data) {
        console.log("onCategoriesListDataSuccess");
        return data;
    }

    function getCategoryData(category) {
        console.log("getCategoryData");
        return clipDataFactory.getCategoryData(category).then(onCategoryDataSuccess, onError);
    }

    function onCategoryDataSuccess(data) {
        console.log("onCategoryDataSuccess");
        // Build playlist for auto play on Category page
        //these need to come out
        // autoPlayFactory.buildCategoryPlayList(data);
        return data;
    }

    function getShowsData() {
        console.log("getShowsData");
        return showDataFactory.getShowsData().then(onShowsDataSuccess, onError);
    }

    function onShowsDataSuccess(data) {
        console.log("onShowsDataSuccess");
        return data;
    }

    function getVodData(seriesId, titleId) {
        console.log("getVodData");
        return showDataFactory.getVodData(seriesId, titleId).then(onVodDataSuccess, onError);
    }

    function onVodDataSuccess(data) {
        console.log("onVodDataSuccess");
        return data;
    }

    function onError(error) {
        console.log('Error - Unable to get data from the service');
    }
    
    return exports;
    
}