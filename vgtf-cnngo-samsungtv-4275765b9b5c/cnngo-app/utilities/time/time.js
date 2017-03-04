/**
 * Service to handle tracking of the playhead and timing logic. This has to be done by making requests to the STB to make sure our
 * time logic doesn't drift from the box's. We make these requests every 5 seconds if we are doing playback. Making requests more often
 * will cause the performance of the box to degrade.
 *
 * @class  TimeService - FireTV 
 *
 * @requires ENV
 * @requires UtilService
 * @requires MementoService
 *
 * @ngInject */
function TimeService(ENV, UtilService, MementoService/*, video*/) {

    'use strict';

    var exports = {};

    var broadcastTime = null,
        _rundownLast = 0,
        _rundownStartTime = 0,
        _rundownDuration = 0,
        _offset = 0,
        _playheadTime = null,
        _latestStart = 0;

    var playheadLoop = null,
        isLive = false;

    var syncCount = 0;

    var frozen = false;

    ////////////////////////
    //  Public Methods  ////
    ////////////////////////

    exports.start = start;
    exports.end = end;
    exports.shiftTime = shiftTime;
    exports.setLast = setLast;
    exports.getLast = getLast;
    exports.getCurrentTime = getCurrentTime;
    exports.setLiveStatus = setLiveStatus;
    exports.getLiveStatus = getLiveStatus;
    exports.getPlayheadTime = getPlayheadTime;
    exports.setPlayheadTime = setPlayheadTime;
    exports.getPlayTime = getPlayTime;
    exports.updatePlayheadObject = updatePlayheadObject;
    exports.setPlayheadLive = setPlayheadLive;
    exports.freezePlayhead = freezePlayhead;
    exports.restartPlayheadLoop = restartPlayheadLoop;
    exports.syncNewPlayhead = syncNewPlayhead;
    exports.syncBufferedPlayhead = syncBufferedPlayhead;
    exports.isWithinLiveDAIPeriod = isWithinLiveDAIPeriod;
    exports.getLiveTime = getLiveTime;
    exports.freezeSync = freezeSync;
    exports.thawSync = thawSync;

    /**
     * Gets the rundown start time based on the environmental configs. This is paginated forward as time goes on.
     *
     * @public
     *
     * @return {Number}
     */
    function start() {
        if (_rundownStartTime == 0) {
            _rundownStartTime = Date.now() / 1000 - ENV.rundown.lookBehindHours * 3600;
        }
        return parseInt(_rundownStartTime);
    }

    /**
     * Gets the rundown end time based on the environmental configs. This is paginated forward as time goes on.
     *
     * @public
     *
     * @return {Number}
     */
    function end() {
        if (_rundownDuration == 0) { 
            _rundownDuration = (ENV.rundown.lookBehindHours + ENV.rundown.lookAheadHours) * 3600;
        }
        return parseInt(_rundownStartTime) + parseInt(_rundownDuration);
    };

    /**
     * Shifts the start and end time by an hour. Used when we need to paginate the rundown info.
     *
     * @public
     */
    function shiftTime() {
        _rundownStartTime += _rundownDuration;
        _rundownDuration = 3600;
    };

    /**
     * Gets the current time on the STB. new Date() is currently the best method but if we need to make changes based on
     * TimeZone we can make it here.
     *
     * @public
     *
     * @return {Number} Current Time
     */
    function getCurrentTime() {
        return Date.now();
    };

    /**
     * Allows a service to set the live status of the application.
     *
     * @public
     */
    function setLiveStatus(status) {
        isLive = status;
    };

    /**
     * Get the live state of the application.
     *
     * @public
     *
     * @return {Boolean}
     */
    function getLiveStatus() {
        return isLive;
    };

    /**
     * Sets the last time that we called time machine for an update
     *
     * @public
     *
     * @param {Number} time The last time
     */
    function setLast(time) {
        _rundownLast = time;
    };

    /**
     * Gets the last time that we called time machine for an update
     *
     * @public
     */
    function getLast() {
        return _rundownLast;
    };

    /**
     * Get the current playhead time as determined by the playhead loop.
     *
     * @public
     *
     * @return {Number} playhead time in milliseconds
     */
    function getPlayheadTime() {
        return (!!_playheadTime) ? _playheadTime : getLiveTime();
    };

    /**
     * Set the Playhead Time
     *
     * @public
     *
     */
    function setPlayheadTime(ts) {
        _playheadTime = ts;
    };

    /**
     * Get the playing time. Used for determining the exact amount of time VOD programs have been playing.
     *
     * @public
     *
     * @param  {Number} time variable that gets assigned the time
     */
    function getPlayTime(time) {
        time = parseInt(_playheadTime);
        return time;
    };

    /**
     * Updates the playhead object. The box only reports an offset so we need to know the start time of what we are playing
     * in order to add it to the offset to get the actual playhead time. This method can also be overwritten to just apply the
     * new start time but to set the playhead to live.
     *
     * @public
     *
     * @param  {Number} startTime Start time of the program playing on the box
     * @param  {Boolean} live     Live status
     */
    function updatePlayheadObject(startTime, live) {
        _latestStart = startTime;

        if (live) {
            this.setPlayheadLive();
        } else {
            isLive = false;
        }

        if (!playheadLoop || playheadLoop == null) {
            movePlayheadTime();
        }
    };

    /**
     * Sets the playhead to the live time.
     *
     * @public
     */
    function setPlayheadLive() {
        _playheadTime = getLiveTime();
        isLive = true;

        if (!playheadLoop || playheadLoop == null) {
            movePlayheadTime();
        }
    };

    /**
     * Freezes the playhead. This is used when there is a temporary pause in the playback video and saves us from making continuous
     * unnecessary calls to the STB.
     *
     * @public
     *
     * @return {Number} The frozen playhead time
     */
    function freezePlayhead() {
        if (playheadLoop != null) {
            clearTimeout(playheadLoop);
        }
        playheadLoop = null;

        syncPlayheadSync();
        isLive = false;

        return _playheadTime;
    };

    /**
     * Restarts the playhead loop. Can be used after freezing the playhead to restart where it was left off.
     *
     * @public
     */
    function restartPlayheadLoop() {
        clearTimeout(playheadLoop);
        playheadLoop = null;

        playheadLoop = setTimeout(movePlayheadTime, 5000);
    }

    /**
     * FireTV plays a single 6 hr stream there syncing across programs is not needed
     *
     * @public
     *
     * @param  {Object} syncObj Object to sync playhead with.
     * @return {Boolean}        True if sync was successful
     */
    function syncNewPlayhead(syncObj) {
        return manualSync(syncObj, false);
    };

    /**
     * Sync the playhead with a new object. Unlike syncing with a new object, this will just sync with the current latest time.
     *
     * @public
     *
     * @param  {Object} syncObj Object to sync the playhead with.
     * @return {Boolean}        True if sync was successful
     */
    function syncBufferedPlayhead(syncObj) {
        return manualSync(syncObj, true);
    };

    /**
     * Return true if ts is within DAI Period 
     *
     * @public
     *
     * @param  {Timestamp} time in s, default to playheadtime if not specified
     * @return {Boolean}
     */
    function isWithinLiveDAIPeriod(ts) {    
        ts = (!ts) ? getPlayheadTime() : ts * 1000;
        var _now = Date.now() - ENV.firetvLiveDelay*1000;

        return Math.abs(_now - ts) <= ENV.rundownExperience.insertAdsPeriod; 
    }

    /**
     * determine current live time
     *
     * @private
     */
    function getLiveTime() {
        return Date.now() - ENV.firetvLiveDelay*1000;
    };    

     /**
     * prevent sync of playhead
     *
     * @private
     */   
    function freezeSync() {
        frozen = true;
        clearTimeout(playheadLoop);
    }

     /**
     * restore sync of playhead
     *
     * @private
     */      
    function thawSync() {
        frozen = false;
        movePlayheadTime();
    }

    ////////////////////////
    //  Private Methods  ///
    ////////////////////////

    /**
     * Start of the playhead update loop. If there is no playhead time it will call the sync method to get the initial time, if we are
     * live it will set the playhead to the current time, otherwise it just calls the update function to deteremine if we should sync
     * with the box or just add the time between the loops.
     *
     * @private
     */
    function movePlayheadTime() {
        clearTimeout(playheadLoop);

        syncPlayheadSync();
        playheadLoop = setTimeout(movePlayheadTime, 500);
    };

    /**
     * Sync method called when we need to sync the playehad with a new object. Used the sync object's material id
     * to deteremine if the box is playing the correct program. If we are, the offset reported by the box is added to the
     * start time of the playing program to deteremine the playhead. If we aren't already buffered we will use the
     * sync objections start time plus the STB reported offset.
     *
     * @private
     *
     * @param  {Object} syncObj     the object we are syncing with
     * @param  {Boolean} wasBuffered bool that tells the function if it should use the sync obj's start time
     * @return {Boolean}            True if the sync was successful
     */
    function manualSync(syncObj, wasBuffered) {
        //If we are live, just set us to live and return true;
        if (isLive) {
            _playheadTime = getLiveTime();
            MementoService.debug('SyncObj is live so we are syncing with the live time');
            return true;
        } else {
            isLive = false;
        }

        clearTimeout(playheadLoop);
        playheadLoop = null;
        playheadLoop = setTimeout(movePlayheadTime, 500);

//        if (!frozen) { _playheadTime = video.videoMetaTimestamp; }
        return true;
    };


    /**
     * FireTV can read playhead from the video making calls to the "box" irrelevant 
     *
     * @private
     */
    function updatePlayhead() {
        syncPlayheadSync();
        syncCount = 0;
    };

    /**
     * read player position.
     *
     * @private
     */
    function syncPlayheadSync() {
//        if (!frozen && !!video.videoMetaTimestamp) {
//            _playheadTime = video.videoMetaTimestamp;
//        } 
        return true;
    };

    return exports;
}

angular
    .module('app.utilities')
    .service('TimeService', TimeService);