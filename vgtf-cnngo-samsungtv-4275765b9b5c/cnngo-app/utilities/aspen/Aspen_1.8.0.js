 /* aspen - v1.8.0 - 2016-01-20 
 * Copyright (c) 2016 ASPEN 
 * Licensed  
 */ 
 (function () { 
//Only load Aspen once 
if (window.Aspen) { 
 return; 
} 
var VERSION = "1.8.0"; 
var debug = [window.location.search, window.location.hash].join().search(/\bdmtdebug\b/) !== -1; 
// Using jresig's Class implementation http://ejohn.org/blog/simple-javascript-inheritance/
var Class = (function(){var initializing=false, fnTest=/xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/; var Class = function(){}; Class.extend = function(prop) { var _super = this.prototype; initializing = true; var prototype = new this(); initializing = false; for (var name in prop) { prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){ return function() { var tmp = this._super; this._super = _super[name]; var ret = fn.apply(this, arguments); this._super = tmp; return ret; }; })(name, prop[name]) : prop[name]; } function Class() { if ( !initializing && this.init ) this.init.apply(this, arguments); } Class.prototype = prototype; Class.constructor = Class; Class.extend = arguments.callee; return Class;}; return Class;})();

/*yepnope1.0.2|WTFPL*/(function(a,b,c){function H(){var a=z;a.loader={load:G,i:0};return a}function G(a,b,c){var e=b=="c"?r:q;i=0,b=b||"j",u(a)?F(e,a,b,this.i++,d,c):(h.splice(this.i++,0,a),h.length==1&&E());return this}function F(a,c,d,g,j,l){function q(){!o&&A(n.readyState)&&(p.r=o=1,!i&&B(),n.onload=n.onreadystatechange=null,e(function(){m.removeChild(n)},0))}var n=b.createElement(a),o=0,p={t:d,s:c,e:l};n.src=n.data=c,!k&&(n.style.display="none"),n.width=n.height="0",a!="object"&&(n.type=d),n.onload=n.onreadystatechange=q,a=="img"?n.onerror=q:a=="script"&&(n.onerror=function(){p.e=p.r=1,E()}),h.splice(g,0,p),m.insertBefore(n,k?null:f),e(function(){o||(m.removeChild(n),p.r=p.e=o=1,B())},z.errorTimeout)}function E(){var a=h.shift();i=1,a?a.t?e(function(){a.t=="c"?D(a):C(a)},0):(a(),B()):i=0}function D(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(o||j)){var g=function(a){e(function(){if(!d)try{a.sheet.cssRules.length?(d=1,B()):g(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,e(function(){B()},0)):g(a)}},0)};g(c)}else c.onload=function(){d||(d=1,e(function(){B()},0))},a.e&&c.onload();e(function(){d||(d=1,B())},z.errorTimeout),!a.e&&f.parentNode.insertBefore(c,f)}function C(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&A(c.readyState)&&(d=1,B(),c.onload=c.onreadystatechange=null)},e(function(){d||(d=1,B())},z.errorTimeout),a.e?c.onload():f.parentNode.insertBefore(c,f)}function B(){var a=1,b=-1;while(h.length- ++b)if(h[b].s&&!(a=h[b].r))break;a&&E()}function A(a){return!a||a=="loaded"||a=="complete"}var d=b.documentElement,e=a.setTimeout,f=b.getElementsByTagName("script")[0],g={}.toString,h=[],i=0,j="MozAppearance"in d.style,k=j&&!!b.createRange().compareNode,l=j&&!k,m=k?d:f.parentNode,n=a.opera&&g.call(a.opera)=="[object Opera]",o="webkitAppearance"in d.style,p=o&&"async"in b.createElement("script"),q=j?"object":n||p?"img":"script",r=o?"img":q,s=Array.isArray||function(a){return g.call(a)=="[object Array]"},t=function(a){return Object(a)===a},u=function(a){return typeof a=="string"},v=function(a){return g.call(a)=="[object Function]"},w=[],x={},y,z;z=function(a){function h(a,b){function i(a){if(u(a))g(a,f,b,0,c);else if(t(a))for(h in a)a.hasOwnProperty(h)&&g(a[h],f,b,h,c)}var c=!!a.test,d=c?a.yep:a.nope,e=a.load||a.both,f=a.callback,h;i(d),i(e),a.complete&&b.load(a.complete)}function g(a,b,d,e,g){var h=f(a),i=h.autoCallback;if(!h.bypass){b&&(b=v(b)?b:b[a]||b[e]||b[a.split("/").pop().split("?")[0]]);if(h.instead)return h.instead(a,b,d,e,g);d.load(h.url,h.forceCSS||!h.forceJS&&/css$/.test(h.url)?"c":c,h.noexec),(v(b)||v(i))&&d.load(function(){H(),b&&b(h.origUrl,g,e),i&&i(h.origUrl,g,e)})}}function f(a){var b=a.split("!"),c=w.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=x[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=w[h](f);return f}var b,d,e=this.yepnope.loader;if(u(a))g(a,0,e,0);else if(s(a))for(b=0;b<a.length;b++)d=a[b],u(d)?g(d,0,e,0):s(d)?z(d):t(d)&&h(d,e);else t(a)&&h(a,e)},z.addPrefix=function(a,b){x[a]=b},z.addFilter=function(a){w.push(a)},z.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",y=function(){b.removeEventListener("DOMContentLoaded",y,0),b.readyState="complete"},0)),a.yepnope=H()})(this,this.document);

/**
 * Module to send a JSONP request
 */
var Ajax = {
  requestMap : {},
  jsonpRegistry : {},
  _counter : 0,

  request : function(obj) {
    var self = this;

    obj = Utils.extend({
      timeout : 5000,
      maxRetries : 0
    }, obj || {});
    obj.tries = 0;

    this._sendRequest(obj);
  },

  _sendRequest : function(obj) {
    var self = this;

    var requestId = this._createCallback(obj);
    var script = this._createScript(requestId);
    if (!script) {
      Utils.log("JSONP - unable to create script for request ", obj.url);
      return false;
    }

    // Send the request
    script.src = obj.url;

    if (obj.timeout) {
      setTimeout(function() {
        self._onError(requestId, obj);
      }, obj.timeout);
    }
  },

  /**
   * The request was successfully received
   * @param id The request id
   * @param obj The obj passed to the request
   * @param data The JSON response string
   */
  _onSuccess : function(id, obj, data) {
    if (!this.requestMap[id]) {
      return;
    }

    this._destroyRequest(id, obj);

    if (Utils.isString(data)) {
      data = eval('(' + data + ')');
    }

    if (obj.success) {
      obj.success(data);
    }
  },

  /**
   * The request was not received successfully
   * @param id The request id
   * @param obj The obj passed to the request
   */
  _onError : function(id, obj) {
    if (!this.requestMap[id]) {
      return;
    }

    this._destroyRequest(id, obj);

    // Retry the request if appropriate
    obj.tries++;
    if (obj.maxRetries && obj.tries < obj.maxRetries) {
      Utils.log("Request failed - resending");
      this._sendRequest(obj);
      return;
    }

    if (obj.error)
      obj.error(obj.url);
  },

  /**
   * Destroy all artifacts associated with the request
   */
  _destroyRequest : function(id, obj) {
    if (obj.jsonpCallback) {
      var registryEntry = this._removeNameFromRegistry(obj.jsonpCallback);
      if (!registryEntry) {
         // only delete function reference if we don't have something else using it
         try { 
            delete window[obj.jsonpCallback];
         } catch(e) { 
            window[obj.jsonpCallback] = undefined; 
         }
      }
    }
    
    delete this.requestMap[id];

    var script = document.getElementById(this._getScriptName(id));
    if (script) {
      script.parentNode.removeChild(script);
      script = null;
    }
  },

  /**
   * Create the script tag to be used for the request
   */
  _createScript : function(id) {
    var head = document.getElementsByTagName("head")[0];
    if (!head)
      return false;

    var script = document.createElement("script");
    script.type = 'text/javascript';
    if (id)
      script.id = this._getScriptName(id);

    head.appendChild(script);
    return script;
  },

  _getScriptName : function(id) {
    return "aspen_jsonp_" + id;
  },

  /**
   * Create the global callback hook for the request
   */
  _createCallback : function(obj) {
    var self = this;

    if (Utils.empty(obj.jsonpCallback)) {
      return null;
    }

    this._counter++;
    var id = "request_" + this._counter;
    this.requestMap[id] = function(data) {
      self._onSuccess(id, obj, data);
    };
    
    var registryEntry = this._addNameToRegistry(obj.jsonpCallback);

    // Keep the external and internal callbacks separate for now, for flexibility
    window[obj.jsonpCallback] = function(data) {
      self.requestMap[id](data);
    };
    return id;
  },
  
  _addNameToRegistry : function(name) {
    var registry = this.jsonpRegistry;
    if (registry[name]) {
      registry[name] += 1;
    } else {
      registry[name] = 1;
    }
    return registry[name];
  },
  
  _removeNameFromRegistry : function(name) {
    var registry = this.jsonpRegistry;
    if (registry[name]) {
      registry[name] -= 1;
      if (registry[name] === 0) {
        delete registry[name];
      }
    }
    return registry[name];
  }
};

// (function () {

// // Only load Aspen once
// if (window.Aspen) {
//     return;
// }

// var VERSION = "<%= pkg.version %>";

// var debug = [window.location.search, window.location.hash].join().search(/\bdmtdebug\b/) !== -1;

// //= require "vendor/Class"
// //= require "vendor/yesnope"
// //= require "utils"
// //= require "ajax"
// //= require "easyXDM"
// //= require "dependencies"
// //= require "globalVariables"
// //= require "transport"
// //= require "batch"
// //= require "core"

// }).call(this);

/**
 * Handles collecting messages into an array
 * to send to Aspen servers.
 */
var BatchService = Class.extend({

  init : function (config)
  {
        this._enabled = false;
    this._queue = [];
    this._config = config;
    this._timer;
    this._firstPostTimer;
  },

    start : function(config) {
        this._config = config;
        this._enabled = true;
        
        if (_analyticsConfig.batchMode == BATCH_MODE_TIMER)
    {
      Utils.log("[aspen]", "start timer");
      var _this = this;
      this._timer = setTimeout(function() { _this._postTimerEvent(); }, Number(_analyticsConfig.batchModeAmount) * 1000);

      var random = Math.ceil(Math.random() * Number(_analyticsConfig.batchModeAmount));
      if (random == Number(_analyticsConfig.batchModeAmount))
      {
        random--;
        if (random <= 0)
        {
          random = 0.5;
        }
      }
      Utils.log("[aspen]", "random time: " + random);
      this._firstPostTimer = setTimeout(function() { _this._firstPostTimerEvent(); }, random * 1000);
    }
    },
    
  add : function (message)
  {
        this._addToQueue( message );
    
        if (!this._enabled) {
           Utils.log("[aspen]", "Batch service not enabled. Queuing message."); 
           return;
        }
        
    if (_analyticsConfig.enabled && !this._config.batchThrottled)
    {
      if (_analyticsConfig.batchMode == BATCH_MODE_TOTAL)
      {
        if (this._queue.length == _analyticsConfig.batchModeAmount)
        {
          this.post();
        }
      }
      else if (_analyticsConfig.batchMode == BATCH_MODE_NONE)
      {
        this.post();
      }
      else if (_analyticsConfig.batchMode != BATCH_MODE_TIMER)
      {
        this.post();
      }

      // Flush the batch based on prioritized errors
      if (this._queue.length > 0)
      {
        if ((message["eventType"] == "error") && (typeof _analyticsConfig.highPriorityErrors != "undefined"))
        {
          this.flushByError(message["eventData"]);
        }
        else if ((message["eventType"] != "error") && (typeof _analyticsConfig.highPriorityEvents != "undefined"))
        {
          this.flushByEvent(message["eventType"]);
        }
      }
    }
    else
    {
      if (_analyticsConfig.enabled)
      {
        Utils.log("[aspen]", "Aspen is diabled via analyticsConfig. Message not added.");
      }
      if (this._config.batchThrottled)
      {
        Utils.log("[aspen]", "Batching is throttled. Message not added.");
      }
    }
  },

    _addToQueue : function(message) {
        Utils.log("[aspen]", "Adding message to batch queue.");
        // TODO max queue size?
        this._queue.push( message );
    },
    
  post : function ()
  {
    if (!this._config.postThrottled)
    {
      var data = {
        "sessionId" : this._config.sessionId,
        "events" : this._queue
      };

      // Send batch string
      Utils.log("[aspen]", "send batch string");
      
      if (_analyticsConfig.batchContentEncoding == "gzip")
      {
        var jsonString = "?aspenJson=" + JSON.stringify(data);
        var uriEncodedString = encodeURIComponent(jsonString).replace(/%20/g, "+");
        var gzipEncodedString = uriEncodedString;
        data = gzipEncodedString;
      }
      
      TransportManager.createRequest(_analyticsConfig.batchApi, data, this._postSuccess, this._postFailure, this);

      // Clear the batch
      this._queue = [];
    }
    else
    {
      Utils.log("[aspen]", "Batch posting is throttled. Batch not posted.");
    }
  },

  _postTimerEvent : function ()
  {
    Utils.log("[aspen]", "postTimer - queue.length: " + this._queue.length);
    if (this._queue.length > 0)
    {
      Utils.log("[aspen]", "posting " + this._queue.length + " messages");
      this.post();
    }
    else
    {
      Utils.log("[aspen]", "no messages to post");
    }

    var _this = this;
    this._timer = setTimeout(function() { _this._postTimerEvent(); }, Number(_analyticsConfig.batchModeAmount) * 1000);
  },

  _firstPostTimerEvent : function ()
  {
    Utils.log("[aspen]", "firstPostTimer - queue.length: " + this._queue.length);
    if (this._queue.length > 0)
    {
      Utils.log("[aspen]", "posting " + this._queue.length + " messages");
      this.post();
    }
    else
    {
      Utils.log("[aspen]", "no messages to post");
    }
  },

  _postSuccess : function (data)
  {
    Utils.log("[aspen]", "post success: " + data);
  },

  _postFailure : function (url)
  {
    Utils.log("[aspen]", "post failed: " + url);
  },

  flushByError : function (message)
  {
    if (typeof message.errorCode != "undefined")
    {
      var errorCode = message.errorCode;
      var errorCodeType = errorCode.substring(0,2);
      var errorCodeSub = errorCode.substring(2,4);
      var errorCodeLevel = errorCode.substring(4,6);
      var errorCodeNumber = errorCode.substring(6);

      var priorityArray = [];
      priorityArray = _analyticsConfig.highPriorityErrors.split(",");
      var typeStr = "";
      var subtypeStr = "";
      var levelStr = "";
      var codeNumberStr = "";

      var types = [];
      var subtypes = [];
      var levels = [];
      var codeNumbers = [];

      for (var i = 0, endi = priorityArray.length; i < endi; ++i)
      {
        switch (i)
        {
          case 0:
            typeStr = String(priorityArray[i]);
            types = typeStr.split("+");
            break;
          case 1:
            subtypeStr = String(priorityArray[i]);
            subtypes = subtypeStr.split("+");
            break;
          case 2:
            levelStr = String(priorityArray[i]);
            levels = levelStr.split("+");
            break;
          case 3:
            codeNumberStr = String(priorityArray[i]);
            codeNumbers = codeNumberStr.split("+");
            break;
        }
      }

      for (i = 0, endi = types.length; i < endi; ++i)
      {
        var type = String(types[i]);
        if ((errorCodeType == type) || (type == "*"))
        {
          for (var j = 0, endj = subtypes.length; j < endj; ++j)
          {
            var subtype = String(subtypes[j]);
            if ((errorCodeSub == subtype) || (subtype == "*"))
            {
              for (var k = 0, endk = levels.length; k < endk; ++k)
              {
                var level = String(levels[k]);
                if ((errorCodeLevel == level) || (level == "*"))
                {
                  for (var l = 0, endl = codeNumbers.length; l < endl; ++l)
                  {
                    var codeNumber = String(codeNumbers[l]);
                    if ((errorCodeNumber == codeNumber) || (codeNumber == "*"))
                    {
                      Utils.log("[aspen", "[flushByError] found match, flushing batch");
                      this.post();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  flushByEvent : function (messageType)
  {
    var priorityArray = _analyticsConfig.highPriorityEvents.split(",");

    for (var i = 0, endi = priorityArray.length; i < endi; ++i)
    {
      var type = String(priorityArray[i]);
      if (type == messageType)
      {
        Utils.log("[aspen]", "[flushBatchByEvent] found match, flushing batch");
        this.post();
      }
    }
  },

  setSessionId : function (id)
  {
    this._config.sessionId = id;
  },

  setBatchThrottled : function (throttle)
  {
    this._config.batchThrottled = throttle;
  },

  setPostThrottled : function (throttle)
  {
    this._config.postThrottled = throttle;
  },

  disableTimer : function ()
  {
    if (_analyticsConfig.batchMode == BATCH_MODE_TIMER)
    {
      clearTimeout(this._timer);
    }
  }
});


var LoadState = {
    WAITING : "loadStateWaiting",
    LOADING : "loadStateLoading",
    READY  : "loadStateReady",
    FAILED  : "loadStateFailed"
};

/**
 * Constructor for a new Aspen object.
 */
var Aspen = window.Aspen = {
    init : function (options, appInitCallback)
    {
        var self = this;

	if (Utils.undef(this.initialized))
	{
	    this.initialized = true;
	    this.ready = false;
	    this.batchService;
	    this._isThrottled = true;
	    this.sessionId = -1;
      this._messageExcludes = [];
	    this.timeDifference = 0;
	    this._shortId = "";
	    this._retryTimer;
	    this._retries = 0;
	    this._retryTime = 0;
	    this._savedSession = {};
	    this._timestampStr = "";
	    this.sessionToken = "";
	    this._appName = "";
	    this._transportFormats = [];
	    this._transportFormat = "";
	    this._transportFormatIndex = 0;
	    this._messageQueue = [];
        this.config = {}

	    this._loadState = LoadState.WAITING;
	    this._configUrl = "";
	    this._configLoaded = false;
	    this._appInitCallback = appInitCallback;

	    _params = this._options = options;
	    this._appName = _params.appName = _params && _params.appName;
	    _params.appVersion = _params && _params.appVersion;
	    _params.site = _params && _params.site;
	    _params.context = _params && _params.context;
	    _params.configBaseUrl = _params && _params.configBaseUrl;
	    _params.platform = _params && _params.platform;
	    _params.platformVersion = _params && _params.platformVersion;		

	    if (Utils.empty(_params.appName)){
	        Utils.log("[aspen]", "Unable to start Aspen, no appName provided");
	    } else if (Utils.empty(_params.site)){
	        Utils.log("[aspen]", "Unable to start Aspen, no site provided");
	    } else {
	        var batchConfig = {};
		batchConfig.batchThrottled = true;
		batchConfig.postThrottled = true;
		this.batchService = new BatchService(batchConfig);

		this._loadState = LoadState.LOADING;

		var manager = new DependencyManager();
		manager.add(new Dependency(Utils.bind( self._loadConfigFile, self )));
		manager.add(new Dependency(Utils.bind( self._loadRequiredJS, self )));
		manager.onComplete(Utils.bind( self._onDependenciesLoaded, self ));
		manager.onFailure(Utils.bind( self._onDependenciesLoadFailure, self ));
		manager.load();
	    }
        }
    },

    _loadConfigFile : function(success, failure) {
    	var basePath = _params.configBaseUrl;
    	if (Utils.isNull(basePath))
    		basePath = ANALYTICS_BASE_URL + _params.appName + "/" + _params.site + "/";
        Utils.log("[aspen]", "Using config base path: " + basePath);
        this._configUrl =  basePath + ANALYTICS_FILE + "?_=" + Utils.timeBucket(15);

        Ajax.request({
            jsonpCallback: 'aspen_onAnalyticsConfigReceived',
            url: this._configUrl,
            success: Utils.bind( this._loadConfigSuccess, this, success ),
            error: Utils.bind( this._loadConfigFailure, this, failure )
        });
    },

  _loadConfigSuccess : function(cb, data)
  {
        Utils.log("[aspen]", "Config loaded successfully");
    
    // parse the config
    _analyticsConfig = Utils.extend( Utils.extend( {}, data['default'] || {} ), data[_params.context] || {} );

    this.config = _analyticsConfig;
    if (Utils.undef(_analyticsConfig.batchMode))
    {
      _analyticsConfig.batchMode = "total";
    }

    if (Utils.undef(_analyticsConfig.batchModeAmount))
    {
      _analyticsConfig.batchModeAmount = "10";
    }

    if (Utils.undef(_analyticsConfig.helloRetryCount))
    {
      _analyticsConfig.helloRetryCount = "5";
    }

    if (Utils.undef(_analyticsConfig.helloRetryTime))
    {
      _analyticsConfig.helloRetryTime = "10000";
    }

    if (Utils.undef(_analyticsConfig.batchContentEncoding))
    {
      _analyticsConfig.batchContentEncoding = "json";
    }
    if (Utils.undef(_analyticsConfig.aspenUserIdEnabled))
    {
      _analyticsConfig.aspenUserIdEnabled = true;
    }

    if (Utils.undef(_analyticsConfig.aspenUserIdHash))
    {
      _analyticsConfig.aspenUserIdHash = "392aspenUID392";
    }

    
    if (Utils.undef(_analyticsConfig.transportFormats))
    {
      this._transportFormats.push(TransportFormat.JSONP);
    }
    else
    {
      this._transportFormats = _analyticsConfig.transportFormats.split(",");
    }
    this._transportFormat = this._transportFormats[this._transportFormatIndex];
    
    if (Utils.undef(_analyticsConfig.messageExcludes))
    {
      this._messageExcludes = [];
    }
    else
    {
      this._messageExcludes = _analyticsConfig.messageExcludes.split(",");
    }
    
    var tmConfig = {};
    tmConfig.transportFormats = this._transportFormats;
    tmConfig.servicesUrl = _analyticsConfig.servicesUrl;
    TransportManager.init(tmConfig);

    Utils.log("[aspen]", "batchMode: ", _analyticsConfig.batchMode);
    Utils.log("[aspen]", "batchModeAmount: ", _analyticsConfig.batchModeAmount);
    Utils.log("[aspen]", "helloRetryCount: ", _analyticsConfig.helloRetryCount);
    Utils.log("[aspen]", "helloRetryTime: ", _analyticsConfig.helloRetryTime);
    Utils.log("[aspen]", "transportFormat: ", this._transportFormat);
        
        cb && cb();
  },

  _loadConfigFailure : function(cb, url)
  {
    Utils.log("[aspen]", "Config failed to load", url);
        cb && cb();
  },

    _loadRequiredJS : function(success, failure) {
        var self = this;
        
        if (window.JSON != null) {
            this._loadRequiredJSSuccess(success);
        } else {
            yepnope({
                load: 'http://z.cdn.turner.com/xslo/cvp/easyxdm/js/json2.ugly.js',
                complete: function () {
                    if (!window.JSON) {
                        self._loadRequiredJSFailure(failure);
                        return;
                    }
                    self._loadRequiredJSSuccess(success);
                }
            });
        }
        
    },
    
    _loadRequiredJSSuccess : function(cb) {
        Utils.log("[aspen]", "External JS dependencies loaded successfully");
        cb && cb();
    },
    
    _loadRequiredJSFailure : function(cb) {
        Utils.log("[aspen]", "External JS dependencies failed to load");
        cb && cb();
    },
    
    _onDependenciesLoaded : function() {
        this._loadState = LoadState.READY;
         Utils.log("[aspen]", "_onDependenciesLoaded - all required dependencies successfully loaded.");
         
         // make the hello call
    if (!Utils.undef(_analyticsConfig.enabled) && _analyticsConfig.enabled === 'true')
    {
      Utils.log("[aspen]", "analytics enabled via config");
      if (!Utils.undef(_analyticsConfig.servicesUrl)) {
        this._hello();
      }
    }
    else
    {
      Utils.log("[aspen]", "analytics disabled via config");
      this._initFailure();
    }
    },
    
    _onDependenciesLoadFailure : function() {
        this._loadState = LoadState.FAILED;
        Utils.log("[aspen]", "_onDependenciesLoadFailure - one or more required dependencies failed to load.");
    },
    
    _hello : function ()
    {
	Utils.log("[aspen]", "hello");
	var querySessionToken = Utils.getQueryVar("sessionToken");
	Utils.log("[aspen]", "check querySessionToken: ", querySessionToken);
	if (!Utils.empty(querySessionToken))
	{
	    this.sessionToken = querySessionToken;
	    this.send("authSessionReload", {});
	}
	else{}

	var data = {
	    propertyName: _params.site,
	    applicationName: _params.appName,
	    applicationVersion: _params.appVersion,
      deviceType: "Javascript",
      deviceModel: "Javascript",
      deviceVersion: "Javascript",
	    library: "Javascript",
	    libraryVersion: VERSION,
	    platformName: !Utils.empty(_params.platform) ? _params.platform : "Javascript",
	    platformVersion: !Utils.empty(_params.platformVersion) ? _params.platformVersion : VERSION,
	    aspenConfigUrl: this._configUrl,
	    protocol: "1.0",
      pageUrl: document.URL
	};
  //Overwrite any values that are passed in
  data = Utils.extend(data,this._options);

  if (_analyticsConfig.aspenUserIdEnabled) {
      data.aspenUUIDToken = _analyticsConfig.aspenUserIdHash;
  }

	if (!Utils.empty(this.sessionToken))
	{
	    data.sessionToken = this.sessionToken;
	}

	TransportManager.bootstrapTM();
	TransportManager.createRequest(_analyticsConfig.helloApi, data, this._helloSuccess, this._helloFailure, this);

	this._retryTimer = setTimeout(Utils.bind( this._helloRetry, this ), Number(_analyticsConfig.helloRetryTime));
	this._isRetrying = true;
    },
   
  /**
   * config param = JSON data
   *  "throttled": <boolean value either "yes" or "no">,
   *  "sessionId": <128-bit server-generated session ID, not included in response when throttled == "yes">,
   *  "timestamp": <server-side timestamp, specified in seconds since the epoch>
   */
    _helloSuccess : function (config)
    {
	Utils.log("[aspen]", "_helloSuccess");

	clearTimeout(this._retryTimer);
	this._isThrottled = (typeof config.throttled !== 'undefined') && (config.throttled !== 'no') || this._isThrottled;
	this.sessionId = (typeof config.sessionId !== 'undefined') ? config.sessionId : this.sessionId;
	this._shortId = (typeof config.shortId !== 'undefined') ? config.shortId : this._shortId;
	this._timestampStr = (typeof config.timestamp !== 'undefined') ? config.timestamp : this.timeDifference;
	this.timeDifference = Number(this._timestampStr) - Utils.now();

	if (config.throttled === "no")
	{
	    this._isThrottled = false;
	}

	Utils.log("[aspen]", "_helloSuccess");
	Utils.log("[aspen]", "config.throttled: " + config.throttled);
	Utils.log("[aspen]", "throttled: " + this._isThrottled);
	Utils.log("[aspen]", "sessionId: " + this.sessionId);
		
	var batchConfig = {};
	batchConfig.batchThrottled = false;
	batchConfig.postThrottled = true;
	batchConfig.sessionId = "";
	this.batchService.start(batchConfig);

	this.batchService.setSessionId(this.sessionId);
	this.batchService.setPostThrottled(this._isThrottled);

	this._initSuccess();
    },

  _helloFailure : function (url)
  {
    Utils.log("[aspen]", "_helloFailure url: " + url);
    
    
    if (TransportManager.fallback())
    {
      this._hello();
    }
  },

  _helloRetry : function ()
  {
    Utils.log("[aspen]", "helloRetry");
    if (this._retries == _analyticsConfig.helloRetryCount)
    {
      Utils.log("[aspen]", "retries exhasted");
      clearTimeout(this._retryTimer);
      this._retries = 0;
    
      if (TransportManager.fallback() == true)
      {
        this._hello();
      }
      else
      {
        Utils.log("[aspen]", "retries exhasted, fallbacks exhausted, aspen is disabled");
        this._isThrottled = true;
        this.batchService.setBatchThrottled(true);
        this.batchService.setPostThrottled(true);
        this.batchService.disableTimer();
      }
    }
    else
    {
      this._retries++;
      this._retryTime = this._retries * Number(_analyticsConfig.helloRetryTime);
      this._savedSession.retries = String(this._retries);
      this._savedSession.retryTime = String(this._retryTime);
      this._hello();
    }
  },

  isMessageExcluded : function (message)
  {
    if (_analyticsConfig && _analyticsConfig.messageExcludes)
    {
      if (_analyticsConfig.messageExcludes.indexOf(message) >= 0)
      {
        return true;
      }
    }

    return false;
  },

    send : function (type, message, appName)
    {
        if (this._messageExcludes.indexOf(type) != -1){
            return;
        }
        if (typeof message == "undefined"){
            message = {};
        }
        if (!this.ready) {
            Utils.log("[aspen]", "send - Aspen's not ready, queuing message");
            this._messageQueue.push({
                message : message,
                type : type,
                appName : appName
            });
            return;
        }

	if (!this._isThrottled)
	{
	    if (this.isMessageExcluded(type))
	    {
	  	Utils.log("[aspen]", "message excluded by config, not added to batch", type);
		return;
	    }

	    message["timestamp"] = Utils.now() + this.timeDifference;
      message["applicationName"] = typeof appName !== 'undefined' ? appName : this._appName;
      // Reserved keywords
      delete message['session_id']
      delete message['sessionId']
      delete message['hbase_timestamp']
      delete message['type']
	    Utils.log("[aspen]", "appName: " + message["applicationName"]);

	    var batchObj = {};
	    batchObj["eventType"] = type;
	    batchObj["eventData"] = message;

	    Utils.log("[aspen]", "add to batch json message: " + JSON.stringify(batchObj));

	    this.batchService.add(batchObj);
	}
	else
	{
	    Utils.log("[aspen]", "Add message to batch is throttled! Message not added.");
	}
    },
	
    setSessionToken : function (token)
    {
	this.sessionToken = token;
    },

    _initSuccess : function ()
    {
        this.ready = true;

        for (var i=0, len = this._messageQueue.length; i < len; i++) {
            this.send(this._messageQueue[i].type, this._messageQueue[i].message);
        }

	this.send("aspenConfigDetails", _analyticsConfig)

	var message = {};
	message.screenWidth = screen.width;
	message.screenHeight = screen.height;
	message.browserName = navigator.appName;
	message.userAgent = navigator.userAgent;
	message.platform = navigator.platform;
	this.send("systemInfo", message);

	this._initSuccess = function () {};  // only allow init once
		
	this._appInitCallback && this._appInitCallback();
    },

    _initFailure : function ()
    {

    }, 
	
    getVersion : function()
    {
	return VERSION;	
    },
	
    getSessionId : function(appName)
    {
	return this.sessionId;	
    },
	
    getShortId : function(appName)
    {
	return this._shortId;	
    },
	
    isThrottled : function(appName)
    {
	return this._isThrottled;	
    },

    getThrottled : function(appName)
    {
	return this._isThrottled ? "yes" : "no";	
    }

};

/**
 * Simple and Stupid Dependency Management
 * All dependencies are loaded simultaneously,
 * and all are treated as required.
 *
 * TODO consolidate with HTML5 D.M.
 */
var DependencyManager = function() {
    this._dependencies = [];
    this._loadedCount = 0;
    this._successHandlers = [];
    this._failureHandlers = [];
    
    // Add a dependency
    this.add = function(dependency) {
        this._dependencies.push({
            dependency : dependency,
            success : false
        });
        
        var index = this._dependencies.length - 1;
        dependency.onComplete(Utils.bind(this._onDependencyLoaded, this, index, true));
        dependency.onFailure(Utils.bind(this._onDependencyLoaded, this, index, false));
    };
    
    // Load all dependencies - async loading
    this.load = function() {
        for (var i=0, len = this._dependencies.length; i < len; i++) {
            this._dependencies[i].dependency.load();
        }
    };
    
    // Add Success, Failure handlers - fired when all dependencies are loaded
    this.onComplete = function(func) {
        this._successHandlers.push(func);
    };
    this.onFailure = function(func) {
        this._failureHandlers.push(func);
    };
    
    // Individual dependency loaded
    this._onDependencyLoaded = function(index, success) {
        ++this._loadedCount;
        this._dependencies[index].success = success;
        
        if (this._loadedCount === this._dependencies.length) {
            this._onAllDependenciesLoaded();
        }
    };
    
    // All dependencies loaded
    this._onAllDependenciesLoaded = function() {
        this._loadedCount = 0;
        
        var success = true;
        // Determine success/failure
        for (var i=0, len = this._dependencies.length; i < len; i++) {
            if (!this._dependencies[i].success) {
                success = false;
                break;
            }
        }
        
        // Call the appropriate handlers
        var handlers = (success) ? this._successHandlers : this._failureHandlers;
        for (i=0, len = handlers.length; i < len; i++) {
            handlers[i]();
        }
    };
};

var Dependency = function(func) {
    this._func = func;
    this._successHandlers = [];
    this._failureHandlers = [];
    
    // Execute the dependency, pass in success, failure CBs as the last two params
    this.load = function() {
        this._func(
            Utils.bind(this._onSuccess, this),
            Utils.bind(this._onFailure, this)
        );
    };
    
    // Add Success, Failure handlers
    this.onComplete = function(func) {
        this._successHandlers.push(func);
    };
    this.onFailure = function(func) {
        this._failureHandlers.push(func);
    };
    
    // Dependency loaded successfully, failed
    this._onSuccess = function() {
        for (var i=0, len = this._successHandlers.length; i < len; i++) {
            this._successHandlers[i]();
        }
    };
    this._onFailure = function() {
         for (var i=0, len = this._failureHandlers.length; i < len; i++) {
            this._failureHandlers[i]();
        }
    };
};

var AspenComm = (function () {
  // required: window.CVPAux.easyXDM
  var
    REMOTE = "http://aspen.turner.com"
    , xhr
    , init
    , inited = false
    , queue = []
    , dequeue
    , request
    , queue_request
    , make_request
  ;

  init = function (remote) {
    Utils.log("[aspen]", "[easyXDM]", "init", remote);
    REMOTE = remote;
    xhr = new window.CVPAux.easyXDM.Rpc(
      {
        swf: "http://z.cdn.turner.com/xslo/cvp/easyxdm/swf/easyxdm.swf"
        , remote: REMOTE + "/static/xdm_iframe.html"
      },
      {
        remote: {
          request: {}
        }
      }
    );

    Utils.log("[aspen]", "[easyXDM]", "init AspenComm");

    inited = true;
    init = function () { try { throw "already init'ed - ignored"; } catch(e) { /* FOR IE */ } };
    dequeue();
  };

  request = function (config, succ, fail) {
    if (inited) {
      make_request(config, succ, fail);
    } else {
      queue_request(config, succ, fail);
    }
  };

  queue_request = function () {
    queue.push(arguments);
  };

  dequeue = function () {
    var i = 0, endi = queue.length;
    for (; i < endi; ++i) {
      make_request.apply(null, queue[i]);
    }
  };

  /**
    request(object config, function successFn, function errorFn)
    config:
      url {string} - The url to request
      method {string} - GET or POST. Default POST
      headers {object} - A map of headers to apply - the defaults are "Content-Type": "application/x-www-form-urlencoded" and "X-Requested-With": "XMLHttpRequest". Set headers are added to the default, null values removed.
      timeout {number} - the number of milliseconds before a timeout occurs. Default 10000 (10 seconds)
      data {object} - a map of the data to pass
    successFn:
      data {string} - the responseText
      status {number} - The status of the request
      headers {object} - a map of the returned headers
    errorFn:
      data {string} - the responseText if available, or null
      status {number} - The status of the request
      message {string} - A friendly message explaining the error
   */
  make_request = function (options, succ, fail) {
    Utils.log("[aspen]", "[easyXDM]", "make request", options);

    var config, successFn, errorFn;

    config = Utils.extend(
      Utils.extend(
        {
          method: 'POST'
        }
        , options || {}
      )
/*
      , {
        url: options.url
          ? options.url.charAt(0) === '/'
            ? REMOTE + (options.url)
            : options.url
          : REMOTE + '/api/batch'
      }
 */
    );

    successFn = function (response) {
      var json = response.data;

      if (typeof json === 'string' && json.charAt(0).match(/[{[]/)) {
        try {
          json = JSON.parse(json);
        } catch (e) {
          Utils.log(e);
        }
      }

      Utils.log("[aspen]", "[easyXDM]", "request success", response);

      succ(json, response.status, response.headers);
    };

    errorFn = function (response) {
      var json = response.data;

      if (typeof json === 'string' && json.charAt(0).match(/[{[]/)) {
        try {
          json = JSON.parse(json);
        } catch (e) {
          Utils.log(e);
        }
      }

      fail(json, response.status, response.message);
    };

    xhr.request(config, successFn, errorFn);
  };

  return ({
    init: init
    , request: request
  });

}());

var bootstrap = function (fn) {
  Utils.log("[aspen]", "[easyXDM]", "bootstrap", fn);
  window.CVPAux = window.CVPAux || {};
  yepnope({
    test: window.CVPAux.easyXDM != null,
    nope: 'http://z.cdn.turner.com/xslo/cvp/easyxdm/js/easyXDM.ugly.js',
    complete: function () {
      if (!window.easyXDM) {
        try { throw 'failed to install easyXDM'; } catch(e) { /* FOR IE8 */ }
      } else {
        window.CVPAux.easyXDM = easyXDM.noConflict('CVPAux');
        yepnope({
          test: window.JSON != null,
          nope: 'http://z.cdn.turner.com/xslo/cvp/easyxdm/js/json2.ugly.js',
          complete: function () {
            if (!window.JSON) {
              try { throw 'failed to install JSON polyfill'; } catch(e) { /* FOR IE8 */ }
            }
            fn();
          }
        });
      }
    }
  });
};

var ANALYTICS_BASE_URL = "http://z.cdn.turner.com/xslo/aspen/config/";
var ANALYTICS_FILE = "aspenanalytics.json";

var BATCH_MODE_TOTAL = "total";
var BATCH_MODE_TIMER = "timer";
var BATCH_MODE_NONE = "none";

// global vars
var _params = {};
var _analyticsConfig = {};

/**
 * Abstracts the selection of the transport format.
 *
 **/
 
var TransportFormat = {
  JSON : "json",
  JSONP : "jsonp"
};
 
 var TransportManager = {
  
  init : function (config)
  {
    this._config = config;
    this._transportFormat = this._config.transportFormats[0];
    this._bootstrapped = false;
  },
  
  bootstrapTM : function ()
  {
    Utils.log("[aspen]", "TransportManager", "bootstrap", "_bootstrapped:", this._bootstrapped);
    if (this._transportFormat === TransportFormat.JSON) // use easyXDM
    {
      if (!this._bootstrapped)
      {
        var servicesUrl = this._config.servicesUrl
        bootstrap(function () 
        {
          AspenComm.init(servicesUrl);
        });
        
        this._bootstrapped = true;
        Utils.log("[aspen]", "TransportManager", "bootstrap", "transportFormat", this._transportFormat);
      }
    }
  },
  
  createRequest : function (request, data, success, failure, scope)
  {
    Utils.log("[aspen]", "TransportManager", "createRequest");
    if (this._transportFormat === TransportFormat.JSON) //use easyXDM
    {
      AspenComm.request(
        {
          url: request + "." + this._transportFormat,
          data: {
            aspenJson: JSON.stringify(data)
          }
        },
        Utils.bind( success, scope ),
        Utils.bind( failure, scope )
      );
    }
    else if (this._transportFormat === TransportFormat.JSONP)
    {
            var jsonpUrl = this._config.servicesUrl + request + "." + this._transportFormat;
            jsonpUrl += '?aspen_callback=parseAspenInitialization&aspenJson=' + encodeURIComponent( JSON.stringify(data) ).replace( /%20/g, '+' );

      Ajax.request({
        jsonpCallback: 'parseAspenInitialization',
        url: jsonpUrl,
        error: Utils.bind( failure, scope ),
        success: Utils.bind( success, scope )
      });
    }
  },
  
  fallback : function ()
  {
    Utils.log("[aspen]", "current transport format failed", this._transportFormat);
    
    this._config.transportFormats.shift();
    
    if (this._config.transportFormats.length > 0)
    {
      this._transportFormat = this._config.transportFormats[0];
      Utils.log("trying next transport format", this._transportFormat);
      return true;
    }
    else
    {
      return false;
    }
  }
 
 };

// Basic Utils
/**
 * An object containing miscellaneous utility functions and
 * variables.
 * @class An object containing miscellaneous utility functions
 * and variables.
 */
 // TODO consolidate these with the CVP.Utils
var Utils =
{
  /**
   * Tests to determine if the obj parameter is undefined.
   * @param {Object} obj The object to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  undef : function(obj) {
    return typeof obj === "undefined";
  },

  /**
   * Tests to determine if the obj parameter is null.
   * @param {Object} obj The object to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  isNull : function(obj) {
    return Utils.undef(obj) || obj === null;
  },

  /**
   * Tests to determine if the str param is an empty String.
   * @param {String} str The String to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  empty : function(str) {
    return Utils.undef(str) || Utils.isNull(str) || str === "";
  },

  /**
   * Tests to determine if the parameter's type is 'function'.
   * @param {Object} f The object to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  isFunc : function(f) {
    return typeof f === "function";
  },

  /**
   * Tests to determine if the parameter's type is 'object'.
   * @param {Object} obj The object to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  isObject : function(obj) {
    return typeof obj === "object";
  },

  /**
   * Tests to determine if the parameter's type is 'string'.
   * @param {Object} obj The object to test.
   * @returns The Boolean result: true or false.
   * @type Boolean.
   */
  isString : function(obj) {
    return typeof obj === "string";
  },

  /**
   * extend.
   * @param {Object} target
   * @param {Object} source
   * @returns The target object.
   * @type Object
   */
  extend : function (target, source) {
    var p;
    if (!target) target = {};
    for (p in source) {
      target[p] = source[p];
    }
    return target;
  },

  /**
   * Prints log message to the console.
   * @description Prints each param in the console.
   * @param {String} message
   * @returns
   * @type
   */
  log : function()
  {
    if (window.console
      && window.console.log
      && debug)
    {
      window.console.log(Utils.slice(arguments).join(" | "));
    }

    if (!Utils.undef(window.logJSAuth) &&
      Utils.isFunc(window.logJSAuth) &&
      debug)
    {
      window.logJSpAuth(Utils.slice(arguments).join(" | "));
    }
  },

  /**
   * Returns the current time.
   * @returns The current time in milliseconds.
   * @type int.
   */
  now : (typeof Date.now === "function" ? Date.now : function () { return (new Date()).getTime(); }),

  /**
   * Performs the slice function on the passed array.
   * @param {Array} arr The array to slice.
   * @param {int} index The array's index to start the slice.
   * @returns The resulting array after it has been sliced at the
   * passed index.
   * @type Array
   */
  slice : function(arr, index) {
    return Array.prototype.slice.call(arr, index || 0);
  },

  /**
   * bind.
   * @param {Function} func
   * @param {String} scope
   * @param {Object} args
   * @returns
   * @type
   */
  bind : function(func, scope) {
    var args = Utils.slice(arguments, 2);
    return function() {
      var a = args.concat(Utils.slice(arguments));
      return func.apply(scope, a);
    };
  },


  /**
   * Sets a browser cookie.
   * @param {String} c_name The name of the cookie.
   * @param {String} c_value The value of the cookie.
   * @param {Number} exdays The time until the cookie expires.
   */
  setCookie : function(c_name, value, exdays)
  {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);

    var c_value = escape(value) + ((exdays == null) ? "" : "; expires="+exdate.toUTCString());

    document.cookie = c_name + "=" + c_value;
  },

  /**
   * Retrives and returns a browser cookie value.
   * @param {String} c_name The name of the cookie.
   * @returns The value of the cookie.
   * @type String.
   */
  getCookie : function(c_name)
  {
    var i,x,y,ARRcookies=document.cookie.split(";");

    for (i=0;i<ARRcookies.length;i++)
    {
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");

      if (x==c_name)
      {
        return unescape(y);
      }
    }
  },

  /**
   * Parses and returns the query value.
   * @param {String} variable The query string var to return.
   * @returns The value of the query var.
   * @type String.
   */
  getQueryVar : function (variable)
  {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++)
    {
      var pair = vars[i].split("=");
      if (pair[0] == variable)
      {
        return pair[1];
      }
    }
  },

  /**
   * Returns random string.
   * @param {int} length Number of characters.
   * @returns random string of length length.
   * @type String
   */
  randomString : function(length)
  {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length)
    {
      length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++)
    {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }, 
	
  /**
   * Return a time bucket based on current time and bucket size. Useful for cachebusting params so
   * we're not cache busting per millisecond.
   * @returns a time bucket.
   * @type int.
   */
  timeBucket : function(bucket) 
  {
    var curDate = new Date();
    var currentTimeInMinutes = (curDate.getDate() * 24 + curDate.getHours()) * 60 + curDate.getMinutes();
    return Math.round(currentTimeInMinutes / bucket);	
  }
};

}).call(this);