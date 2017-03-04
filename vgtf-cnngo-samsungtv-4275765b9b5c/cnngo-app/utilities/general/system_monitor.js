'use strict';

angular
.module('app.utilities')
.factory('SystemMonitor', SystemMonitor);

/**
* FireTV system montioring 
*
* @class SystemMonitor
*
* @requires Aspen -- defined as global in lib/aspen/aspen_1.8.0.js
* @requires ENV
* @requires MementoService
* @requires $interval 
* @requires $timeout
* @requires $q
*
* @ngInject
*/
function SystemMonitor(ENV, MementoService, $interval, $timeout, $q) {

  var _throttled = true; 
  var _servername;
  var _sessionId;
  var _shortId;
  var _aspenUUID;
  var _timestamp;

  var _progressReportInterval;

  var _videoObj = {};
  var _initTimer = false;
  var _initTimedOut = false;
  var _init_deferred = $q.defer();
  var _videoContentCount = 0;
  var _progressID;
  var _checkBufferingInterval = 10; //ms
  var _lastPlayPos;

  var exports = {}; 

  exports.init = init;
  exports.startHeartbeat = startHeartbeat;
  exports.contentStart = contentStart;
  exports.contentPlay = contentPlay;
  exports.contentStop = contentStop;
  exports.error = error;
  exports.mvpdAuthenticated = mvpdAuthenticated;
  exports.appLoadComplete = appLoadComplete;
  exports.exitCNNFireApp = exitCNNFireApp;
  exports.retrieveAdobeTokenComplete = retrieveAdobeTokenComplete;
  exports.rundownRequest = rundownRequest;
  exports.rundownSuccess = rundownSuccess;
  exports.rundownFailure = rundownFailure;
  exports.papiRequest = papiRequest;
  exports.papiSuccess = papiSuccess;
  exports.papiFailure = papiFailure;  
  exports.odmRequest = odmRequest;
  exports.odmSuccess = odmSuccess;
  exports.odmFailure = odmFailure;

  exports.drawerOpen = drawerOpen;
  exports.channelChange = channelChange;

  exports.enterSegment = enterSegment;
  exports.enterShow = enterShow;

  exports.goLive = goLive;

  /**
  * init
  *
  * @public
  *
  * init Aspen and send hello
  */
  function init(){
    
    Aspen.init({
      "site"        : ENV.aspen.site,
      "appName"     : ENV.aspen.appName,
      "appVersion"  : ENV.appVersion,
      "platform"    : ENV.aspen.platform      
    }, _parseAspenInitialization);

    _initTimer = $timeout(function initTimeout(){
      _initTimedOut = true;
      _init_deferred.reject("Aspen Init timeout");
      MementoService.error("Aspen Init timeout");
    }, ENV.aspen.initTimeout_sec * 1000);

    return _init_deferred.promise;
  }

  /**
  * startHeartbeat
  *
  * @public
  *
  * send ngtvBeacon every ENV.aspen.heartbeatfrequency_sec seconds
  */ 
  function startHeartbeat() {
    if (_throttled || !_progressReportInterval || isNaN(_progressReportInterval)) { return; }

    $interval(
      function heartbeat(){
        Aspen.send("ngtvBeacon");
        MementoService.debug("SystemMonitor.heartbeat ngtvBeacon sent");

        contentProgress();
      }, 
      _progressReportInterval * 1000
    );
  }

  /**
  * contentStart
  *
  * @public
  *
  * send contentStart
  */ 
  function contentStart(id, dataOptions) {
    if (!!_videoObj[id]) { return; }

    initializeVideoObj(id);
    _videoObj[id].videoRequestTS = new Date();
    _videoObj[id].contentId = dataOptions.contentId;

    dataOptions["videoContentCount"] = _videoObj[id].videoContentCount;

    _progressID = id; // store value for progress calls

    Aspen.send("contentStart", dataOptions);
    MementoService.debug("SystemMonitor.contentStart sent");
  }

  /**
  * contentPlay
  *
  * @public
  *
  * send contentPlay
  */ 
  function contentPlay(id, dataOptions) {
    if (!_videoObj[id]) { return; }

    _videoObj[id].videoStartTS = new Date();

    dataOptions["videoContentCount"] = _videoObj[id].videoContentCount;
    dataOptions["joinTime"] = (_videoObj[id].videoStartTS - _videoObj[id].videoRequestTS)/1000;

    Aspen.send("contentPlay", dataOptions);
    MementoService.debug("SystemMonitor.contentPlay sent");
  }  

  /**
  * contentStop
  *
  * @public
  *
  * send contentStop
  */ 
  function contentStop(id, dataOptions) {
    if (!_videoObj[id]) { return; }

    dataOptions["videoContentCount"] = _videoObj[id].videoContentCount;
    dataOptions["timeSpentPlaying"] = (new Date() - _videoObj[id].videoStartTS)/1000;

    Aspen.send("contentStop", dataOptions);
    MementoService.debug("SystemMonitor.contentStop sent");

    //unload videoObj 
    delete _videoObj[id];

    //reset _progressID
    var keys = Object.keys(_videoObj);
    if (keys.length > 0) {
      _progressID = keys[keys.length - 1];
    } else {
      _progressID = undefined;
    }
  }    

  /**
  * error
  *
  * @public
  *
  * send errors
  */ 
  function error(id, dataOptions) {
    Aspen.send("error", dataOptions);
    MementoService.debug("SystemMonitor.error sent");

    delete _videoObj[id];
  }

  /**
  * mvpdAuthenticated
  *
  * @public
  *
  * send ngtvBeacon every ENV.aspen.heartbeatfrequency_sec seconds
  */ 
  function mvpdAuthenticated(mvpd) {    
    Aspen.send("mvpdAuthenticated", {"mvpd": mvpd});
    MementoService.debug("SystemMonitor.mvpdAuthenticated mvpdAuthenticated sent mvpd: " + mvpd);
  }

  /**
  * exitCNNFireApp
  *
  * @public
  *
  * send exitApp on exit of application
  */ 
  function exitCNNFireApp(){
    var def = $q.defer();

    Aspen.send('exitApp', { "exitMode" : "closeApp"});  //Batch exit
    Aspen.batchService.post();  //Flush aspen batch

    def.resolve();
    return def.promise;
  }


  /**
  * retrieveAdobeTokenComplete
  *
  * @public
  *
  * send token complete after adobe token response
  */ 
  function retrieveAdobeTokenComplete(label, wasSuccessful, retreivalDuration, errorMsg){
    var _label = label || null;
    var _wasSuccessful = wasSuccessful || null;
    var _retreivalDuration = retreivalDuration || null;
    var _errorMsg = errorMsg || null;
//TODO: This was commented out because it was causing an error... need to investigate when I come back for analytics
//    Aspen.send('retrieveAdobeTokenComplete', { 
//      "label" : _label,
//      "wasSuccessful" : _wasSuccessful,
//      "retreivalDuration" : _retreivalDuration
//    });
//    
//    if(errorMsg) {
//      Aspen.send("error", { 
//          "errorCode" : _label, 
//          "errorMessage" : _errorMsg
//      });
//    }

  }

  /**
  * appLoadComplete
  *
  * @public
  *
  * broadcast appLoadComplete when app has finished loading and user is directed to featured page
  */ 
  function appLoadComplete(){
    Aspen.send("appLoadComplete");
  }

  /**
  * rundownRequest
  *
  * @public
  *
  * broadcast rundownRequest
  */ 
  function rundownRequest(){
    Aspen.send("rundownRequest");
  }

  /**
  * rundownSuccess
  *
  * @public
  *
  * broadcast rundownSuccess
  */ 
  function rundownSuccess(){
    Aspen.send("rundownSuccess");
  }

  /**
  * rundownFailure
  *
  * @public
  *
  * broadcast rundownFailure
  */ 
  function rundownFailure(){
    Aspen.send("rundownFailure");
  }

  /**
  * papiRequest
  *
  * @public
  *
  * broadcast papiRequest
  */ 
  function papiRequest(){
    Aspen.send("papiRequest");
  }

  /**
  * papiSuccess
  *
  * @public
  *
  * broadcast papiSuccess
  */ 
  function papiSuccess(){
    Aspen.send("papiSuccess");
  }

  /**
  * papiFailure
  *
  * @public
  *
  * broadcast papiFailure
  */ 
  function papiFailure(){
    Aspen.send("papiFailure");
  }

 /**
  * odmRequest
  *
  * @public
  *
  * broadcast odmRequest
  */ 
  function odmRequest(){
    Aspen.send("odmRequest");
  }

  /**
  * odmSuccess
  *
  * @public
  *
  * broadcast odmSuccess
  */ 
  function odmSuccess(){
    Aspen.send("odmSuccess");
  }

  /**
  * odmFailure
  *
  * @public
  *
  * broadcast odmFailure
  */ 
  function odmFailure(){
    Aspen.send("odmFailure");
  }

  /**
  * drawerOpen
  *
  * @public
  *
  * broadcast drawerOpen
  */ 
  function drawerOpen(drawer){
    Aspen.send("drawerOpen", {drawer: drawer} );
  }

  /**
  * channelChange
  *
  * @public
  *
  * broadcast channelChange
  */
  function channelChange(fromChan, toChan){
    Aspen.send("channelChange", {fromChannel: fromChan, toChannel: toChan} ); 
  }

  /**
  * enterSegment
  *
  * @public
  *
  * broadcast enterSegment
  */
  function enterSegment(playingObj, enterMode, isLive){
    Aspen.send("enterSegment", 
      { enterMode: enterMode, 
        franchiseId: playingObj.parentId,
        franchiseTitle: playingObj.showTitle,
        videoState: (isLive) ? 'live' : 'dvr',
        showId: playingObj.parentId,
        showTitle: playingObj.showTitle,
        sponsored: false,
        sponsor: null,
        section: 'Rundown',
        segmentId: playingObj.id,
        segmentTitle: playingObj.title,
        segmentType: 'exclusive'
      } 
    ); 
  }


  /**
  * enterShow
  *
  * @public
  *
  * broadcast enterShow
  */
  function enterShow(playingObj, enterMode, isLive){
    Aspen.send("enterShow", 
      { enterMode: enterMode, 
        franchiseId: playingObj.id,
        franchiseTitle: playingObj.title,
        videoState: (isLive) ? 'live' : 'dvr',
        showId: playingObj.id,
        showTitle: playingObj.title,
        featured: false,
        comingSoon: false
      } 
    ); 
  } 

  /**
  * goLive
  *
  * @public
  *
  * broadcast goLive
  */
  function goLive(){
    Aspen.send("goLive"); 
  }

  /**
  * _parseAspenInitialization
  *
  * @private
  *
  * parse aspen init response and store locally
  */
  function _parseAspenInitialization(){ 
    if (!_initTimedOut) { 
      $timeout.cancel(_initTimer);
      _initTimer = undefined;

      _throttled  = this._isThrottled;
      _servername = this.servername;
      _sessionId  = this.sessionId;
      _shortId    = this.shortId;
      _aspenUUID  = this.aspenUUID;
      _timestamp  = this.timestamp;
      _progressReportInterval = this.config.progressReportInterval;

      _init_deferred.resolve();
      MementoService.debug("SystemMonitor.parseAspenInitialization throttled: " + _throttled + " sessionId: " + _sessionId);
    }
  }  

  function initializeVideoObj(id){
    _videoObj[id] = {
      player : document.getElementById(id),
      videoContentCount : ++_videoContentCount,
      videoRequestTS : null,
      videoStartTS : null,
      secPlayed : 0.0, 
      secBuffered : 0.0,
      secPaused : 0.0,
      contentId : null
    }
  }

  /**
  * contentProgress
  *
  * @private
  *
  * send contentProgress
  */ 
  function contentProgress() {
    if (!Object.keys(_videoObj).length > 0 || !_progressID || !(_videoObj[_progressID])) { return; }

    var player = _videoObj[_progressID].player;

    var dataOptions = {
      ccEnabled : Boolean(!!player.textTracks && !!player.textTracks[0] && player.textTracks[0].mode == 'showing'),
      timeSpentPlaying : _videoObj[_progressID].secPlayed,
      timeSpentBuffering : _videoObj[_progressID].secBuffered,
      videoContentCount : _videoObj[_progressID].videoContentCount,
      contentId : _videoObj[_progressID].contentId
    };

    if (player.webkitDecodedFrameCount > 0) {
      dataOptions["currentFps"] = player.webkitDecodedFrameCount / _videoObj[_progressID].secPlayed;
    }
    if (player.webkitVideoDecodedByteCount > 0) {  
      dataOptions["currentBitrate"] = player.webkitVideoDecodedByteCount / _videoObj[_progressID].secPlayed;
    }

    Aspen.send("contentProgress", dataOptions);
    MementoService.debug("SystemMonitor.contentProgress sent");
  }  

  $interval(checkBuffering, _checkBufferingInterval);
  function checkBuffering() {
      if (!Object.keys(_videoObj).length > 0 || !_progressID || !(_videoObj[_progressID])) { return; }

      var player = _videoObj[_progressID].player;
      var currentPlayPos = player.currentTime;

      var offset = parseFloat(_checkBufferingInterval / 1000);

      // if the player isn't manually paused
      // and the position does not seem to increase
      if (player.paused) {
        _videoObj[_progressID].secPaused = (parseFloat(_videoObj[_progressID].secPaused) + offset).toFixed(5);
      } else {
        if ( currentPlayPos < (_lastPlayPos + offset)) {
            _videoObj[_progressID].secBuffered = (parseFloat(_videoObj[_progressID].secBuffered) + offset).toFixed(5); 
        } else if ( currentPlayPos > (_lastPlayPos + offset)) {
            _videoObj[_progressID].secPlayed = (parseFloat(_videoObj[_progressID].secPlayed) + offset).toFixed(5);
        }
      }
      _lastPlayPos = currentPlayPos;
  } 

  return exports;
}