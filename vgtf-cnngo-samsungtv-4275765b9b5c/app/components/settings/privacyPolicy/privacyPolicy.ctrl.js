(function() {
    'use strict';

    angular.module('privacyPolicy.controller', []).controller('privacyPolicy',
            privacyPolicyController);

    function privacyPolicyController($scope) {
      var Scrollbar = caph.require('stripe.ui.component.Scrollbar');

        caph.app.addScene('scrollScene', $class({
            $extends : caph.require('ui.base.Scene'),

            oncreate: function() {
                this.addChild(new Scrollbar({
                    direction: caph.ui.base.component.Scrollbar.VERTICAL,
                    currentThumbPosition: 150,
                    maxThumbPosition: 400,
                    sizeValue: 400,
                    step: 10,
                    position: [50, 30]
                }));

                this.addChild(new Scrollbar({
                    sizeValue: 300,
                    currentThumbPosition: 150,
                    maxThumbPosition: 300,
                    position: [50, 110]
                }));
            }
        })).run();

    }

})();



