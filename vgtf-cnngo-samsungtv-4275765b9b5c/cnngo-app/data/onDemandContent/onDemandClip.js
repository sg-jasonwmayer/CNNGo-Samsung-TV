'use strict';

var OnDemandClip = (function() {

    OnDemandClip.prototype.constructor = OnDemandClip;
    
    function OnDemandClip(clipData) {
        this.type = "clip";
        this.id = clipData._id;
        this.lastReleaseDate = clipData.lastReleaseDate;
        this.orgReleaseDate = clipData.orgReleaseDate; 
        this.episodeName = clipData.episodeName;
        this.totalRunTime = clipData.totalRunTime;
        this.videoID = clipData.videoID;
        this.title = clipData.title;
        this.titleID = clipData.titleID;
        this.titleType = clipData.titleType;
        this.description = clipData.description;
        this.adBlocks = clipData.videoMetadata.primeTimeAdBlocks;
        this.contentXMLPath = clipData.videoMetadata.contentXMLPath;
        if('undefined'  !== typeof(clipData.mediaAssets[0])) {
            this.imageUrl = clipData.mediaAssets[0].imagePaths.r16x5.default[0].imagePath;
        }
        else {
            this.imageUrl = clipData.mediaAssets.imagePaths.r16x9.default[0].imagePath;
        }
    }


    OnDemandClip.getData = function(clipData) {
        return new OnDemandClip(clipData);
    }

    return OnDemandClip;
})();