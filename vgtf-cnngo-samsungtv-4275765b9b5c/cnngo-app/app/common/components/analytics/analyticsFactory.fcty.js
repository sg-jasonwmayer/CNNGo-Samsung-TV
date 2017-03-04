'use strict';

angular.module('analytics.factory', []).factory('analyticsFactory', analyticsFactory);

function analyticsFactory(ANALYTICS) {
  var exports = {}; 

  exports.sendPageEvent = sendPageEvent;
  exports.sendInteractionEvent = sendInteractionEvent;
  exports.sendVideoEvent = sendVideoEvent;
  
  
  function sendPageEvent(analyticsData) {
      s.contextData = {};
      
      Object.keys(analyticsData).forEach(function (key) {
          s.contextData[key] = analyticsData[key];
      });
      s.t();
  }
  
  function sendInteractionEvent(analyticsData) {
      s.contextData[ANALYTICS.variables.page] = analyticsData[ANALYTICS.variables.page];
      s.contextData[ANALYTICS.variables.section] = analyticsData[ANALYTICS.variables.section];
      s.contextData[ANALYTICS.variables.subsection] = analyticsData[ANALYTICS.variables.subsection];
      s.contextData[ANALYTICS.variables.appName] = analyticsData[ANALYTICS.variables.appName];
      s.contextData[ANALYTICS.variables.businessUnit] = analyticsData[ANALYTICS.variables.businessUnit];
      s.contextData[ANALYTICS.variables.codeVersion] = analyticsData[ANALYTICS.variables.codeVersion];
      s.contextData[ANALYTICS.variables.interactionEvent] = analyticsData[ANALYTICS.variables.interactionEvent];
      s.contextData[ANALYTICS.variables.interaction] = analyticsData[ANALYTICS.variables.interaction];
      s.contextData[ANALYTICS.variables.mvpd] = analyticsData[ANALYTICS.variables.mvpd];
      s.contextData[ANALYTICS.variables.adobeHashID] = analyticsData[ANALYTICS.variables.adobeHashID];
      s.linkTrackVars = analyticsData[ANALYTICS.variables.linkTrackVars];
      s.tl(true, "o", analyticsData[ANALYTICS.variables.interaction]);
  }
  
  function sendVideoEvent(analyticsData, videoEvent) {
      s.contextData = {};
      
      Object.keys(analyticsData).forEach(function (key) {
          s.contextData[key] = analyticsData[key];
      });
      s.linkTrackVars = analyticsData[ANALYTICS.variables.linkTrackVars];
      s.tl(true, "o", videoEvent);
  }
  
  return exports;
}
