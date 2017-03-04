'use strict';

var OnDemandVodCollection = (function() {

	OnDemandVodCollection.prototype.constructor = OnDemandVodCollection;

	function OnDemandVodCollection(collectionData) {
		this.type = 'episode';
		this.id = collectionData._id;
		this.title = collectionData.title;
		this.titleId = collectionData.titleID;
		if (collectionData.seasonNumber) {
			this.seasonNumber = "Season " + collectionData.seasonNumber;
		} else {
			this.seasonNumber = " ";
		}
		this.episodeName = collectionData.episodeName || collectionData.program[0].episodeName || ' ';
		this.description = collectionData.description;
		this.imagePath = collectionData.mediaAssets[0].imagePaths.r16x9.default[0].imagePath;
		this.totalRunTime = collectionData.totalRunTime || collectionData.program[0].totalRunTime;
		if (collectionData.mediaAssets[0].imagePaths.r16x9.background && collectionData.mediaAssets[0].imagePaths.r16x9.background.length !== 0) {
			this.backgroundPath = collectionData.mediaAssets[0].imagePaths.r16x9.background[0].imagePath;
		} else {
			this.backgroundPath = collectionData.mediaAssets[0].imagePaths.r16x9.default[0].imagePath;
		}
		if(collectionData.videoMetadata === undefined || collectionData.videoMetadata === null){
			this.isAuthenticatedContent = collectionData.program[0].videoMetadata.isAuthenticatedContent;
			this.contentXMLPath = collectionData.program[0].videoMetadata.contentXMLPath;
			this.videoID = collectionData.program[0].videoMetadata.publishAssetID || collectionData.program[0].videoID;
		} else{
			this.isAuthenticatedContent = collectionData.videoMetadata.isAuthenticatedContent;
			this.contentXMLPath = collectionData.videoMetadata.contentXMLPath;
			this.videoID = collectionData.videoMetadata.publishAssetID || collectionData.videoID;
		}
	}

	OnDemandVodCollection.getData = function(collectionData) {
		return new OnDemandVodCollection(collectionData);
	}

	return OnDemandVodCollection;
})();