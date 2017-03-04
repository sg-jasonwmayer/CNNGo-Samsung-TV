'use strict';

var ClipCategory = (function() {

    ClipCategory.prototype.constructor = ClipCategory;
    
    function ClipCategory(categoryData) {
        this.id = categoryData._id;
        this.categoryCode = categoryData.categoryCode;
        this.categoryName = categoryData.categoryName;
        this.ModifiedDateTime = categoryData.ModifiedDateTime || new Date();
        this.CreatedDateTime = categoryData.CreatedDateTime  || new Date();
        this.isLocked = categoryData.isLocked;
        this.isRemoved = categoryData.isRemoved;
        this.isActive = categoryData.isActive;
        this.imageUrl = categoryData.mediaAssets.baseImagePath;
    }


    ClipCategory.getData = function(categoryData) {
        return new ClipCategory(categoryData);
    }

    return ClipCategory;
})();