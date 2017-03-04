(function() {
  'use strict';

  angular.module('appFilters', []).filter('duration', duration);

  function duration() {
    function filter(time) {
      // This case happens when duration is set to empty string due to the asset being a series or non-playable asset
      if(typeof time === 'undefined' || time === '') {
          return '';
      }

      var hours = Math.floor(time / 3600);
      var minutes = Math.floor((time - (hours * 3600))  / 60);
      var seconds = Math.floor(time - (minutes * 60));

      var _return = (hours > 0) ? hours + ":" : "";
          _return += convertTwoDigits(minutes, '0', 2) + ':' + convertTwoDigits(seconds, '0', 2);
      return _return;
    }

    // Grabbed this funtions off Stackoverflow. It beautifies the format
    function convertTwoDigits(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    return filter;
  }
})();
