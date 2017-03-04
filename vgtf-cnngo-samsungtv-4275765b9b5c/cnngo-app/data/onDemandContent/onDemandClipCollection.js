'use strict';

var OnDemandClipCollection = (function() {

    OnDemandClipCollection.prototype.constructor = OnDemandClipCollection;
    
    function OnDemandClipCollection(collectionData) {
        
        this.id = collectionData._id;
        this.rowType = collectionData.rowType;
        this.label = collectionData.label;
        this.content = [];
        this.isLocked = collectionData.isLocked || true;
        this.isRemoved = collectionData.isRemoved || false;
        this.isActive = collectionData.isActive || false;

        this.ModifiedDateTime = collectionData.ModifiedDateTime || new Date();
        this.CreatedDateTime = collectionData.CreatedDateTime  || new Date();
    }

    OnDemandClipCollection.getData = function(collectionData) {
        
        var ODClips = new OnDemandClipCollection(collectionData);
        if('carouselCollection' === collectionData.rowType || 'smallCarousel' === collectionData.rowType) {
            ODClips.content = collectionData.content.map(OnDemandClip.getData);
        }
        else if(collectionData.rowType === 'posterCarousel' || collectionData.rowType === 'posterSeriesFill') {
            ODClips.content = collectionData.content.map(OnDemandSeries.getData);
        }

        return ODClips;
    }

    return OnDemandClipCollection;
})();