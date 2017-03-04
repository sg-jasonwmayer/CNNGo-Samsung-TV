'use strict';

var OnDemandSeries = (function() {

    OnDemandSeries.prototype.constructor = OnDemandSeries;

    function OnDemandSeries(seriesData) {
        this.seriesId = seriesData.seriesTitleID;
        this.id = seriesData._id;
        this.titleId = seriesData.titleID;
        this.title = seriesData.title;
        if (seriesData.seasonNumber) {
            this.seasonNumber = "Season " + seriesData.seasonNumber;
        } else {
            this.seasonNumber = " ";
        }
        this.description = seriesData.description;
        this.imageUrl = seriesData.mediaAssets[0].imagePaths.r3x4.default[0].imagePath;
        if(seriesData.mediaAssets[0].imagePaths.r16x9.background && seriesData.mediaAssets[0].imagePaths.r16x9.background.length !== 0) {
            this.backgroundPath = seriesData.mediaAssets[0].imagePaths.r16x9.background[0].imagePath;
        } else {
            this.backgroundPath = seriesData.mediaAssets[0].imagePaths.r16x9.default[0].imagePath;
        }
    }


    OnDemandSeries.getData = function(seriesData) {
        return new OnDemandSeries(seriesData);
    }

    return OnDemandSeries;
})();