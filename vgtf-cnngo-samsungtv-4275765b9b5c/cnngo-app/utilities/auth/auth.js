(function() {
    'use strict';

    angular
    .module('app.utilities')
    .service('Auth', authService);

    /* @ngInject */
    function authService(SystemMonitor, FreePreview, ENV, ANALYTICS) {
        // ### Crypto
        var Crypto = (function () {
        /*
        CryptoJS v3.1.2
        code.google.com/p/crypto-js
        (c) 2009-2013 by Jeff Mott. All rights reserved.
        code.google.com/p/crypto-js/wiki/License
        */

        // rollups/hmac-sha1.js
        var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
        p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
        32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
        2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
        r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
        a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
        d)).finalize(b)}}});var s=e.algo={};return e}(Math);
        (function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
        g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
        (function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
        this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();

        // components/enc-base64-min.js
        (function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
        e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

        // components/md5-min.js
        (function(E){function h(a,f,g,j,p,h,k){a=a+(f&g|~f&j)+p+k;return(a<<h|a>>>32-h)+f}function k(a,f,g,j,p,h,k){a=a+(f&j|g&~j)+p+k;return(a<<h|a>>>32-h)+f}function l(a,f,g,j,h,k,l){a=a+(f^g^j)+h+l;return(a<<k|a>>>32-k)+f}function n(a,f,g,j,h,k,l){a=a+(g^(f|~j))+h+l;return(a<<k|a>>>32-k)+f}for(var r=CryptoJS,q=r.lib,F=q.WordArray,s=q.Hasher,q=r.algo,a=[],t=0;64>t;t++)a[t]=4294967296*E.abs(E.sin(t+1))|0;q=q.MD5=s.extend({_doReset:function(){this._hash=new F.init([1732584193,4023233417,2562383102,271733878])},
        _doProcessBlock:function(m,f){for(var g=0;16>g;g++){var j=f+g,p=m[j];m[j]=(p<<8|p>>>24)&16711935|(p<<24|p>>>8)&4278255360}var g=this._hash.words,j=m[f+0],p=m[f+1],q=m[f+2],r=m[f+3],s=m[f+4],t=m[f+5],u=m[f+6],v=m[f+7],w=m[f+8],x=m[f+9],y=m[f+10],z=m[f+11],A=m[f+12],B=m[f+13],C=m[f+14],D=m[f+15],b=g[0],c=g[1],d=g[2],e=g[3],b=h(b,c,d,e,j,7,a[0]),e=h(e,b,c,d,p,12,a[1]),d=h(d,e,b,c,q,17,a[2]),c=h(c,d,e,b,r,22,a[3]),b=h(b,c,d,e,s,7,a[4]),e=h(e,b,c,d,t,12,a[5]),d=h(d,e,b,c,u,17,a[6]),c=h(c,d,e,b,v,22,a[7]),
        b=h(b,c,d,e,w,7,a[8]),e=h(e,b,c,d,x,12,a[9]),d=h(d,e,b,c,y,17,a[10]),c=h(c,d,e,b,z,22,a[11]),b=h(b,c,d,e,A,7,a[12]),e=h(e,b,c,d,B,12,a[13]),d=h(d,e,b,c,C,17,a[14]),c=h(c,d,e,b,D,22,a[15]),b=k(b,c,d,e,p,5,a[16]),e=k(e,b,c,d,u,9,a[17]),d=k(d,e,b,c,z,14,a[18]),c=k(c,d,e,b,j,20,a[19]),b=k(b,c,d,e,t,5,a[20]),e=k(e,b,c,d,y,9,a[21]),d=k(d,e,b,c,D,14,a[22]),c=k(c,d,e,b,s,20,a[23]),b=k(b,c,d,e,x,5,a[24]),e=k(e,b,c,d,C,9,a[25]),d=k(d,e,b,c,r,14,a[26]),c=k(c,d,e,b,w,20,a[27]),b=k(b,c,d,e,B,5,a[28]),e=k(e,b,
        c,d,q,9,a[29]),d=k(d,e,b,c,v,14,a[30]),c=k(c,d,e,b,A,20,a[31]),b=l(b,c,d,e,t,4,a[32]),e=l(e,b,c,d,w,11,a[33]),d=l(d,e,b,c,z,16,a[34]),c=l(c,d,e,b,C,23,a[35]),b=l(b,c,d,e,p,4,a[36]),e=l(e,b,c,d,s,11,a[37]),d=l(d,e,b,c,v,16,a[38]),c=l(c,d,e,b,y,23,a[39]),b=l(b,c,d,e,B,4,a[40]),e=l(e,b,c,d,j,11,a[41]),d=l(d,e,b,c,r,16,a[42]),c=l(c,d,e,b,u,23,a[43]),b=l(b,c,d,e,x,4,a[44]),e=l(e,b,c,d,A,11,a[45]),d=l(d,e,b,c,D,16,a[46]),c=l(c,d,e,b,q,23,a[47]),b=n(b,c,d,e,j,6,a[48]),e=n(e,b,c,d,v,10,a[49]),d=n(d,e,b,c,
        C,15,a[50]),c=n(c,d,e,b,t,21,a[51]),b=n(b,c,d,e,A,6,a[52]),e=n(e,b,c,d,r,10,a[53]),d=n(d,e,b,c,y,15,a[54]),c=n(c,d,e,b,p,21,a[55]),b=n(b,c,d,e,w,6,a[56]),e=n(e,b,c,d,D,10,a[57]),d=n(d,e,b,c,u,15,a[58]),c=n(c,d,e,b,B,21,a[59]),b=n(b,c,d,e,s,6,a[60]),e=n(e,b,c,d,z,10,a[61]),d=n(d,e,b,c,q,15,a[62]),c=n(c,d,e,b,x,21,a[63]);g[0]=g[0]+b|0;g[1]=g[1]+c|0;g[2]=g[2]+d|0;g[3]=g[3]+e|0},_doFinalize:function(){var a=this._data,f=a.words,g=8*this._nDataBytes,j=8*a.sigBytes;f[j>>>5]|=128<<24-j%32;var h=E.floor(g/
        4294967296);f[(j+64>>>9<<4)+15]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;f[(j+64>>>9<<4)+14]=(g<<8|g>>>24)&16711935|(g<<24|g>>>8)&4278255360;a.sigBytes=4*(f.length+1);this._process();a=this._hash;f=a.words;for(g=0;4>g;g++)j=f[g],f[g]=(j<<8|j>>>24)&16711935|(j<<24|j>>>8)&4278255360;return a},clone:function(){var a=s.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=s._createHelper(q);r.HmacMD5=s._createHmacHelper(q)})(Math);


        /*!
          Copyright (c) 2010 Robert Kieffer
          Dual licensed under the MIT and GPL licenses.
          */
        // Source: http://www.broofa.com/Tools/Math.uuid.js

        function getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        function getHMACSHA1Hash(msg, key) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(msg, key));
        }

        function MD5(msg) {
            return CryptoJS.MD5(msg).toString();
        }

        function getMD5Hash(msg) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(msg));
        }

        function utf8ToBase64(msg) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(msg));
        }

        function base64ToUtf8(msg) {
            return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(msg));
        }


        // exports.getUUID = getUUID;
        // exports.getHMACSHA1Hash = getHMACSHA1Hash;
        // exports.MD5 = MD5;
        // exports.getMD5Hash = getMD5Hash;
        // exports.utf8ToBase64 = utf8ToBase64;
        // exports.base64ToUtf8 = base64ToUtf8;

        return ({
            getUUID: getUUID,
            getHMACSHA1Hash: getHMACSHA1Hash,
            MD5: MD5,
            getMD5Hash: getMD5Hash,
            utf8ToBase64: utf8ToBase64,
            base64ToUtf8: base64ToUtf8
        });

        }());

        // ### Logger
        //
        // Facade to console.

        var logger = console;

        // ### request
        //
        // Usage:
        //     request({ url, method, type, data, headers });


        var request = (function () {

            /* globals _, logger */

            'use strict';

            var XHR = XMLHttpRequest;
            var parser = new DOMParser();

            var DONE = 4;
            var GET = 'GET';
            var POST = 'POST';
            var CONTENT_TYPE_HEADER = 'Content-Type';
            var REQUESTED_WITH_HEADER = 'X-Requested-With';
            var ACCEPT_HEADER = 'Accept';
            var USER_AGENT = 'XMLHttpRequest';
            var URL_ENCODED = 'application/x-www-form-urlencoded';

            var QUERY_SPACES = /%20/g;
            var QUERY_SPACE_REPLACEMENT = '+';


            var urlRegex = /^((([^:\/?#]+):)?(?:\/\/(([^\/?#]*)(?::(\d+))?))?)(([^?#]*\/)([^\/?#]*)?)(\?([^#]*))?(#(.*))?$/;
            function parseUrl(url) {
                var match = urlRegex.exec(url);

                if (match) {
                    return {
                        href     : match[0]  || '',
                        origin   : match[1]  || '',
                        protocol : match[2]  || '',
                        scheme   : match[3]  || '',
                        host     : match[4]  || '',
                        hostname : match[5]  || '',
                        port     : match[6]  || '',
                        pathname : match[7]  || '',
                        dir      : match[8]  || '',
                        file     : match[9]  || '',
                        search   : match[10] || '',
                        query    : match[11] || '',
                        hash     : match[12] || '',
                        anchor   : match[13] || ''
                    };
                }
            }

            var allQueryParamsRegex = /([^?&=]+)(?:=([^&=]+))?/g;
            var decode = decodeURIComponent;
            function parseQueryString(queryString) {
                var queryObject = {};
                queryString.replace(allQueryParamsRegex, function ($0, $1, $2/*, offset, string*/) {
                    queryObject[$1] = $2 ? decode($2) : '';
                    return $0;
                });
                return queryObject;
            }

            var encode = encodeURIComponent;
            function toQueryKeyValueString(value, key/*, list*/) {
                return (encode(key) + (value !== '' ? '=' + encode(_.isObject(value) ? JSON.stringify(value) : value) : '') );
            }

            function encodeParams(obj) {
                var queryArray = _.map(obj, toQueryKeyValueString);

                return queryArray.join('&');
            }

            function toQueryString(hash) {
                var params = encodeParams(hash);

                var queryString = params ? '?' + params : '';

                return queryString;
            }

            function augmentQueryString(url, data) {
                var urlParts = parseUrl(url);
                var queryParts = parseQueryString(urlParts.query);

                queryParts = _.extend({}, queryParts, data);

                var queryString = toQueryString(queryParts);

                return urlParts.origin + urlParts.pathname + queryString + urlParts.hash;
            }


            function processDataObject(obj) {
                if (!obj) {
                    return null;
                }

                var data = obj;

                if (_.isObject(data)) {
                    data = encodeParams(data);
                }

                return data.replace(QUERY_SPACES, QUERY_SPACE_REPLACEMENT);
            }

            // opts.url
            // opts.method
            // opts.type
            // opts.data (object of key/values that are encoded and concat'ed)
            // opts.headers

            // An option to abort?

            // successful response = data  (could be xml, could be json)
            // failure = { status, headers, responseText, response }

            var defaultHeaders = {};
            // NOTE: commenting out in case this was causing a CORS issue
            // defaultHeaders[REQUESTED_WITH_HEADER] = USER_AGENT;

            var acceptHeaderMap = {
                'js'   : 'application/javascript, text/javascript',
                'json' : 'application/json, text/javascript',
                'xml'  : 'application/xml, text/xml',
                'html' : 'text/html',
                'text' : 'text/plain',
                '*'    : 'text/javascript, text/html, application/xml, text/xml, */*'
            };

            // var fileExtensionRegExp = /\.(js(?:onp?)?|(?:ht|x)ml)$/i;
            //
            // function determineTypeFromUrl(url) {
            // 	var urlParts = Url.parse(url);
            // 	var match = fileExtensionRegExp.exec(urlParts.pathname);
            // 	return match ? match[1].toLowerCase() : '';
            // }

            function isSuccessful(xhr) {
                return (200 <= xhr.status && xhr.status < 300) || xhr.status === 304;
            }

            var HEADER_VALUE_DELIM = ':';

            function splitOnce(string, delim) {
                var index = string.indexOf(delim);
                if (index === -1) {
                    return [];
                }
                var head = string.substring(0, index).trim();
                var tail = string.substring(index + 1).trim();
                return [head, tail];
            }

            function responseHeaderIteratee(memo, entry/*, index, list*/) {
                if (entry) {
                    var array = splitOnce(entry, HEADER_VALUE_DELIM);
                    if (array.length) {
                        var name = array[0].toLowerCase();
                        var value = array[1];
                        memo[name] = value;
                    }
                }
                return memo;
            }

            function parseResponseHeaders(xhr) {
                var array = xhr.getAllResponseHeaders().trim().split('\r\n');
                return _.reduce(array, responseHeaderIteratee, {});
            }


            var jsonType = /\bjson\b/;
            var jsType = /\bjavascript\b/;
            var xmlType = /\bxml\b/;

            function determineResponseType(headers) {
                var contentType = headers[CONTENT_TYPE_HEADER.toLowerCase()];
                if (contentType) {
                    if (jsonType.test(contentType)) {
                        return 'json';
                    }
                    if (jsType.test(contentType)) {
                        return 'js';
                    }
                    if (xmlType.test(contentType)) {
                        return 'xml';
                    }
                }
            }

            function getResponse(xhr) {
                var response = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    headers: parseResponseHeaders(xhr)
                };

                return response;
            }


            var uniqId = 0;
            var callbackParamRegex = /([^?&]+)=\?(?=&|$)/;

            function createCallbackName(reqId) {
                return 'cvp_jsonp_' + reqId + '_' + Date.now();
            }

            function determineCallbackParam(url) {
                var match = callbackParamRegex.exec(url);
                if (match) {
                    return match[1];
                }
            }

            function handleJsonp(opts, callback) {
                var callbackParam = opts.jsonpParam || determineCallbackParam(opts.url);
                var callbackName = opts.jsonpCallback || createCallbackName(++uniqId);
                var tag = 'script';
                var loaded = false;
                var first = document.getElementsByTagName(tag)[0];
                var script = document.createElement(tag);
                var timer;
                var defaultTimeout = 15000;
                var timeout = opts.timeout || defaultTimeout;

                function teardown() {
                    window.clearTimeout(timer);
                    script.onload = script.onerror = null;
                    script.parentElement.removeChild(script);
                    first = script = null;
                    delete window[callbackName];
                }

                function success(data) {
                    callback(null, data);
                }

                function failure(err) {
                    callback(err, null);
                }

                function complete() {
                    teardown();
                }

                function onLoadSuccess(event) {
                    if (loaded) return;
                    loaded = true;
                    complete();
                }

                function onLoadFailure(event) {
                    if (loaded) return;
                    loaded = true;
                    failure('failed to successfully request ' + opts.url);
                    complete();
                }

                function onTimeout() {
                    if (loaded) return;
                    loaded = true;
                    failure('request for ' + opts.url + ' timed out after ' + timeout + ' ms');
                }

                if (callbackParam) {  // not required for static JSONP; only useful for dynamically-served JSONP
                    opts.data[callbackParam] = callbackName;
                }

                if (opts.cache === false) {
                    opts.data._ = Date.now();
                }

                if (callbackName in window) {
                    logger.warn('Multiple JSONP requests are being made to the same callback function name!');
                }

                window[callbackName] = success;
                timer = window.setTimeout(onTimeout, timeout);

                script.onload = onLoadSuccess;
                script.onerror = onLoadFailure;
                script.src = augmentQueryString(opts.url, opts.data);

                first.parentNode.insertBefore(script, first);
            }

            // callback(err, data, response)
            function request(opts, callback) {

                if (!opts || !_.isObject(opts)) {
                    throw new Error('An object param is required.');
                }

                if (!callback || !_.isFunction(callback)) {
                    throw new Error('A callback param is required.');
                }

                // Sanitize & validate input.

                if (!opts.url) {
                    throw new Error('A "url" property is required.');
                }

                if (opts.type === 'jsonp') {
                    return handleJsonp(opts, callback);
                }

                var url = opts.url;
                var method = (opts.method || GET).toUpperCase();
                // var type = (opts.type || determineTypeFromUrl(url)).toLowerCase();
                var type = (opts.type || '').toLowerCase();
                var data = opts.data || null;
                var headers = opts.headers || {};
                var _aborted = false;

                var suggestedHeaders = _.extend({}, defaultHeaders);

                // Suggest an Accept header based on given `type` or infer from URL (extension).
                // NOTE: commenting out in case it was blocking simple CORS
                suggestedHeaders[ACCEPT_HEADER] = acceptHeaderMap[type] || acceptHeaderMap['*'];

                headers = _.defaults(headers, suggestedHeaders);

                logger.log('requesting ' + method + ' ' + type + ' ' + url);

                var xhr = new XHR();

                if (!xhr) {
                    throw new Error('Failed to create instance of XMLHttpRequest!');
                }

                function abort() {
                    if (!_aborted) {
                        _aborted = true;
                        xhr.abort();
                    }
                }

                // XHR response:
                // response
                // responseText
                // responseType
                // responseURL
                // responseXML
                // status
                // statusText

                function success(res) {
                    /* jshint validthis: true, evil: true */
                    var resType = type || determineResponseType(res.headers);
                    var data;

                    logger.log('request - success', res.status, url);

                    switch (resType) {
                      case 'json':
                        try {
                            data = JSON.parse(this.responseText);
                        } catch (e) {
                            logger.error('request - failure to parse JSON', e.message);
                            // TODO - how to respond?  request was successful but response was faulty
                        }
                        break;
                      case 'js':
                        eval(this.responseText);
                        break;
                      case 'xml':
                        if (this.responseXML) {
                            data = this.responseXML;
                        }
                        else {
                            try {
                                data = parser.parseFromString(this.responseText, 'application/xml');
                            } catch (e) {
                                logger.error('request - failure to parse XML', e.message);
                                // TODO - how to respond?
                            }
                        }
                        break;
                      default:
                        data = this.responseText;
                    }

                    callback(null, data, res);
                }

                function failure(res) {
                    /* jshint validthis: true */
                    logger.log('request - failure', res.status, url);

                    callback(res.status, null, res);
                }

                function handleReadyStateChange(/*event*/) {
                    /* jshint validthis: true */
                    // logger.log('readyState change', this.readyState, ' : ', url);

                    if (this.readyState === DONE) {
                        var response = getResponse(this);
                        response.url = url;

                        if (isSuccessful(this) && !_aborted) {
                            success.call(this, response);
                        }
                        else {
                            failure.call(this, response);
                        }
                    }
                }

                if (method === POST) {
                    headers[CONTENT_TYPE_HEADER] = URL_ENCODED;
                }
                else {
                    url = augmentQueryString(url, data);
                    data = null;
                }

                data = processDataObject(data);

                xhr.open(method, url, true);

                // var withCredentials = false;

                for (var name in headers) {
                    if (!_.has(headers, name)) { continue; }
                    // if (name.toLowerCase().indexOf('auth') === 0) { withCredentials = true; }
                    xhr.setRequestHeader(name, headers[name]);
                }

                // if (withCredentials) {
                    // xhr.withCredentials = true;
                // }

                xhr.onreadystatechange = handleReadyStateChange;

                xhr.send(data);

                return ({
                    abort: abort
                });
            }


            return request;

        }());

        // ### Store
        //
        // Options for saving to localStorage or sessionStorage.

        var Store = (function () {

            /* globals logger */

            'use strict';

            var context = window;

            var localStorageImpl = {

                _testKey : '__testlocalstorage__',
                _ready : undefined,

                _hasLocalStorage : function () {
                    try {
                        return 'localStorage' in context && context.localStorage !== null;
                    } catch (e) {
                        logger.error('No localStorage!', e.message);
                        return false;
                    }
                },

                _testLocalStorage : function () {
                    try {
                        this._setItem(this._testKey, this._testKey);
                    } catch (e) {
                        logger.error('Failed to set localStorage', e.message);
                        return false;
                    }
                    if (this._getItem(this._testKey) !== this._testKey) {
                        return false;
                    }
                    this._removeItem(this._testKey);
                    return true;
                },

                _isValid : function () {
                    if (this._ready === undefined) {
                        this._ready = this._hasLocalStorage() && this._testLocalStorage();
                    }
                    return this._ready;
                },

                _wrap : function (fn, args) {
                    if (this._isValid()) {
                        return fn.apply(this, args);
                    }
                    else {
                        logger.warn('Unable to access localStorage.');
                    }
                },

                _setItem : function (key, value) {
                    return context.localStorage.setItem(key, value);
                },
                _getItem : function (key) {
                    return context.localStorage.getItem(key);
                },
                _removeItem : function (key) {
                    return context.localStorage.removeItem(key);
                },

                setItem : function (/*key, value*/) {
                    return this._wrap(this._setItem, arguments);
                },
                getItem : function (/*key*/) {
                    return this._wrap(this._getItem, arguments);
                },
                removeItem : function (/*key*/) {
                    return this._wrap(this._removeItem, arguments);
                }

            };

            var sessionStorageImpl = {

                _testKey : '__testsessionstorage__',
                _ready : undefined,

                _hasSessionStorage : function () {
                    try {
                        return 'sessionStorage' in context && context.sessionStorage !== null;
                    } catch (e) {
                        logger.error('No sessionStorage!', e.message);
                        return false;
                    }
                },

                _testSessionStorage : function () {
                    try {
                        this._setItem(this._testKey, this._testKey);
                    } catch (e) {
                        logger.error('Failed to set sessionStorage', e.message);
                        return false;
                    }
                    if (this._getItem(this._testKey) !== this._testKey) {
                        return false;
                    }
                    this._removeItem(this._testKey);
                    return true;
                },

                _isValid : function () {
                    if (this._ready === undefined) {
                        this._ready = this._hasSessionStorage() && this._testSessionStorage();
                    }
                    return this._ready;
                },

                _wrap : function (fn, args) {
                    if (this._isValid()) {
                        return fn.apply(this, args);
                    }
                    else {
                        logger.warn('Unable to access sessionStorage.');
                    }
                },

                // throws exception when using Private mode in iOS Safari
                _setItem : function (key, value) {
                    return context.sessionStorage.setItem(key, value);
                },
                _getItem : function (key) {
                    return context.sessionStorage.getItem(key);
                },
                _removeItem : function (key) {
                    return context.sessionStorage.removeItem(key);
                },

                setItem : function (/*key, value*/) {
                    return this._wrap(this._setItem, arguments);
                },
                getItem : function (/*key*/) {
                    return this._wrap(this._getItem, arguments);
                },
                removeItem : function (/*key*/) {
                    return this._wrap(this._removeItem, arguments);
                }

            };

            var StoreData = (function () {

                function StoreData(value, options) {
                    this.value = value;
                    this.timeStamp = options && options.timeStamp || Date.now();
                    if (options && options.expires) {
                        this.expires = options.expires;
                    }
                }

                StoreData.parse = function parse(input) {
                    switch (typeof input) {
                      case 'string':
                        try {
                            return parse(JSON.parse(input));
                        }
                        catch (e) {
                            logger.error('Failed to parse JSON from StoreData', e.message);
                            return null;
                        }
                      case 'object':
                        if ('data' in input && 'meta' in input) {
                            return new StoreData(input.data, input.meta);
                        }
                        else {
                            return null;
                        }
                      default: return null;
                    }
                };

                StoreData.prototype.toObject = function toObject() {
                    var obj = {};

                    obj.data = this.value;
                    obj.meta = {
                        timeStamp: this.timeStamp
                    };

                    if (this.expires) {
                        obj.meta.expires = this.expires;
                    }

                    return obj;
                };

                StoreData.prototype.stringify = function stringify() {
                    var string;

                    try {
                        string = JSON.stringify(this.toObject());
                    }
                    catch (e) {
                        logger.error('Failed to stringify JSON from StoreData', e.message);
                        string = null;
                    }

                    return string;
                };

                StoreData.prototype.isExpired = function isExpired() {
                    return this.expires && Date.now() > this.expires;
                };

                return StoreData;

            }());

            function setItem(key, value, options) {
                /* jshint validthis:true */

                this.removeItem(key);

                if (value === null || value === undefined) {
                    logger.log('[Store:setItem] No value to save for key "' + key + '"');
                    return true;
                }

                var data = new StoreData(value, options);

                if (data.isExpired()) {
                    logger.log('[Store:setItem] Item of key "' + key + '" has expired and will not be stored.');
                    return true;
                }

                var string = data.stringify();

                if (string === null) {
                    logger.debug('[Store:setItem] Item of key "' + key + '" could not be stringified and will not be stored.');
                    return false;
                }

                try {
                    this.setItem(key, string);
                    return true;
                }
                catch (e) {
                    logger.warn('[Store:setItem] Item of key "' + key + '" could not be stored: ', e);
                    return false;
                }
            }

            function getItem(key) {
                /* jshint validthis:true */

                var string;

                try {
                    string = this.getItem(key);
                }
                catch (e) {
                    logger.warn('[Store:getItem] Item of key "' + key + '" could not be retrieved: ', e);
                    return false;
                }

                if (string === null) {
                    logger.log('[Store:getItem] Item of key "' + key + '" did not return a value.');
                    return null;
                }

                var data = StoreData.parse(string);

                if (!data) {
                    logger.debug('[Store:getItem] Item of key "' + key + '" could not be parsed and will not be retrieved.');
                    return false;
                }

                if (data.isExpired()) {
                    logger.log('[Store:getItem] Item of key "' + key + '" has expired and will not be retrieved.');
                    this.removeItem(key);
                    return null;
                }

                return data.value;
            }

            function removeItem(key) {
                /* jshint validthis:true */

                try {
                    this.removeItem(key);
                    return true;
                }
                catch (e) {
                    logger.warn('[Store:removeItem] Item of key "' + key + '" could not be removed: ', e);
                    return false;
                }
            }


            return ({
                set: function (/*key, value, options*/) {
                    return setItem.apply(localStorageImpl, arguments);
                },
                get: function (/*key*/) {
                    return getItem.apply(localStorageImpl, arguments);
                },
                remove: function (/*key*/) {
                    return removeItem.apply(localStorageImpl, arguments);
                },
                clear: function () {
                    try {
                        return !!window.localStorage.clear();
                    }
                    catch (e) {
                        logger.error('Failed to clear localStorage!', e.message);
                        return false;
                    }
                },

                setSession: function (/*key, value, options*/) {
                    return setItem.apply(sessionStorageImpl, arguments);
                },
                getSession: function (/*key*/) {
                    return getItem.apply(sessionStorageImpl, arguments);
                },
                removeSession: function (/*key*/) {
                    return removeItem.apply(sessionStorageImpl, arguments);
                },
                clearSession: function () {
                    try {
                        return !!window.sessionStorage.clear();
                    }
                    catch (e) {
                        logger.error('Failed to clear sessionStorage!', e.message);
                        return false;
                    }
                }
            });

        }());


        // ## Adobe AccessEnabler
        //
        // Facade to Adobe communication.
        //
        // Error schema: { status: Integer, message: String, (details: String)? }


        var AccessEnabler = (function () {

            /* globals logger, Crypto, request, _ */

            'use strict';

            var PROD_SERVICE_ORIGIN = 'https://api.auth.adobe.com';
            var STAGING_SERVICE_ORIGIN = 'https://api.auth-staging.adobe.com';
            var STAGING = 'staging';
            var DEFAULT_REGCODE_TTL = 1800;
            var MIN_REGCODE_TTL = 600;
            var MAX_REGCODE_TTL = 36000;

            var serviceOrigin = '';
            var publicKey = '';
            var secretKey = '';

            var POST = 'POST';
            var GET = 'GET';
            var DELETE = 'DELETE';
            var AUTH_DELIM = ', ';

            var NO_DATA_ERROR = 'No data';
            var INVALID_DATA_ERROR = 'Invalid data';

            var inited = false;
            var requestorId = '';
            var appVersion = '';
            var registrationUrl = '';
            var regcodeLifespan = DEFAULT_REGCODE_TTL;
            var addDeviceIdParams = {};


            function toInt(num) {
                return parseInt(num, 10);
            }

            function isReady() {
                return inited;
            }


            // ## init(opts, callback)
            //
            // - opts = Object
            //   - logLevel: ALL | LOG | DEBUG | INFO | WARN | ERROR | NONE  [WARN]
            //   - serviceOrigin: 'http://api.url'      [https://api.auth.adobe.com]
            //   - vendorEnv: 'prod' | 'staging'        [prod]
            //   - configEnv: 'prod' | 'preprod'        [prod]
            //   - requestorId: 'Adobe requestorId'     [CNN]
            //   - publicKey: 'apigee.com public key'   []
            //   - secretKey: 'apigee.com private key'  []
            //   - deviceId: 'unique device ID'         [random-generated UUID]
            //
            // - callback = Function
            //   - executed after init is successful or fails
            //
            // TODO - explore option of requesting deviceId from Adobe; it could be returned via callback
            //
            function init(opts, callback) {
                try {
                    if (inited) {
                        throw new Error('init() was already called!');
                    }

                    serviceOrigin = opts.serviceOrigin || (opts.vendorEnv === STAGING ? STAGING_SERVICE_ORIGIN : PROD_SERVICE_ORIGIN);

                    appVersion = opts.appVersion;
                    registrationUrl = opts.registrationUrl;

                    var suggestedLifespan = toInt(opts.regcodeLifespan);
                    regcodeLifespan = suggestedLifespan && !isNaN(suggestedLifespan) && Math.min(Math.max(suggestedLifespan, MIN_REGCODE_TTL), MAX_REGCODE_TTL) || DEFAULT_REGCODE_TTL;

                    requestorId = opts.requestorId;
                    publicKey = opts.publicKey;
                    secretKey = opts.secretKey;

                    if (!(requestorId || publicKey || secretKey)) {
                        throw new Error('"requestorId", "publicKey", "secretKey" properties are required for init({})');
                    }

                    var deviceId = opts.deviceId;

                    // Augment `addDeviceIdParams` with params to be sent with any call that requires `deviceId`.
                    addDeviceIdParams.deviceId = Crypto.MD5(deviceId);
                    addDeviceIdParams.deviceType = opts.deviceType;

                    if (opts.appId) {
                        addDeviceIdParams.appId = opts.appId;
                    }
                    if (opts.deviceUser) {
                        addDeviceIdParams.deviceUser = opts.deviceUser;
                    }

                    // Disallow further init()s.
                    inited = true;

                    return callback(null);
                }
                catch (e) {
                    logger.error('Failed to init!', e.stack);
                    return callback(e);
                }
            }

            function createAuthHeader(verb, path) {
                var parts = [
                    'requestor_id=' + requestorId,
                    'nonce=' + Crypto.getUUID(),
                    'signature_method=HMAC-SHA1',
                    'request_time=' + Date.now(),
                    'request_uri=' + path
                ];

                var header = verb + ' ' + parts.join(AUTH_DELIM);

                var signature = Crypto.getHMACSHA1Hash(header, secretKey);

                return [
                    header,
                    'public_key=' + publicKey,
                    'signature=' + signature
                ].join(AUTH_DELIM);
            }

            function call(opts, callback) {
                // path: API path
                // method: (GET|POST)
                // data: (object)
                // type: (json|xml)
                // headers: (in case?)
                var reqOpts = {
                    url: serviceOrigin + opts.path,
                    method: opts.method || GET,
                    data: opts.data,
                    type: opts.type || 'json',
                    headers: opts.headers || {}
                };

                var authHeader = createAuthHeader(reqOpts.method, opts.path);

                reqOpts.headers = _.defaults(reqOpts.headers, {
                    'Authorization': authHeader
                });

                return request(reqOpts, callback);
            }


            // ## getRegCode(callback)
            //
            // Success Response:
            // - Headers:
            //     HTTP/1.1 201 Created
            // - Body:
            //     {
            //     	"id": "22fe236f-5a57198b-8ef1-4594-83ec-7bc19583ce95",
            //     	"code": "NGT3Y2A",
            //     	"requestor": "CNN",
            //     	"generated": 1410213977946,
            //     	"expires": 1410215777946,
            //     	"info": {
            //     		"deviceId": "OGM2NmEzZTIxMWQyMWFmOTA1NWE4ZjQyMTcyMmMwYTc=",
            //     		"deviceType": null,
            //     		"deviceUser": null,
            //     		"appId": null,
            //     		"appVersion": null,
            //     		"registrationURL": null
            //     	}
            //     }
            //
            // Failure Response - Too many requests?:
            // - Headers:
            //     	HTTP/1.1 503 Service Unavailable: Back-end server is at capacity
            // - Body:
            //
            // Failure Response:
            // - Headers:
            // - Body:
            //
            function getRegCode(callback) {
                logger.log('getRegCode');
                var params = {};

                if (appVersion) {
                    params.appVersion = appVersion;
                }
                if (registrationUrl) {
                    params.registrationURL = registrationUrl;
                }
                if (regcodeLifespan) {
                    params.ttl = regcodeLifespan;
                }

                return call({
                    method: POST,
                    path: '/reggie/v1/' + encodeURI(requestorId) + '/regcode',
                    data: _.defaults(params, addDeviceIdParams)
                }, function onAdobeGetRegCodeResponse(err, data, res) {
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var normalizedData = {
                                regCode: data.code,
                                regUrl: data.info.registrationURL,
                                expires: toInt(data.expires)
                            };
                            data = normalizedData;
                        }
                        catch (e) {
                            logger.error('Failed to parse getRegCode data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }

                    // Log response.
                    if (err) {
                        logger.error('getRegCode error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('getRegCode success:', JSON.stringify(data));
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }


            // ## validateRegCode(regCode, callback)
            //
            // Success Response:
            // - Headers:
            //     HTTP/1.1 200 OK
            // - Body:
            //     {
            //     	"id": "22fe236f-5a57198b-8ef1-4594-83ec-7bc19583ce95",
            //     	"code": "NGT3Y2A",
            //     	"requestor": "CNN",
            //     	"generated": 1410213977946,
            //     	"expires": 1410215777946,
            //     	"info": {
            //     		"deviceId": "OGM2NmEzZTIxMWQyMWFmOTA1NWE4ZjQyMTcyMmMwYTc=",
            //     		"deviceType": null,
            //     		"deviceUser": null,
            //     		"appId": null,
            //     		"appVersion": null,
            //     		"registrationURL": null
            //     	}
            //     }
            //
            // Failure Response:
            // - Headers:
            // - Body:
            //
            function validateRegCode(regCode, callback) {
                return call({
                    method: GET,
                    path: '/reggie/v1/' + encodeURI(requestorId) + '/regcode/' + encodeURI(regCode)
                }, callback);
            }


            // ## clearRegCode(regCode, callback)
            //
            // Success Response:
            // - Headers:
            //     	HTTP/1.1 204 No Content
            //
            // Failure Response:
            // - Headers:
            // - Body:
            //
            function clearRegCode(regCode, callback) {
                return call({
                    method: DELETE,
                    path: '/reggie/v1/' + encodeURI(requestorId) + '/regcode/' + encodeURI(regCode)
                }, callback);
            }


            var convertAdobeXmlToMvpdConfigObject = (function () {

                function addTo(obj, name, value) {
                    if (_.isUndefined(obj[name])) {
                        obj[name] = value;
                    } else {
                        if (!_.isArray(obj[name])) {
                            obj[name] = [].concat(obj[name]);
                        }
                        obj[name].push(value);
                    }
                    return obj;
                }

                function iteratee(memo, child/*, i, list*/) {
                    // return addTo(memo, child.tagName, (child.childNodes.length ? xml2json(child) : child.textContent));
                    return addTo(memo, child.tagName, child.textContent);
                }

                function xml2json(element) {
                    if (element) {
                        return _.reduce(element.childNodes, iteratee, {});
                    }
                    return {};
                }

                // Source: https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets
                // Evaluate an XPath expression aExpression against a given DOM node
                // or Document object (aNode), returning the results as an array
                // thanks wanderingstan at morethanwarm dot mail dot com for the
                // initial work.
                function evaluateXPath(aNode, aExpr) {
                    var xpe = new XPathEvaluator();
                    var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
                                                          aNode.documentElement : aNode.ownerDocument.documentElement);
                                                          var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
                                                          var found = [];
                                                          var res;
                                                          while (res = result.iterateNext())
                                                              found.push(res);
                                                          return found;
                }


                return function (xml) {
                    var result = [];

                    if (xml) {
                        logger.log('convertAdobeXmlToMvpdConfigObject: converting Adobe config to mvpd JS object');

                        // DOM methods consistently take more than 8ms
                        // var mvpds = xml.rootElement.getElementByTagName('requestor').getElementByTagName('mvpds').getElementsByTagName('mvpd');
                        // var mvpds = xml.rootElement.getElementByTagName('mvpds').getElementsByTagName('mvpd');
                        // XPath methods consistently take less than 8ms, but timing varies, so no one is faster.
                        // var mvpds = xml.evaluateXPath('/*[local-name()="config"]/requestor/mvpds/mvpd');
                        // var mvpds = xml.evaluateXPath('//requestor/mvpds/mvpd');
                        // var mvpds = xml.evaluateXPath('//mvpds/mvpd');
                        // var mvpds = xml.evaluateXPath('//mvpd');
                        var mvpds = evaluateXPath(xml, '//requestor[1]/mvpds[1]/mvpd');

                        if (!mvpds || !mvpds.length) {
                            logger.error('convertAdobeXmlToMvpdConfigObject: failed to find "mvpd" nodes');
                        }
                        else {
                            logger.log('convertAdobeXmlToMvpdConfigObject: found ' + mvpds.length + ' "mvpd" nodes');
                            result = _.map(mvpds, xml2json);
                        }
                    }

                    return result;
                };

            }());

            // ## getMvpdList(callback)
            //
            // Success Response:
            // - Headers:
            //     	HTTP/1.1 200 OK
            // - Body:
            //     <ns2:config xmlns:ns2="http://pass.adobe.com/config">
            //     	[...]
            //     	<requestor>
            //     		<id>CNN</id>
            //     		<name>CNN</name>
            //     		<domains>[...]</domains>
            //     		<channels>[...]</channels>
            //     		<mvpds>
            //     			<mvpd>
            //     				<id>mvpdId</id>
            //     				<displayName>MVPD Name</displayName>
            //     				<logoUrl>MVPD Logo URL</logoUrl>
            //     				<foregroundLogout>true</foregroundLogout>
            //     				<iFrameRequired>true</iFrameRequired>
            //     				<iFrameWidth>600</iFrameWidth>
            //     				<iFrameHeight>500</iFrameHeight>
            //     				<isProxy>true</isProxy>
            //     			</mvpd>
            //     		</mvpds>
            //     	</requestor>
            //     </ns2:config>
            //
            // Failure Response - Too many requests?:
            // - Headers:
            //     	HTTP/1.1 503 Service Unavailable: Back-end server is at capacity
            //
            function getMvpdList(callback) {
                return request({
                    method: GET,
                    url: serviceOrigin + '/api/v1/config/' + encodeURI(requestorId),
                    type: 'xml'  // because Adobe's docs state it's the only possible format
                }, function onAdobeGetMvpdListResponse(err, data, res) {
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var mvpdList = convertAdobeXmlToMvpdConfigObject(data);
                            if (!mvpdList.length) {
                                err = NO_DATA_ERROR;
                            }
                            else {
                                data = mvpdList;
                            }
                        }
                        catch (e) {
                            logger.error('Failed to parse getMvpdList data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }

                    // Log response.
                    if (err) {
                        logger.error('getMvpdList error:', err);
                    }
                    else {
                        logger.log('getMvpdList success');
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }

            function checkAuthN(callback) {
                return call({
                    method: GET,
                    path: '/api/v1/checkauthn',
                    data: _.defaults({
                        requestor: requestorId
                    }, addDeviceIdParams)
                }, callback);
            }


            // ## getAuthNToken(callback)
            //
            // Success Response:
            // - Headers:
            // - Body:
            //
            // Failure Response:
            // - Headers:
            //     HTTP/1.1 404 Not Found
            // - Body:
            //     {"status":404,"message":"Not Found"}
            //
            function getAuthNToken(callback) {
                var getAuthNStart,
                     getAuthNEnd,
                     getAuthNDuration; // how long the request/reponse takes  
                                     
                getAuthNStart = new Date().getTime();
                return call({
                    method: GET,
                    path: '/api/v1/tokens/authn',
                    data: _.defaults({
                        requestor: requestorId
                    }, addDeviceIdParams)
                }, function onAdobeGetAuthNTokenResponse(err, data, res) {
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var reply = {
                                mvpdId: data.mvpd,
                                expires: toInt(data.expires), 
                                userId: data.userId
                            };
                            data = reply;
                        }
                        catch (e) {
                            logger.error('Failed to parse getAuthNToken data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }

                    // Log response.
                    if (err) {
                        getAuthNEnd = new Date().getTime();
                        getAuthNDuration = (getAuthNEnd - getAuthNStart) / 1000; // seconds
                        SystemMonitor.retrieveAdobeTokenComplete('NGTKmd001', false, getAuthNDuration, err);                        
                        logger.error('getAuthNToken error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('getAuthNToken success:', JSON.stringify(data));
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }


            function checkAuthZ(resourceId, callback) {
                return call({
                    method: GET,
                    path: '/api/v1/authorize',
                    data: _.defaults({
                        requestor: requestorId,
                        resource: resourceId
                    }, addDeviceIdParams)
                }, function onAdobeCheckAuthZResponse(err, data, res) {
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var reply = {
                                mvpdId: data.mvpd,
                                resourceId: data.resource,
                                expires: toInt(data.expires)
                            };
                            data = reply;
                        }
                        catch (e) {
                            logger.error('Failed to parse checkAuthZ data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }

                    // Log response.
                    if (err) {
                        logger.error('checkAuthZ error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('checkAuthZ success:', JSON.stringify(data));
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }


            function getAuthZToken(resourceId, callback) {
                var authZTokenStart,
                    authZTokenEnd,
                    authZTokenDuration;    

                authZTokenStart = new Date().getTime();
                return call({
                    method: GET,
                    path: '/api/v1/tokens/authz',
                    data: _.defaults({
                        requestor: requestorId,
                        resource: resourceId
                    }, addDeviceIdParams)
                }, function onAdobeGetAuthZTokenResponse(err, data, res) {
                    authZTokenEnd = new Date().getTime();
                    authZTokenDuration = (authZTokenEnd - authZTokenStart) / 1000; // seconds     
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var reply = {
                                mvpdId: data.mvpdId,
                                resourceId: data.resource,
                                expires: toInt(data.expires)
                            };
                            data = reply;
                        }
                        catch (e) {
                            logger.error('Failed to parse getAuthZToken data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }

                    // Log response.
                    if (err) {
                        SystemMonitor.retrieveAdobeTokenComplete('NGTKmd002', false, authZTokenDuration, err);
                        logger.error('getAuthZToken error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('getAuthZToken success:', JSON.stringify(data));
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }


            function parseTokenObject(obj) {
                var token = {
                    mvpdId: obj.mvpdId,
                    resourceId: obj.resource,
                    token: Crypto.base64ToUtf8(obj.serializedToken),
                    expires: toInt(obj.expires)
                };
                return token;
            }



            // here
            function getMediaToken(resourceId, callback) {
                var mediaTokenStart,
                    mediaTokenEnd,
                    mediaTokenDuration;  
                    
                mediaTokenStart = new Date().getTime();
                return call({
                    method: GET,
                    path: '/api/v1/tokens/media',
                    data: _.defaults({
                        requestor: requestorId,
                        resource: resourceId
                    }, addDeviceIdParams)
                }, function onAdobeGetMediaTokenResponse(err, data, res) {
                    // Verify response.
                    if (!err && !data) {
                        err = NO_DATA_ERROR;
                    }

                    // Massage data.
                    if (!err) {
                        try {
                            var reply = parseTokenObject(data);
                            data = reply;
                        }
                        catch (e) {
                            logger.error('Failed to parse getMediaToken data', e.message);
                            err = INVALID_DATA_ERROR;
                        }
                    }


                    mediaTokenEnd = new Date().getTime();
                    mediaTokenDuration = (mediaTokenEnd - mediaTokenStart) / 1000; // seconds 
                    // Log response.
                    if (err) {
                        SystemMonitor.retrieveAdobeTokenComplete('NGTKhi005', false, mediaTokenDuration, err);                        
                        logger.error('getMediaToken error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('getMediaToken success:', JSON.stringify(data));
                    }

                    // Execute callback.
                    callback(err, data, res);
                });
            }


            function logout(resourceId, callback) {
                var params = {};
                if (resourceId) {
                    params.resource = resourceId;
                }
                return call({
                    method: DELETE,
                    path: '/api/v1/logout',
                    data: _.defaults(params, addDeviceIdParams)
                }, callback);
            }


            return ({
                isReady: isReady,
                init: init,
                getRegCode: getRegCode,
                validateRegCode: validateRegCode,
                clearRegCode: clearRegCode,
                getMvpdList: getMvpdList,
                checkAuthN: checkAuthN,
                getAuthNToken: getAuthNToken,
                checkAuthZ: checkAuthZ,
                getAuthZToken: getAuthZToken,
                getMediaToken: getMediaToken,
                logout: logout
            });

        }());

        // ## MVPDConfig
        //
        // For processing Adobe's MVPD list and the property's MVPDConfig.
        //
        // Adobe's setConfig callback gets [ { id, logoUrl }, ... ]
        // Adobe's displayProviderDialog gets [ { ID, logoURL }, ... ]
        // mvpdconfig has [ { id, logoURL }, ... ]


        var MVPDConfig = (function () {

            /* globals _, logger, request */

            'use strict';

            var CVP_CONFIG_ROOT = 'http://z.cdn.turner.com/xslo/cvp/config';
            var CONFIG_ENV_PREPROD = 'preprod';
            // var CONFIG_ENV_PROD = 'prod';

            var MVPD_ID_KEY = 'ID';
            var FREE_PREVIEW_ID = 'TempPass';
            var DEFAULT_COUNTRY = 'US';
            var UNKNOWN_COUNTRY = 'N/A';
            var CONFIG_MULTIVALUE_DELIM = /\s*[|,]\s*/;

            var KNOWN_PLATFORMS = [ 'flash', 'html5', 'Android', 'iOS', 'Win8', 'Xbox', 'appletv', 'firetv' ];
            var platform = 'firetv';
            var mvpdConfigUrl;
            var requestorId;
            var propertyIds = [];
            var propertyMVPDs = [];
            var sanitizedMVPDs = [];
            var darkMvpdIds = [];
            var hiddenMvpdIds = [ FREE_PREVIEW_ID ];

            // var configReady = new Promise();
            // var waitingForPropertyMvpds = new Promise();
            // var waitingForVendorMvpds = new Promise();

            var countryCode = '';
            var darkPhaseUrl = '';
            var darkPhaseCallbackName = 'cvp_onDarkPhaseReceived';
            // var darkPhasePromise = new Promise();
            var mvpdJsonpCallbackName = 'cvp_onMVPDConfigReceived';

            var toUpper = Function.prototype.call.bind(String.prototype.toUpperCase);
            var trim = Function.prototype.call.bind(String.prototype.trim);

            function toInt(num) {
                return parseInt(num, 10);
            }

            // function getMvpdConfigUrl() {
            // 	return mvpdConfigUrl;
            // }

            // function getDarkPhaseUrl() {
            // 	return darkPhaseUrl;
            // }

            // function requestDarkPhaseData() {
            // 	return darkPhasePromise;
            // }

            var MVPD_CONFIG_READY_TIMEOUT = 90000;
            var CONFIG_READY_VOW = 'configReady';
            var WAITING_FOR_PROPERTY_MVPDS_VOW = 'waitingForPropertyMvpds';
            var WAITING_FOR_VENDOR_MVPDS_VOW = 'waitingForVendorMvpds';
            var MERGED_MVPDS_VOW = 'mergedMvpds';
            var DARK_PHASE_READY_VOW = 'darkPhaseConfigReady';

            var vows = (function () {

                var vowNames = [
                    CONFIG_READY_VOW,
                    WAITING_FOR_PROPERTY_MVPDS_VOW,
                    WAITING_FOR_VENDOR_MVPDS_VOW,
                    MERGED_MVPDS_VOW,
                    DARK_PHASE_READY_VOW
                ];

                var optionalVows = [
                    DARK_PHASE_READY_VOW
                ];

                var callback = null;
                var timer = null;
                var map = {};
                // map[vowName] = [success, data]
                var isResolved = false;
                var resolvedErr = null;

                function getStatus() {
                    return _.map(vowNames, function (vow) {
                        if (vow in map) {
                            return vow + ':' + map[vow][0];
                        }
                        return vow + ':unfulfilled';
                    }).join(', ');
                }

                function checkConditions() {
                    logger.log('checking conditions:', getStatus());
                    if (!(MERGED_MVPDS_VOW in map) && (WAITING_FOR_PROPERTY_MVPDS_VOW in map && WAITING_FOR_VENDOR_MVPDS_VOW in map)) {
                        logger.log('ready to merge brand mvpd list with Adobe mvpd list!');
                        mergeLists(map[WAITING_FOR_VENDOR_MVPDS_VOW][1], map[WAITING_FOR_PROPERTY_MVPDS_VOW][1]);
                    }
                    else if (!(CONFIG_READY_VOW in map) && (DARK_PHASE_READY_VOW in map && MERGED_MVPDS_VOW in map)) {
                        logger.log('ready to resolve mvpdconfig!');
                        update(CONFIG_READY_VOW, true, map[MERGED_MVPDS_VOW][1]);
                    }
                    else if (CONFIG_READY_VOW in map) {
                        logger.log('mvpdconfig is resolved!');
                        resolve();
                    }
                }

                // collecting errors, but not for Dark Phase -- that's optional (so is Geolocation)
                function getErrors() {
                    return _.compact(_.map(_.difference(vowNames, optionalVows), function (vow) {
                        if (vow in map) {
                            if (map[vow][0] === false) {
                                return vow + ':failed';
                            }
                            return;
                        }
                        return vow + ':unfulfilled';
                    }));
                }

                function resolve() {
                    window.clearTimeout(timer);
                    if (callback && !isResolved) {
                        resolvedErr = getErrors();
                        if (!resolvedErr.length) {
                            resolvedErr = null;
                        }
                        logger.log('MVPDConfig is resolved ' + (resolvedErr ? 'un' : '') + 'successfully' + (resolvedErr ? ': ' + resolvedErr : ''));
                        callback(resolvedErr);
                        isResolved = true;
                    }
                }

                function update(vow/*, success, result*/) {
                    if (isResolved) {
                        logger.warn('All vows were already resolved');
                        return;
                    }

                    if (!_.contains(vowNames, vow)) {
                        logger.warn('"' + vow + '" is an unknown vow');
                        return;
                    }

                    if (vow in map) {
                        logger.warn('"' + vow + '" was already resolved');
                        return;
                    }

                    logger.log('Fulfilling vow "' + vow + '"');
                    map[vow] = _.toArray(arguments).slice(1);

                    checkConditions();
                }

                function init(fn) {
                    callback = fn;
                    timer = window.setTimeout(resolve, MVPD_CONFIG_READY_TIMEOUT);
                }

                function dispose() {
                    callback = null;
                    window.clearTimeout(timer);
                }

                return ({
                    init: init,
                    dispose: dispose,
                    update: update
                });

            }());


            // `normalizeMVPD` is an internal method, used to append additional
            // properties to an existing MVPD object/entry, if necessary.
            function normalizeMVPD(mvpd) {

                // update `iFrameRequired`
                if (_.isString(mvpd.iFrameRequired)) {
                    mvpd.iFrameRequired = mvpd.iFrameRequired === 'true';
                }

                // cast `iFrameWidth` to num
                if (_.isString(mvpd.iFrameWidth)) {
                    mvpd.iFrameWidth = toInt(mvpd.iFrameWidth);
                }

                // cast `iFrameHeight` to num
                if (_.isString(mvpd.iFrameHeight)) {
                    mvpd.iFrameHeight = toInt(mvpd.iFrameHeight);
                }

                // update `logoURL`
                if (!('logoURL' in mvpd) && 'logoUrl' in mvpd) {
                    mvpd.logoURL = mvpd.logoUrl;
                }

                // update `ID`
                if (!(MVPD_ID_KEY in mvpd) && 'id' in mvpd) {
                    mvpd[MVPD_ID_KEY] = mvpd.id;
                }

                return mvpd;
            }

            function interpretMvpdConfigEntry(config) {
                var newConfig = {};

                function getDefaultProperties() {
                    return _.omit(config, ['country', 'format'].concat(_.without(KNOWN_PLATFORMS, platform)));
                }

                function getFormatProperties() {
                    var formatObj = _.findWhere(config.format, { os: platform });

                    if (!formatObj) {
                        return {};
                    }

                    var obj = {};

                    // only grab properties that actually have useful value
                    _.each(formatObj, function (value, key) {
                        if (!_.isEmpty(value)) {
                            obj[key] = value;
                        }
                    });

                    return obj;
                }

                function getCountries() {
                    var countries = [ DEFAULT_COUNTRY ];
                    if (_.isString(config.country)) {
                        // Translate config's 'country' string into an array.
                        countries = _.compact(
                            _.uniq(
                                _.map(
                                    _.map(config.country.split(CONFIG_MULTIVALUE_DELIM), trim),
                                    toUpper
                                )
                            )
                        );
                    }
                    return countries;
                }

                newConfig = normalizeMVPD(_.extend(getDefaultProperties(), getFormatProperties()));

                newConfig.countries = getCountries();

                return newConfig;
            }

            function extractMvpdIds(mvpds) {
                return _.pluck(mvpds, MVPD_ID_KEY);
            }

            function updateClientConfig(mvpds) {
                if (_.isEmpty(mvpds) || !_.isArray(mvpds)) {
                    logger.error('MVPDConfig:updateClientConfig failed to receive list of MVPDs!');
                    // waitingForPropertyMvpds.reject();
                    vows.update(WAITING_FOR_PROPERTY_MVPDS_VOW, false);
                }
                propertyMVPDs = _.map(mvpds, interpretMvpdConfigEntry);
                propertyIds = extractMvpdIds(propertyMVPDs);
                logger.log('MVPDConfig:updateClientConfig', propertyIds.length + ' MVPDs listed in mvpdconfig: ' + propertyIds.join(', '));
                // waitingForPropertyMvpds.fulfill(propertyMVPDs);
                vows.update(WAITING_FOR_PROPERTY_MVPDS_VOW, true, propertyMVPDs);
            }

            function updateVendorConfig(mvpds) {
                if (_.isEmpty(mvpds) || !_.isArray(mvpds)) {
                    logger.error('MVPDConfig:updateVendorConfig failed to receive list of MVPDs!');
                    // waitingForVendorMvpds.reject();
                    vows.update(WAITING_FOR_VENDOR_MVPDS_VOW, false);
                }
                mvpds = _.map(mvpds, normalizeMVPD);
                var mvpdIds = extractMvpdIds(mvpds);
                logger.log('MVPDConfig:updateVendorConfig', mvpdIds.length + ' MVPDs provided from vendor: ' + mvpdIds.join(', '));
                // waitingForVendorMvpds.fulfill(mvpds);
                vows.update(WAITING_FOR_VENDOR_MVPDS_VOW, true, mvpds);
            }


            function load(options, callback) {

                function darkPhaseLoadSuccess(data) {
                    if (_.isObject(data) && !_.isEmpty(data)) {
                        darkMvpdIds = _.keys(data);
                        logger.debug('MVPDConfig found dark phase providers', darkMvpdIds);
                        // darkPhasePromise.fulfill(data);
                        vows.update(DARK_PHASE_READY_VOW, true, data);
                    }
                    else {
                        logger.debug('MVPDConfig found no dark phase providers');
                        darkPhaseLoadFailure();
                    }
                }

                function darkPhaseLoadFailure() {
                    // darkPhasePromise.reject();
                    vows.update(DARK_PHASE_READY_VOW, false);
                }

                // mock JSONP request for dark phase
                function darkPhaseRequestCallback(err, data/*, res*/) {
                    /* jshint evil:true */
                    if (err) {
                        logger.error('Failed to obtain dark phase data!', err);
                        darkPhaseLoadFailure();
                    }
                    else {
                        darkPhaseLoadSuccess(data);
                    }
                }

                function mvpdConfigLoadSuccess(data) {
                    if (_.isUndefined(data) || !_.isString(data.brand)) {
                        logger.error(mvpdJsonpCallbackName + ' did not receive valid data or brand');
                        mvpdConfigLoadFailure();
                    }

                    if (data.brand !== requestorId) {
                        logger.error(mvpdJsonpCallbackName + ' received a "brand" (' + data.brand + ') that did not match "requestorId" (' + requestorId + ')');
                        mvpdConfigLoadFailure();
                    }

                    if (!_.isArray(data.mvpd)) {
                        logger.error(mvpdJsonpCallbackName + ' received invalid "mvpd" data');
                        mvpdConfigLoadFailure();
                    }

                    // Update darkPhase URL.
                    if (_.isObject(data.mvpdHelper) && _.isString(data.mvpdHelper.url)) {
                        darkPhaseUrl = data.mvpdHelper.url;

                        logger.debug('MVPDConfig darkPhase URL obtained from MVPDConfig: ', darkPhaseUrl);

                        request({
                            url: darkPhaseUrl,
                            type: 'jsonp',
                            jsonpCallback: darkPhaseCallbackName
                        }, darkPhaseRequestCallback);
                    }
                    else {
                        logger.debug('MVPDConfig darkPhase URL was not obtained from MVPDConfig.');
                        darkPhaseLoadFailure();
                    }

                    updateClientConfig(data.mvpd);
                }

                function mvpdConfigLoadFailure() {
                    // waitingForPropertyMvpds.reject();
                    vows.update(WAITING_FOR_PROPERTY_MVPDS_VOW, false);
                }

                // mock JSONP request for dark phase
                function mvpdConfigRequestCallback(err, data/*, res*/) {
                    /* jshint evil:true */
                    if (err) {
                        logger.error('Failed to obtain mvpdconfig data!', err);
                        mvpdConfigLoadFailure();
                    }
                    else {
                        mvpdConfigLoadSuccess(data);
                    }
                }

                function getMvpdConfigUrl(cvpSite, env) {
                    var url = CVP_CONFIG_ROOT + '/' + cvpSite + '/tve' + (env === CONFIG_ENV_PREPROD ? '/preprod' : '') + '/mvpdconfig.js';
                    return url;
                }

                vows.init(callback);

                // `requestorId` is required.
                requestorId = options.requestorId;

                // `platform` is optional, defaults to 'flash'.
                if (platform in options) {
                    platform = options.platform;
                }

                // Determine `mvpdConfigUrl` from provided options.
                mvpdConfigUrl = options.mvpdConfigUrl;

                var site = options.site;
                var configEnv = options.configEnv;

                if (site && !_.isString(mvpdConfigUrl)) {
                    mvpdConfigUrl = getMvpdConfigUrl(site, configEnv);
                }

                if (!mvpdConfigUrl) {
                    logger.error('MVPDConfig:load', 'Could not determine `mvpdConfigUrl` for site "' + site + '"');
                    mvpdConfigLoadFailure();
                    return;
                }

                request({
                    url: mvpdConfigUrl,
                    type: 'jsonp',
                    jsonpCallback: mvpdJsonpCallbackName
                }, mvpdConfigRequestCallback);

            }

            function fail() {
                // configReady.reject();
                vows.update(MERGED_MVPDS_VOW, false);
            }

            function mergeLists(vendorMVPDs, propertyMVPDs) {
                if (_.isEmpty(vendorMVPDs) || _.isEmpty(propertyMVPDs)) {
                    return fail();
                }

                var diffMvpds = _.difference(extractMvpdIds(vendorMVPDs), propertyIds);
                logger.log('MVPDConfig:mergeLists', diffMvpds.length + ' vendor-provided MVPDs did not appear in client mvpdconfig: ' + diffMvpds.join(', '));

                // For each vendor mvpd that exists in list of property mvpds (whitelist),
                // copy vendor props, override with property props, and add back to list.
                _.each(vendorMVPDs, function (vendorMVPD) {
                    var propertyIdsIndex = _.indexOf(propertyIds, vendorMVPD[MVPD_ID_KEY]);
                    if (propertyIdsIndex !== -1) {
                        var propertyMVPD = propertyMVPDs[propertyIdsIndex];
                        var mvpd = _.extend({}, vendorMVPD, propertyMVPD);
                        sanitizedMVPDs.push(mvpd);
                    }
                });

                logger.log('MVPDConfig:mergeLists', 'configured MVPDs (' + sanitizedMVPDs.length + '): ' + extractMvpdIds(sanitizedMVPDs).join(', '));

                // configReady.fulfill();
                vows.update(MERGED_MVPDS_VOW, true);
            }


            // MVPDConfig accessors

            function isDarkMvpd(mvpd) {
                return _.contains(darkMvpdIds, mvpd[MVPD_ID_KEY]);
            }

            function isHiddenMvpd(mvpd) {
                return _.contains(hiddenMvpdIds, mvpd[MVPD_ID_KEY]);
            }

            // Valid MVPDs = present in config, not dark phase

            function isValidMvpd(mvpd) {
                return platform in mvpd && mvpd[platform] === true;
            }

            var _validMvpdIds;

            function getValidMvpdIds() {
                return _validMvpdIds || (_validMvpdIds = extractMvpdIds(getMVPDs()));
            }

            function isValidMvpdId(mvpdId) {
                if (!mvpdId) {
                    return false;
                }

                return _.contains(getValidMvpdIds(), mvpdId);
            }

            function getWhitelistedMVPDs(filter) {
                var mvpds = darkMvpdIds.length ? _.reject(sanitizedMVPDs, isDarkMvpd) : sanitizedMVPDs.slice();

                return filter ? _.filter(mvpds, filter) : mvpds;
            }

            // Visible MVPDs = providers for Picker: present in config and/or dark phase

            function isVisibleMvpd(mvpd) {
                if ('visible' in mvpd && _.isString(mvpd.visible)) {
                    var visible = mvpd.visible;

                    if (visible === 'all' || visible === 'true') {
                        return true;
                    }

                    var platforms = visible.split(CONFIG_MULTIVALUE_DELIM);

                    return _.contains(platforms, this.PLATFORM_PROPERTY);
                }

                return isValidMvpd(mvpd);
            }

            function getVisibleMVPDs(filter) {
                filter = filter || _.identity;

                var combofilter = function (mvpd) {
                    return filter(mvpd) || isDarkMvpd(mvpd);
                };

                var mvpds = hiddenMvpdIds.length ? _.reject(sanitizedMVPDs, isHiddenMvpd) : sanitizedMVPDs.slice();

                return _.filter(mvpds, combofilter);
            }

            function getPickerMVPDs() {
                return getVisibleMVPDs(isVisibleMvpd);
            }

            var _visibleMvpdIds;

            function getVisibleMvpdIds() {
                return _visibleMvpdIds || (_visibleMvpdIds = extractMvpdIds(getPickerMVPDs()));
            }

            function isVisibleMvpdId(mvpdId) {
                if (!mvpdId) {
                    return false;
                }

                return _.contains(getVisibleMvpdIds(), mvpdId);
            }

            function getMVPDs() {
                return getWhitelistedMVPDs(isValidMvpd);
            }

            var byMvpdId = _.memoize(function _byMvpdId(mvpdId) {
                return function byMatchingMvpdIds(mvpd) {
                    return mvpd[MVPD_ID_KEY] === mvpdId;
                };
            });

            function getMvpdById(mvpdId) {
                logger.log('MVPDConfig.getMvpdById', arguments);

                if (!mvpdId) {
                    return undefined;
                }

                // look up the MVPD in our filtered MVPDs
                var mvpd = _.find(getMVPDs(), byMvpdId(mvpdId));

                if (_.isUndefined(mvpd)) {
                    logger.warn('MVPDConfig.getMvpdById - MVPD ID "' + mvpdId + '" was not found in the MVPD Config.');
                }

                return mvpd;
            }

            function byPrimaryOrder(mvpd) {
                return 'primaryOrder' in mvpd && mvpd.primaryOrder > 0 && 'picker' in mvpd;
            }

            var createPrimaryFilterForCountry = _.memoize(function _createPrimaryFilterForCountry(country) {
                return function byPrimaryOrderForCountry(mvpd) {
                    return 'countries' in mvpd && _.contains(mvpd.countries, country) && byPrimaryOrder(mvpd);
                };
            });

            var defaultCountryFilter = createPrimaryFilterForCountry(DEFAULT_COUNTRY);

            function getDefaultPrimaries(mvpds) {
                logger.log('attempting to filter primaries by country code "' + DEFAULT_COUNTRY + '"');
                return _.filter(mvpds, defaultCountryFilter);
            }

            function getCountryPrimaries(mvpds, country) {
                logger.log('attempting to filter primaries by country code "' + countryCode + '"');
                return _.filter(mvpds, createPrimaryFilterForCountry(country));
            }

            function filterPrimaries(mvpds) {
                if (countryCode === UNKNOWN_COUNTRY || countryCode === DEFAULT_COUNTRY) {
                    return getDefaultPrimaries(mvpds);
                }

                var list = getCountryPrimaries(mvpds, countryCode);

                if (!list.length) {
                    list = getDefaultPrimaries(mvpds);
                }

                return list;
            }


            // `getMvpdConfigEntry` simply returns the property's mvpdconfig entry for the MVPD ID provided.
            function getMvpdConfigEntry(mvpdId) {

                if (_.isNull(mvpdId)) {
                    // short-circuit if invalid MVPD ID
                    return undefined;
                }

                if (_.isUndefined(mvpdId)) {
                    // return all entries
                    return propertyMVPDs.slice();
                }

                var index = _.indexOf(propertyIds, mvpdId);

                if (index !== -1) {
                    // Returning a copy so the original cannot be modified.
                    return _.extend({}, propertyMVPDs[index]);
                }
            }


            return ({
                load: load,
                updateVendorConfig: updateVendorConfig,
                isValidMvpdId: isValidMvpdId,
                isVisibleMvpdId: isVisibleMvpdId,
                getMvpdById: getMvpdById,
                extractMvpdIds: extractMvpdIds,
                getMVPDs: getMVPDs,
                getPickerMVPDs: getPickerMVPDs,
                filterPrimaries: filterPrimaries,
                getMvpdConfigEntry: getMvpdConfigEntry                
            });

        }());

        // # AuthManager
        //
        // Interface merging facade to Adobe and interpretation of mvpdconfig.


        var AuthManager = (function () {

            /* globals logger, AccessEnabler, Crypto, Store, request, MVPDConfig */

            'use strict';

            var VERSION = '0.2.0';
            var DEFAULT_DEVICE_TYPE = 'firetv';
            var DEVICE_ID_STORE_KEY = 'cvp_auth_deviceId';
            var AUTHN_TOKEN_STORE_KEY = 'cvp_auth_authNToken';
            var site = '';
            var tokenUrl = '';

            // Possible errors

            // ADOBE_CONFIG_FAILURE ... will kill init()
            // MVPDCONFIG_FAILURE ... will kill init()
            var INIT_FAILURE_ERROR = 'I500';

            var REGCODE_FAILURE_ERROR = 'R500';  // not 201
            var REGCODE_EXPIRED_ERROR = 'R110';  // 403

            var NOT_AUTHENTICATED_ERROR = 'N000';  // 404 checkAuthN, 412 getAuthZToken
            var AUTHENTICATION_EXPIRED_ERROR = 'N110';  // 403 checkAuthN, 410 getAuthNToken, 403 getMediaToken
            var AUTHENTICATION_FAILURE_ERROR = 'N500';  // unknown error

            var NOT_AUTHORIZED_ERROR = 'Z000';  // 404 getAuthZToken
            var NOT_SUBSCRIBED_ERROR = 'Z100';  // 403 checkAuthZ
            var AUTHORIZATION_EXPIRED_ERROR = 'Z110';  // 410 getAuthZToken
            var AUTHORIZATION_FAILURE_ERROR = 'Z500';  // unknown error

            var NOT_SUBSCRIBED_MESSAGE = 'You are not authorized to view this content. Please contact your TV provider for further assistance.';
            var AUTHORIZATION_FAILURE_MESSAGE = 'We are experiencing technical difficulties. Please try again or contact your TV provider for further assistance.';

            var MEDIA_TOKEN_FAILURE_ERROR = 'M500';  // unknown error
            var CDN_TOKEN_FAILURE_ERROR = 'C500';  // network error or request error

            var LOGOUT_FAILURE_ERROR = 'O500';  // not 204


            function exception(code, message, response) {
                var err = new Error(code + ' ' + message);
                err.code = code;
                if (response) {
                    err.response = response;
                }
                return err;
            }

            var ready = false;

            function isReady() {
                return ready;
            }

            function getDeviceId() {
                var deviceId = Store.get(DEVICE_ID_STORE_KEY);
                if (!deviceId) {
                    deviceId = Crypto.getUUID();
                    Store.set(DEVICE_ID_STORE_KEY, deviceId);
                }

                return deviceId;
            }

            function setTokenUrl(url) {
                tokenUrl = url;
            }

            function setSite(val) {
                site = val;
            }

            function init(opts, callback) {
                logger.info('Turnip Auth ' + VERSION);
                logger.log('AuthManager.init(' + (typeof opts) + ', ' + (typeof callback) + ')');

                function resolve(err) {
                    ready = !err;

                    if (!ready) {
                        logger.error('AuthManager.init failed!', err);
                        return callback(exception(INIT_FAILURE_ERROR, 'Init failed'));
                    }

                    callback(null);
                }

                if (isReady()) {
                    // Prevent multiple init()s.
                    return;
                }

                if (!opts.deviceType) {
                    opts.deviceType = DEFAULT_DEVICE_TYPE;
                }

                if (!opts.deviceId) {
                    opts.deviceId = getDeviceId();
                }

                var req;

                try {
                    setTokenUrl(opts.tokenUrl);
                    setSite(opts.site);

                    req = AccessEnabler.init(opts, function onInitResponse(err) {
                        // NOTE - this was fine before we needed the MVPDConfig to be read
                        // ready = !err;
                        // callback.apply(this, arguments);

                        if (err) {
                            resolve(err);
                        }

                        // Load MVPDConfig
                        MVPDConfig.load(opts, resolve);

                        // Push Adobe's MVPDs to MVPDConfig.
                        getMvpdList(function (err, data/*, res*/) {
                            MVPDConfig.updateVendorConfig(data);
                        });

                    });
                }
                catch (e) {
                    logger.error('AuthManager.init threw exception', e.stack);
                    resolve(e);
                }

                return req;
            }

            function notifyNotReady() {
                logger.error('AuthManager is not ready.');
            }

            function getRegCodeException(err, data, res) {
                switch (err) {
                  case 403: return exception(REGCODE_EXPIRED_ERROR, 'Registration code expired', res);
                  default: return exception(REGCODE_FAILURE_ERROR, 'Internal registration code failure', res);
                }
            }

            function getRegCode(callback) {
                logger.log('AuthManager.getRegCode(' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return AccessEnabler.getRegCode(function onGetRegCodeResponse(err, data, res) {
                    if (err) {
                        logger.error('Failed to obtain registration code!', err);
                        callback(getRegCodeException(err, data, res), null, res);
                        return;
                    }

                    logger.log('authN-ed!', JSON.stringify(data));
                    callback(null, data, res);
                });
            }

            // function validateRegCode(regCode, callback) {
            // 	return AccessEnabler.validateRegCode(regCode, callback);
            // }

            // function clearRegCode(regCode, callback) {
            // 	return AccessEnabler.clearRegCode(regCode, callback);
            // }

            function getMvpdList(callback) {
                logger.log('AuthManager.getMvpdList(' + (typeof callback) + ')');

                return AccessEnabler.getMvpdList(callback);
            }


            function checkAuthNException(err, data, res) {
                switch (err) {
                  case 404: return exception(NOT_AUTHENTICATED_ERROR, 'Not authenticated', res);
                  case 403:
                  case 410: return exception(AUTHENTICATION_EXPIRED_ERROR, 'Authentication expired', res);
                  default: return exception(AUTHENTICATION_FAILURE_ERROR, 'Internal authentication failure', res);
                }
            }

            function checkAuthN(callback) {
                logger.log('AuthManager.checkAuthN(' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return AccessEnabler.checkAuthN(function checkAuthNResponse(err, data, res) {
                    if (err) {
                        logger.error('checkAuthN failed!', err);
                        return callback(checkAuthNException(err, data, res), null, res);
                    }

                    return callback(null, data, res);
                });
            }


            function getAuthNException(err, data, res) {
                switch (err) {
                  case 404: return exception(NOT_AUTHENTICATED_ERROR, 'Not authenticated', res);
                  case 403:
                  case 410: return exception(AUTHENTICATION_EXPIRED_ERROR, 'Authentication expired', res);
                  default: return exception(AUTHENTICATION_FAILURE_ERROR, 'Internal authentication failure', res);
                }
            }

            function getAuthN(callback) {
                logger.log('AuthManager.getAuthN(' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return AccessEnabler.getAuthNToken(function onGetAuthNTokenResponse(err, data, res) {
                    if (err) {
                        logger.error('Not authN-ed!', err);
                        Store.clearSession(AUTHN_TOKEN_STORE_KEY);
                        callback(getAuthNException(err, data, res), null, res);
                        return;
                    }

                    // Check if authN'ed with invalid/disabled provider & logout if so.
                    var mvpdId = data.mvpdId;
                    if (!MVPDConfig.isValidMvpdId(mvpdId)) {
                        logger.warn('"' + mvpdId + '" is not a valid provider according to MVPDConfig -- Logging out and requesting authN expecting it to fail.');
                        logout(function onInvalidProvider() {
                            getAuthN(callback);
                        });
                        return;
                    }

                    logger.log('authN-ed!', JSON.stringify(data));
                    Store.setSession(AUTHN_TOKEN_STORE_KEY, data, { expires: data.expires });
                    callback(null, data, res);
                });
            }

            // function getAuthZTokenException(err, data, res) {
            // 	switch (err) {
            // 		case 412: return exception(NOT_AUTHENTICATED_ERROR, 'Not authenticated', res);
            // 		case 404: return exception(NOT_AUTHORIZED_ERROR, 'Not authorized', res);
            // 		case 410: return exception(AUTHORIZATION_EXPIRED_ERROR, 'Authorization expired', res);
            // 		default: return exception(AUTHORIZATION_FAILURE_ERROR, 'Internal authorization failure', res);
            // 	}
            // }

            // function getAuthZ(resourceId, callback) {
            // 	logger.log('AuthManager.getAuthZ(' + resourceId + ', ' + (typeof callback) + ')');

            // 	if (!isReady()) {
            // 		return notifyNotReady();
            // 	}

            // 	AccessEnabler.checkAuthZ(resourceId, function checkAuthZResponse(err/*, data, res*/) {
            // 		if (err) {
            // 			logger.error('getAuthZ - checkAuthZ failed!', err);
            // 			return callback.apply(this, arguments);
            // 		}
            // 		// Do we have to make sure the resourceId requested is the same as the one in the response?
            // 		AccessEnabler.getMediaToken(resourceId, function getMediaTokenResponse(err/*, data, res*/) {
            // 			if (err) {
            // 				logger.error('getAuthZ - getMediaToken failed!', err);
            // 				return callback.apply(this, arguments);
            // 			}
            // 		});
            // 	});
            // }

            var urlRegex = /^((([^:\/?#]+):)?(?:\/\/(([^\/?#]*)(?::(\d+))?))?)(([^?#]*\/)([^\/?#]*)?)(\?([^#]*))?(#(.*))?$/;
            function parseUrlForTokenDir(url) {
                var match = urlRegex.exec(url);
                var path = (match ? match[8] : '/') + '*';
                return path;
            }

            function checkAuthZException(err, data, res) {
                switch (err) {
                  case 404: return exception(NOT_AUTHORIZED_ERROR, data && data.details || 'Not authorized', res);
                  case 403: return exception(NOT_SUBSCRIBED_ERROR, NOT_SUBSCRIBED_MESSAGE, res);
                  default: return exception(AUTHORIZATION_FAILURE_ERROR, AUTHORIZATION_FAILURE_MESSAGE, res);
                }
            }

            function checkAuthZ(resourceId, callback) {
                logger.log('AuthManager.checkAuthZ(' + resourceId + ', ' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return AccessEnabler.checkAuthZ(resourceId, function checkAuthZResponse(err, data, res) {
                    if (err) {
                        logger.error('checkAuthZ failed!', err);
                        return callback(checkAuthZException(err, data, res), null, res);
                    }

                    return callback(null, data, res);
                });
            }

            function getMediaTokenException(err, data, res) {
                switch (err) {
                  case 403: return exception(AUTHENTICATION_EXPIRED_ERROR, data && data.details || 'Authentication token not found', res);
                  default: return exception(MEDIA_TOKEN_FAILURE_ERROR, data && data.details || 'Request for media token failed', res);
                }
            }

            function getCDNTokenException(err, data, res) {
                return exception(CDN_TOKEN_FAILURE_ERROR, data || 'Request for CDN token failed', res);
            }

            function getPlayToken(resourceId, videoPathOrUrl, callback) {
                var CDNTokenStart,
                    CDNTokenEnd,
                    CDNTokenDuration;

                logger.log('AuthManager.getPlayToken(' + resourceId + ', ' + videoPathOrUrl + ', ' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                // Parse "/dir/" from "http://some.url/dir/file" or "/dir/file" then append a star (*).
                var videoPath = parseUrlForTokenDir(videoPathOrUrl);

                if (FreePreview.isEnabled()) {
                    CDNTokenStart = new Date().getTime();
                    return getCDNToken(null, videoPath, function getCDNTokenResponse(err, data, res) {
                        CDNTokenEnd = new Date().getTime();
                        CDNTokenDuration = (CDNTokenEnd - CDNTokenStart) / 1000; // seconds
                        // Log response.
                        if (err) {
                            SystemMonitor.retrieveAdobeTokenComplete('NGTKhi004', false, CDNTokenDuration, err);
                            logger.error('getPlayToken - getCDNToken failed!', err);
                            return callback(getCDNTokenException(err, data, res), null, res);
                        }

                        logger.log('getPlayToken - getCDNToken success!', data);
                        return callback(null, data, res);
                    });
                }

                var mvpdId = getMvpdId();
                if (!MVPDConfig.isValidMvpdId(mvpdId)) {
                    logger.warn('getPlayToken - "' + mvpdId + '" is not a valid provider -- logging out and manually failing.');
                    logout(function onInvalidProvider() {
                        callback(exception(NOT_SUBSCRIBED_ERROR, NOT_SUBSCRIBED_MESSAGE));
                    });
                    return;
                }

                AccessEnabler.checkAuthZ(resourceId, function checkAuthZResponse(err, data, res) {
                    if (err) {
                        logger.error('getPlayToken - checkAuthZ failed!', err);
                        return callback(checkAuthZException(err, data, res), null, res);
                    }

                    // Do we have to make sure the resourceId requested is the same as the one in the response?
                    AccessEnabler.getMediaToken(resourceId, function getMediaTokenResponse(err, data, res) {
                        if (err) {
                            logger.error('getPlayToken - getMediaToken failed!', err);
                            return callback(getMediaTokenException(err, data, res), null, res);
                        }

                        CDNTokenStart = new Date().getTime();
                        getCDNToken(data, videoPath, function getCDNTokenResponse(err, data, res) {
                            CDNTokenEnd = new Date().getTime();
                            CDNTokenDuration = (CDNTokenEnd - CDNTokenStart) / 1000; // seconds 
                            // Log response.
                            if (err) {
                                SystemMonitor.retrieveAdobeTokenComplete('NGTKhi004', false, CDNTokenDuration, err);                             
                                logger.error('getPlayToken - getCDNToken failed!', err);
                                return callback(getCDNTokenException(err, data, res), null, res);
                            }

                            logger.log('getPlayToken - getCDNToken success!', data);
                            return callback(null, data, res);
                        });
                    });
                });
            }

            function getMediaToken(resourceId, callback) {
                if (!isReady()) {
                    return notifyNotReady();
                }

                var mvpdId = getMvpdId();
                if (!MVPDConfig.isValidMvpdId(mvpdId)) {
                    logger.warn('getMediaToken - "' + mvpdId + '" is not a valid provider -- logging out and manually failing.');
                    logout(function onInvalidProvider() {
                        callback(exception(NOT_SUBSCRIBED_ERROR, NOT_SUBSCRIBED_MESSAGE));
                    });
                    return;
                }

                AccessEnabler.checkAuthZ(resourceId, function checkAuthZResponse(err, data, res) {
                    if (err) {
                        logger.error('getMediaToken - checkAuthZ failed!', err);
                        return callback(checkAuthZException(err, data, res), null, res);
                    }

                    // Do we have to make sure the resourceId requested is the same as the one in the response?
                    AccessEnabler.getMediaToken(resourceId, function getMediaTokenResponse(err, data, res) {
                        if (err) {
                            logger.error('getMediaToken - getMediaToken failed!', err);
                            return callback(getMediaTokenException(err, data, res), null, res);
                        }

                        return callback(null, data, res);
                    });
                });
            }


            function logout(resourceId, callback) {
                if (typeof resourceId === 'function') {
                    callback = resourceId;
                    resourceId = '';
                }

                logger.log('AuthManager.logout(' + resourceId + ', ' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return AccessEnabler.logout(resourceId, function logoutResponse(err, data, res) {
                    // if nothing else, clear what we've stored
                    Store.clearSession(AUTHN_TOKEN_STORE_KEY);

                    if (err) {
                        logger.error('logout failed!', err, JSON.stringify(res));

                        if (callback) {
                            callback(exception(LOGOUT_FAILURE_ERROR, 'Log out failure', res), null, res);
                        }

                        return;
                    }

                    logger.log('logout success!');

                    if (callback) {
                        callback(null, data, res);
                    }
                });
            }

            /**
             * Start activation process.
             * Essentially calls logout() before returning getRegCode response.
             */
            function login(resourceId, callback) {
                if (typeof resourceId === 'function') {
                    callback = resourceId;
                    resourceId = '';
                }

                logger.log('AuthManager.login(' + (typeof callback) + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return logout(resourceId, function onLogout(/*err, data, res*/) {
                    getRegCode(callback);
                });
            }

            function getMvpdId() {
                var token = Store.getSession(AUTHN_TOKEN_STORE_KEY) || {};
                return token.mvpdId || null;
            }

            function getMvpdIdForAnalytics() {
                if (FreePreview.isEnabled()) {
                    return ENV.preview.eventBased.omnitureKey;
                }
                return getMvpdId() || ANALYTICS.values.mvpd.none;
            }

            function getAdobeUserId() {
                var token = Store.getSession(AUTHN_TOKEN_STORE_KEY) || {};
                return token.userId || null;
            }

            // MVPD Config methods

            // `getMvpdConfigEntry` is simply a pass-thru to the property's mvpdconfig
            function getMvpdConfigEntry(mvpdId) {
                logger.log('AuthManager.getMvpdConfigEntry(' + mvpdId + ')');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return MVPDConfig.getMvpdConfigEntry(mvpdId || getMvpdId());
            }

            // `getMVPDs` returns valid providers and dark phase providers
            function getMVPDs() {
                logger.log('AuthManager.getMVPDs()');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return MVPDConfig.getPickerMVPDs();
            }

            function filterPrimaries(mvpds) {
                return MVPDConfig.filterPrimaries(mvpds);
            }

            // `getPrimaryMVPDs` returns valid providers and dark phase providers
            function getPrimaryMVPDs() {
                logger.log('AuthManager.getPrimaryMVPDs()');

                if (!isReady()) {
                    return notifyNotReady();
                }

                return filterPrimaries(getMVPDs());
            }


            // getCDNToken
            // -----------
            //
            // The token service may return 200 but the body will be an error in xml format:
            //
            //     <auth>
            //     	<error>
            //     		<code>2504</code>
            //     		<msg>Invalid signature</msg>
            //     	</error>
            //     </auth>
            //
            //     <auth>
            //     	<error>
            //     		<code>2509</code>
            //     		<msg>Missing Authentication token</msg>
            //     	</error>
            //     </auth>
            //
            function getCDNToken(mediaToken, videoPath, callback) {
                logger.log('requesting getCDNToken(' + mediaToken + ', ' + videoPath + ', ' + (typeof callback) + ')');

                var reqOpts = {
                    url: tokenUrl,
                    method: 'POST',
                    type: 'xml',
                    data: {
                        path: videoPath,
                        accessTokenType: ENV.authentication.ngToken.tokenType,
                        profile: site                        
                    }
                };
                if (FreePreview.isEnabled()) {
                    reqOpts.data.accessToken = ENV.preview.eventBased.accessToken;
                    reqOpts.data.accessTokenType = ENV.preview.eventBased.accessTokenType;
                    reqOpts.data.networkId = ENV.preview.eventBased.networkId;
                } else {
                    reqOpts.data.mvpd = mediaToken.mvpdId;
                    reqOpts.data.accessToken =  mediaToken.token;
                }

                return request(reqOpts, function onTokenServiceResponse(err, data, res) {
                    // Verify.
                    if (!err && !data) {
                        err = 'No data';
                    }

                    // Sanitize.
                    if (!err && data) {
                        try {
                            var errorNode = data.querySelector('error');
                            if (errorNode) {
                                // failure
                                var errorCodeNode = errorNode.querySelector('code');
                                var errorCode = errorCodeNode.textContent;
                                var errorMsgNode = errorNode.querySelector('msg');
                                var errorMsg = errorMsgNode.textContent;
                                var errorString = '' + (errorCode || '0') + ' ' + (errorMsg || 'Unknown error');
                                err = data = errorString;
                            }
                            else {
                                // success
                                var tokenNode = data.querySelector('token');
                                data = tokenNode.textContent;
                            }
                        }
                        catch (e) {
                            logger.error('Failed to parse token service response', e.message);
                            err = 'Invalid data';
                        }
                    }

                    // Log.
                    if (err) {
                        logger.error('getCDNToken error:', err, JSON.stringify(res));
                    }
                    else {
                        logger.log('getCDNToken success:', data);
                    }

                    // Respond.
                    callback(err, data, res);
                });
            }

            var authNPoller = (function () {
                var period = 5000;  // 5 secs
                var timer = null;
                var req = null;
                var callback = null;
                var stopped = false;

                function reset() {
                    if (req) {
                        req.abort();
                        req = null;
                    }

                    if (timer) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                }

                function stop() {
                    stopped = true;
                    reset();
                    callback = null;
                }

                function onAuthNResponse(err, data, res) {
                    if (stopped) {
                        return stop();
                    }

                    if (err && (err.code === NOT_AUTHENTICATED_ERROR || err.code === AUTHENTICATION_EXPIRED_ERROR)) {
                        // keep polling while not authenticated
                        return;
                    }

                    if (callback) {
                        callback(err, data, res);
                    }

                    stop();
                }

                function start(fn, secs) {
                    reset();

                    if (fn) {
                        callback = fn;
                        if (secs) {
                            period = secs * 1000;
                        }
                    }

                    console.log('making authN request');
                    stopped = false;
                    req = getAuthN(onAuthNResponse);
                    timer = window.setTimeout(start, period);
                }

                return ({
                    start: start,
                    stop: stop
                });
            }());


            return ({
                INIT_FAILURE: INIT_FAILURE_ERROR,
                REGCODE_FAILURE: REGCODE_FAILURE_ERROR,
                REGCODE_EXPIRED: REGCODE_EXPIRED_ERROR,
                NOT_AUTHENTICATED: NOT_AUTHENTICATED_ERROR,
                AUTHENTICATION_EXPIRED: AUTHENTICATION_EXPIRED_ERROR,
                AUTHENTICATION_FAILURE: AUTHENTICATION_FAILURE_ERROR,
                NOT_AUTHORIZED: NOT_AUTHORIZED_ERROR,
                NOT_SUBSCRIBED: NOT_SUBSCRIBED_ERROR,
                AUTHORIZATION_EXPIRED: AUTHORIZATION_EXPIRED_ERROR,
                AUTHORIZATION_FAILURE: AUTHORIZATION_FAILURE_ERROR,
                MEDIA_TOKEN_FAILURE: MEDIA_TOKEN_FAILURE_ERROR,
                CDN_TOKEN_FAILURE: CDN_TOKEN_FAILURE_ERROR,
                LOGOUT_FAILURE: LOGOUT_FAILURE_ERROR,

                isReady: isReady,
                init: init,
                login: login,
                getRegCode: getRegCode,
                // validateRegCode: validateRegCode,
                // clearRegCode: clearRegCode,
                // getMvpdList: getMvpdList,
                checkAuthN: checkAuthN,
                // getAuthNToken: getAuthNToken,
                checkAuthZ: checkAuthZ,
                // getAuthZToken: getAuthZToken,
                getMediaToken: getMediaToken,
                getAuthN: getAuthN,
                // getAuthZ: getAuthZ,
                logout: logout,
                getMvpdId: getMvpdId,
                getMvpdIdForAnalytics: getMvpdIdForAnalytics,
                getAdobeUserId: getAdobeUserId,
                // getCDNToken: getCDNToken,
                getPlayToken: getPlayToken,
                getMvpdConfigEntry: getMvpdConfigEntry,
                getMVPDs: getMVPDs,
                getPrimaryMVPDs: getPrimaryMVPDs,
                extractMvpdIds: MVPDConfig.extractMvpdIds,
                authNPoller: authNPoller
            });

        }());

        return AuthManager;
    }
})();
