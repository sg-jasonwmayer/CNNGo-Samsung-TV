angular
    .module('app.utilities')
    .service('TokenService', TokenService);

    /**
    *  Service to manage retreiving, updating, and managing authentication token. Also reports
    *  the following fields back to the token api:
    *
    *     accessCardId
    *     receiverId
    *     stbSoftwareVersion
    *     systemTime
    *     version
    *
    *  @class TokenService
    *
    *  @requires $q
    *  @requires $rootScope
    *  @requires UtilService
    *  @requires ENV
    *  @requires EVENTS
    *  @requires TimeService
    *  @requires MementoService
    *  @requires AuthManager
    *  @requires SystemMonitor
    *  @requires FreePreview
    *
    * @ngInject
    * */
    function TokenService($q, $rootScope, UtilService, ENV, EVENTS, TimeService, MementoService, AuthManager, SystemMonitor/*, FreePreview*/) {
        'use strict';
        var _token = null,
            _tokenExpireTime = 0,
            _tokenTimeOffset = 2 * 60 * 1000, //Two minutes
            _tokenFetchTimer = undefined;

        $rootScope.$on(EVENTS.authNSuccess, function () { 
            setTimeout(_getAndUpdateToken, 500) 
        });

        return {
            getToken: _getCachedToken,
            getTokenUrlString: _getTokenUrlString,
            startTokenManagement: _manageToken
        };

        /**
         * Getter that other services use to access the raw token.
         *
         * @public
         *
         * @returns {String|null} Returns null only if we haven't gotten a token
         */
        function _getCachedToken() {
            return _token;
        };

        /**
         * Getter that other services use to access a stringified version of the access token. If isFirst
         * is true, the string represents the first param in a URL string and appends ?ngt=. Otherwise we assume
         * it is not our first URL param and append &ngt=
         *
         * @public
         *
         * @param  {Boolean} isFirst Represents if this is our first param in the to-be crafted URL string
         * @return {String}
         */
        function _getTokenUrlString(isFirst) {
            _manageToken();
            var key = (isFirst) ? '?ngt=' : '&ngt=';
            return key + _token;
        };

        function _manageToken() {
            if (_token !== null) {
                return; // management has already started.
            }

            _getAndUpdateToken();
        };

        function _getAndUpdateToken() {
            try {
                if (_tokenFetchTimer) {
                    clearTimeout(_tokenFetchTimer);
                    _tokenFetchTimer = undefined;
                }

                if (TimeService.getCurrentTime() + _tokenTimeOffset >= _tokenExpireTime) {
                    _getNgToken()
                        .then(function (tokenRes) {
                            var data = tokenRes.auth;
                            _token = data.ngtv_token;
                            _tokenExpireTime = parseInt(data.token_ts) + parseInt(data.token_ttl);

                            if (_token) {
                                $rootScope.$broadcast(EVENTS.ngTokenAcquired);
                            }
                        })
                        .catch(function (err) {
                            MementoService.error(err);
                        });
                }
            } finally {
                _tokenFetchTimer = setTimeout(_getAndUpdateToken, ENV.authentication.ngToken.refreshTimeInMillis);
            }
        }

        function _getNgToken() {
            var NGTokenStart,
                NGTokenEnd,
                NGTokenDuration;            
            var mvpd = AuthManager.getCurrentMvpd();

            if (!mvpd /*&& !FreePreview.isEnabled()*/) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject(new Error('No mvpd was found.'));
                });
                return deferred.promise;
            }

            // We are authed, get a media token
            NGTokenStart = new Date().getTime();
            return _getMediaToken().then(_grabNgToken);/*!FreePreview.isEnabled() ? _getMediaToken().then(_grabNgToken) : _grabNgToken();*/

            function _grabNgToken(mediaToken) {
                var deferred = $q.defer(),
                    url = ENV.authentication.ngToken.urlTemplate,
                    opts = {
                        fname: ENV.authentication.ngToken.fname,
                        tokenType: ENV.authentication.ngToken.tokenType,                        
                    };
//                    if (FreePreview.isEnabled()) {
//                        opts.accessToken = ENV.preview.eventBased.accessToken;
//                        opts.tokenType = ENV.preview.eventBased.accessTokenType;
//                        opts.networkId = ENV.preview.eventBased.networkId;
//                        url = ENV.authentication.ngToken.urlTemplateAlt;
//                    } else {
                        opts.flist = mvpd.featureList.text;
                        opts.fsig = mvpd.featureList.signature;
                        opts.accessToken = encodeURIComponent(mediaToken.token)
//                    }


                url = UtilService.replacePattern(opts, url);
                UtilService.getJsonUrlSync(url, 
                    function _tokenSuccess(response) {
                        deferred.resolve(response);
                    }, function _tokenFailure(err) {
                        NGTokenEnd = new Date().getTime();
                        NGTokenDuration = (NGTokenEnd - NGTokenStart) / 1000; 
                        SystemMonitor.retrieveAdobeTokenComplete('NGTKhi003', false, NGTokenDuration, err);
                        deferred.reject(err);
                    }, null);

                return deferred.promise;
            }
            
        };

        function _getMediaToken() {
            var deferred = $q.defer();
            AuthManager.getMediaToken(ENV.authentication.ngToken.tokenId, 
                function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(data);
                    }
                });

            return deferred.promise;
        };

    };