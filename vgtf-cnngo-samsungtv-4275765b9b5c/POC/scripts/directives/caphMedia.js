angular.module('caph.media', ['caph.ui'], ['$provide', '$compileProvider', function($provide, $compileProvider) {
    $compileProvider.directive({
        caphMedia: ['$parse', '$document', function($parse, $document) {
            var CONSTANT = {
                FORWARD_INTERVAL : 15
            };
            function invokeMethod(media, index, method, param) {
                if (angular.isNumber(index)) {
                    media[index][method].apply(media[index], param);
                } else {
                    media.each(function() {
                        this[method].apply(this, param);
                    });
                }
            }

            function setProperty(media, index, property, value) {
                if (angular.isNumber(index)) {
                    media[index][property] = value;
                } else {
                    media.each(function() {
                        this[property] = value;
                    });
                }
            }

            function forEachProperty(media, index, property, callback) {
                if (angular.isNumber(index)) {
                    callback(media[index][property]);
                } else {
                    media.each(function() {
                        callback(this[property]);
                    });
                }
            }

            function forEachTextTracks(media, callback, index) {
                forEachProperty(media, index, 'textTracks', function(textTracks) {
                    for (var i = 0, length = textTracks.length; i < length; i++) {
                        callback(textTracks[i]);
                    }
                });
            }

            var document = $document[0], documentElement = document.documentElement;

            var isFullScreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
            var isFullScreen, requestFullScreen, exitFullScreen;

            if (isFullScreenEnabled) {
                ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'].some(function(property) {
                    if (document[property] !== undefined) {
                        isFullScreen = property;
                        return true;
                    }
                });

                ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].some(function(method) {
                    if (documentElement[method]) {
                        requestFullScreen = method;
                        return true;
                    }
                });

                ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'].some(function(method) {
                    if (document[method]) {
                        exitFullScreen = method;
                        return true;
                    }
                });
            }

            return {
                restrict: 'E',
                transclude: true,
                scope: true,
                controller: function($scope, $element, $attrs, $transclude) {
                    var media;
                    var originalStyle = {};
                    var isPlaying = false;

                    $scope.$watch($attrs.subtitle, function(subtitle){
                        if(subtitle === true){
                            this.subTitle(true);
                        } else {
                            this.subTitle(false);
                        }
                    }.bind(this));

                    function doFullScreen(callback) {
                        if (isFullScreenEnabled) {
                            callback($element[0]);
                        } else {
                            console.warn('Full-Screen API is not supported.');
                        }
                    }

                    $transclude(function(clone) {
                        $element.append(clone);

                        media = $element.find('video, audio');
                        media.on('abort error stalled suspend loadstart durationchange loadedmetadata loadeddata progress canplay canplaythrough ended pause play playing ratechange seeked seeking timeupdate volumechange waiting', function(event) {
                            switch(event.type){
                                case 'play':
                                case 'playing':
                                    isPlaying = true;
                                    break;
                                case 'pause':
                                case 'ended':
                                    isPlaying = false;
                                    break;
                            }
                            ($parse($attrs[$attrs.$normalize('on-' + event.type)]) || angular.noop)($scope, {$event: event});
                        });

                        forEachTextTracks(media, function(textTrack) {
                            textTrack.oncuechange = function(event) {
                                ($parse($attrs[$attrs.$normalize('on-' + event.type)]) || angular.noop)($scope, {$event: event});
                            };
                        });
                    });

                    $scope.$on('$destroy', function() {
                        $element.remove();
                    });

                    $element.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
                        if (document[isFullScreen]) {
                            this.style.display = 'block';
                            this.style.width = '100%';
                            this.style.height = '100%';
                        } else {
                            this.style.display = originalStyle.display;
                            this.style.width = originalStyle.width;
                            this.style.height = originalStyle.height;
                        }
                    });

                    ['load', 'play', 'pause'].forEach(function(method) {
                        this[method] = function(index) {
                            invokeMethod(media, index, method);
                        }
                    }, this);

                    this.togglePlay = function(index){
                        var methodType = isPlaying ? 'pause' : 'play';
                        invokeMethod(media, index, methodType);
                    };
                    this.restart = function(index){
                        setProperty(media, index, 'currentTime', 0);
                    };
                    this.rewind = function(index){
                        if (angular.isNumber(index)) {
                            setProperty(media, index, 'currentTime', media[index].currentTime - CONSTANT.FORWARD_INTERVAL);
                        } else {
                            media.each(function(i) {
                                setProperty(media, i, 'currentTime', media[i].currentTime - CONSTANT.FORWARD_INTERVAL);
                            });
                        }
                    };
                    this.forward = function(index){
                        if (angular.isNumber(index)) {
                            setProperty(media, index, 'currentTime', media[index].currentTime + CONSTANT.FORWARD_INTERVAL);
                        } else {
                            media.each(function(i) {
                                setProperty(media, i, 'currentTime', media[i].currentTime + CONSTANT.FORWARD_INTERVAL);
                            });
                        }
                    };
                    this.next = function(index){
                        if (angular.isNumber(index)) {
                            setProperty(media, index, 'currentTime', media[index].duration);
                        } else {
                            media.each(function(i) {
                                setProperty(media, i, 'currentTime', media[i].duration);
                            });
                        }
                    };

                    ['autoplay', 'controls', 'currentTime', 'loop', 'mediaGroup', 'muted', 'playbackRate', 'preload', 'src', 'volume'].forEach(function(property) {
                        this[$attrs.$normalize('set-' + property)] = function(value, index) {
                            setProperty(media, index, property, value);
                        }
                    }, this);

                    this.subTitle = function(show, language, index) {
                        forEachTextTracks(media, function(textTrack) {
                            if (show && (!language || language === textTrack.language)) {
                                textTrack.mode = 'showing';
                            } else {
                                textTrack.mode = 'hidden';
                            }
                        }, index);
                    };

                    this.requestFullScreen = function() {
                        doFullScreen(function(element) {
                            originalStyle.display = element.style.display;
                            originalStyle.width = element.style.width;
                            originalStyle.height = element.style.height;

                            element[requestFullScreen]();
                        });
                    };

                    this.exitFullScreen = function() {
                        doFullScreen(function() {
                            document[exitFullScreen]();
                        });
                    };

                    this.isFullScreen = function() {
                        return document[isFullScreen];
                    };

                    this.toggleFullScreen = function() {
                        if (this.isFullScreen()) {
                            this.exitFullScreen();
                        } else {
                            this.requestFullScreen();
                        }
                    };
                }
            };
        }],
        caphMediaControls: [function() {
            return {
                restrict: 'E',
                require: '^caphMedia',
                transclude: true,
                link: function($scope, $element, $attrs, controller, $transclude) {
                    $scope.controls = controller;
                    $transclude(function(clone) {
                        $element.append(clone);
                    });
                }
            };
        }]
    });
}]);