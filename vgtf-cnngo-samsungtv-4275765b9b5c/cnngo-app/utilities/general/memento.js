/**
 * Service to wrap logging for the application. Currently just logs to the console.
 *
 * @class MementoService
 *
 * @requires $log
 * @requires $rootScope
 *
 * @ngInject
 */
function MementoService($log, $rootScope) {
    'use strict';

    var format;


    /**
     * Formats a string.  This does not beloing inside MementoService.
     *
     * @param args
     *
     * @private
     */
    format = function format(args) {
        var data,
            length = args.length,
            i,
            objects = [],
            response,
            x;

        if (typeof args[0] !== 'string') {
            for (i = 0; i < length; i++) {
                objects.push(args[i]);
            }

            response = objects.join(' ');
        } else {
            i = 1;
            data = args[0];
            response = data.replace(/%[sdj%]/g, function(match) {
                if (match === '%') {
                    return '%';
                }

                if (i >= length) {
                    return match;
                }

                switch (match) {
                    case '%s':
                        return String(args[i++]);

                    case '%d':
                        return Number(args[i++]);

                    case '%j':
                        try {
                            return JSON.stringify(args[i++]);
                        } catch (error) {
                            return '[Circular]';
                        }

                    default:
                        return match;
                }
            });

            for (x = args[i]; i < length; x = args[++i]) {
                response += ' ' + x;
            }
        }

        return response;
    };

    /**
     * @ngdoc function
     * @name CNNgo.service:MementoService#debug
     * @methodOf CNNgo.service:MementoService
     *
     * @description
     * Reports info level data.
     */
    this.info = function() {
        var message = format(arguments);
        $log.info(message);
        /* loggly.info(message); */
    };

    /**
     * @ngdoc function
     * @name CNNgo.service:MementoService#debug
     * @methodOf CNNgo.service:MementoService
     *
     * @description
     * Reports debug level data.
     */
    this.debug = function() {
        if ($rootScope.debug) {
            var message = format(arguments);
            $log.log('CNNGO Debug: ' + message);
            /* loggly.debug(message); */
        }
    };

    /**
     * @ngdoc function
     * @name CNNgo.service:MementoService#error
     * @methodOf CNNgo.service:MementoService
     *
     * @description
     * Reports error level data.
     */
    this.error = function() {
        var message = format(arguments);
        $log.error('CNNGO Error: ' + message);
        /* loggly.error(message); */
    };

    /**
     * @ngdoc function
     * @name CNNgo.service:MementoService#warn
     * @methodOf CNNgo.service:MementoService
     *
     * @description
     * Reports warn level data.
     */
    this.warn = function() {
        var message = format(arguments);
        $log.warn('CNNGO Warning: ' + message);
        /* loggly.error(message); */
    };
}

angular
    .module('app.utilities')
    .service('MementoService', MementoService);


