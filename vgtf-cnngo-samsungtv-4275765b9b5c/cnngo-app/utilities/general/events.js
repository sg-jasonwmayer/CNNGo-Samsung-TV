(function() {
  'use strict';

  angular
    .module('app.utilities')
    .constant('EVENTS', {
      authNSuccess: 'AuthN Success!',
      authNExpired: 'AuthN Expired!',
      authNLogout: 'AuthN Logout!',
      onRegCode: 'Got RegCode!',
      onLoginPage: 'To Login Page!',
      leftLoginPage: 'Left Login Page!',
      goToFeatured: 'To Featured!',
      goToLivePlayer: 'To Live!',
      goToSeries: 'To Series!',
      goToPlayer: 'To Player!',
      goToVodPlayer: 'To VOD Player',
      goToCategories: 'To Categories!',
      loadPlaylist: 'loadPlaylist',
      updateTrickbar: 'Trickbar Updated',
      ngTokenAcquired: 'ngTokenAcquired',
      openGlobalNav: 'openGlobalNav',
      authN_Failed: 'authN_Failed',
      goBack: 'goBack',
      returnToLive: 'returnToLive',
      transitions: 'Transitions Off',
      authenticationStateChange: 'Authentication State Changed',
      closedCaptionState: 'Closed Captions Init Listener',
      toggleClosedCaptions: 'Closed Captions Toggled',
      reduceBreadCrumb: 'Breadcrumb Item Removed',

      SwimLaneOutTop: 'swimlaneTop',
      SwimLaneOutBottom: 'swimlaneBottom',
      swimlaneMute: 'swimlaneMute',
      swimlaneUnMute: 'swimlaneUnMute',
      showCarouselMute: 'ShowCarouselMute',
      showCarouselUnMute: 'ShowCarouselUnMute',

      toTopControl: 'To Top Control!',     

      showSignInModal: 'showSignInModal',
      hideSignInModel: 'hideSignInModel',    

      triggerExit: "triggerExit", 
      exitSelected: "exitSelected",

      showInformationModal: 'showInformationModal',
      hideInformationModel: 'hideInformationModel',

      showExitModal: 'showExitModal',
      hideExitModel: 'hideExitModel',
      closeExitModal: "closeExitModal",

      playbackFailed: "playbackFailed",
      playbackSucceeded: "playbackSucceeded",
      retryPlayback: 'retryPlayback',

      exitingApp: "exitingApp",
      resumeLastPlayingContent: "resumeLastPlayingContent",
      adBreakStart: "adBreakStart",
      adBreakStop: "adBreakStop",

      //player controls events.
      playTimeUpdate: "playTimeUpdate",
      bufferAmountUpdate: "bufferAmountUpdate",
      videoStopped: "videoStopped",
      videoStarted: "videoStarted",
      videoFF: "videoFF",
      videoRW: "videoRW",
      videoPaused: "videoPaused",
      videoResumed: "videoResumed",
      showPlayerControls: "showPlayerControls",
      hidePlayerControls: "hidePlayerControls",

      videoFFPressed: "videoFFPressed",
      videoRWPressed: "videoRWPressed",
      videoFFReleased: "videoFFReleased",
      videoRWReleased: "videoRWReleased",
      videoPausedPressed: "videoPausedPressed",
      videoResumedPressed: "videoResumedPressed",
      videoPlayPausedPressed: "videoPlayPausedPressed",
      
      displayVideoContentLoading: "displayVideoContentLoading",
      displayMainContentLoading: "displayMainContentLoading"
    })
  ;
})();