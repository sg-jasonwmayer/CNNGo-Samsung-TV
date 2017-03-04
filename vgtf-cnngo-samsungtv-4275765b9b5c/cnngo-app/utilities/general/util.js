'use strict';

/**
 * Utility service to make http requests and edits to the DOM.
 *
 * @class UtilService
 *
 * @param $http
 *
 * @ngInject
 */
function UtilService($http, $localStorage, uuid4, APP_CONSTANTS) {

    var exports = {};

    exports.asyncPost = asyncPost;
    exports.getJsonUrl = getJsonUrl;
    exports.getJsonUrlSync = getJsonUrlSync;
    exports.hide = hide;
    exports.show = show;
    exports.clearJsonp = clearJsonp;
    exports.hasClass = hasClass;
    exports.addClass = addClass;
    exports.removeClass = removeClass;
    exports.replacePattern = replacePattern;
    exports.getDeviceId = getDeviceId;
    exports.getCurrentPlatform = getCurrentPlatform;

    /**
     * Makes an async post request
     *
     * @param {String} url
     * @param {Object} data
     * @param {Function} onSuccess
     * @param {Function} onFail
     * @return {Promise}
     */
    function asyncPost(url, data, onSuccess, onFail) {
        $http.post(url, data).success(onSuccess).error(onFail);
    }

    /**
     * Makes an async get request
     *
     * @param {String} url
     * @param {Object} data
     * @param {Function} onSuccess
     * @param {Function} onFail
     * @return {Promise}
     *
     * @public
     */
    function getJsonUrl(url, onSuccess, onFail) {
        $http.get(url).success(onSuccess).error(onFail);
    }

    /**
     * Makes an async get request
     *
     * @param {String} url
     * @param {Function} onSuccess
     * @param {Function} onFail
     * @param {Object} xhr
     *
     * @public
     */
    function getJsonUrlSync(url, onSuccess, onFail, xhr) {
        // create the request
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.overrideMimeType("application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var status = parseInt(xhr.status);
                //var index = (0|xhr.status / 200);
                if (status < 400 && xhr.responseText != '') {
                    onSuccess(JSON.parse(xhr.responseText));
                } else {
                    onFail(status);
                }
            }
        };

        // now execute the request
        try {
            xhr.send();
        } catch (err) {
            onFail();
        }
    }

    /**
     * Hides an element with a classname
     *
     * @param {String} className The classname you want to hide
     *
     * @public
     */
    function hide(className) {
        document.getElementsByClassName(className)[0].style.display = 'none';
    }

    /**
     * Shows an element with a classname
     *
     * @param {String} className The classname you want to hide
     *
     * @public
     */
    function show(className) {
        document.getElementsByClassName(className)[0].style.display = 'block';
    }

    /**
     * Clears all jsonp tags on the document
     *
     * @param {Object} payload A response payload to null
     *
     * @public
     */
    function clearJsonp(payload) {
        setTimeout(function() {
            //Clear JSONP Nodes on DOM
            var script = document.getElementById('jsonp');
            while (script) {
                script.parentNode.removeChild(script);
                for (var prop in script) {
                    delete script[prop];
                }
            }

            //Null payload var
            if (payload) {
                payload = null;
            }

            //Garbage collect
            gc();

        }, 5000);
    }

    /**
     * Check if an element has a class
     *
     * @param {Object} element
     * @param {String} className
     * @return {Boolean} True if the element has the classname
     *
     * @public
     */
    function hasClass(element, className) {
        if (!element || !element.classList || !className) return false;
        return element.classList.contains(className)
    }

    /**
     * Adds a class to an element
     *
     * @param {Object} self An instance of UtilService
     * @param {Object} element
     * @param {String} className
     *
     * @public
     */
    function addClass(self, element, className) {
        // bad element or class, move on
        if (!element || !element.classList || !className) return;

        // check if class is already in existence
        if (self.hasClass(element, className)) return;

        // add class
        element.classList.add(className);
    }

    /**
     * Removes a class from an element
     *
     * @param {Object} self An instance of UtilService
     * @param {Object} element
     * @param {String} className
     *
     * @public
     */
    function removeClass(self, element, className) {
        if (element && className && self.hasClass(element, className))
            element.classList.remove(className)
    }

    /**
    * Replaces elements within a string with attribute values from the input options (opts).
    * Example pattern: 'http://{url}/{id}?debug={debug}'
    * var opts = {
    *   url: 'somesite.si/billy',
    *   id: 231,
    *   debug: false
    * }
    * Would result in this output: 'http://somesite.si/billy/231?debug=false'
    * 
    * @param {Object} opts An object with single value attributes to use in the pattern
    * @param {String} pattern A string pattern with areas to replace surrounded by {}.
    *
    * @return a string with the options applied to the pattern
    */
    function replacePattern(opts, pattern) {
        var newUrl = pattern;

        for (var key in opts) {
            newUrl = newUrl.replace(new RegExp('{' + key + '}', 'g'), opts[key]);
        }

        return newUrl;
    };

    function getDeviceId() {    
    if (!$localStorage.uniqueId) {
      $localStorage.uniqueId = uuid4.generate(); 
    }

    return $localStorage.uniqueId;
    }
    
    function getCurrentPlatform() {
        var userAgent = navigator.userAgent;
        var platform = null;
        console.log(userAgent);
        if (userAgent.indexOf("Tizen") != -1) {
            if (userAgent.indexOf("TV") != -1) {
                if (userAgent.indexOf("sdk") != -1) {
                    platform = APP_CONSTANTS.platform.emulator;
                } 
                else if(userAgent.indexOf("Tizen 2.3") != -1) {
                    platform = APP_CONSTANTS.platform.tizen2015;
                }
                else if(userAgent.indexOf("Tizen 2.4") != -1) {
                    platform = APP_CONSTANTS.platform.tizen2016;
                }
                else if(userAgent.indexOf("Tizen 3.0") != -1) {
                    platform = APP_CONSTANTS.platform.tizen2017;
                }
            } 
            else {
                console.log('This is Tizen but not TV');
            }
        }
        else {
            console.log('This is not a Tizen platform');
        }
        
        return platform;
    }

    return exports;
};

angular
    .module('app.utilities')
    .factory('UtilService', UtilService);


