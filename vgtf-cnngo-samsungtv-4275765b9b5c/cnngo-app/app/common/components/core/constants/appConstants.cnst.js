(function() {
    'use strict';

    angular.module('appConstants', []).constant('APP_CONSTANTS', {
        platform : {
            emulator: 'emulator',
            tizen2015: 'tizen2015',
            tizen2016: 'tizen2016',
            tizen2017: 'tizen2017'
        },
        globalNavigationItems : {
        	 splash : {
                 id : 'splash',
                 defaultName : 'Splash',
                 state : 'main.splash'
             },
            featured : {
                id : 'featured',
                defaultName : 'Featured',
                state : 'main.featured'
            },
            category : {
                id : 'category',
                defaultName : 'Category',
                state : 'main.featured.category'
            },
            live : {
                id : 'live',
                defaultName : 'Live TV',
                state : 'main.live'
            },
            shows : {
                id : 'shows',
                defaultName : 'Shows',
                state : 'main.shows'
            },
            settings : {
                id : 'settings',
                defaultName : 'Settings',
                state : 'main.settings'
            }
        },
        navigationDepth : {
            featured : 1,
            settings : 3,
            live : 4,
            shows : 5,
            informationModal : 6,
            categories : 7,
            playerControls: 8,
	        modalSignin : 9,
            exitModal : 11
        },
        sliderTimer : {
            autoRecede: 15000,
            header : 1000,
            mainContent : 1000
        },
        liveChannel : {
            CNND: 'cnnd',
            CNNI : 'cnni',
            HLN : 'hln'
        },
        modals: {
            signIn: "signIn",
            informationModal: "informationModal",
            exitModal: "exitModal"
        },
        wrapLimit : {
            playList: 4,
            playListLive: 3,
            playListSeries: 6,
            playListCategories: 4   
        }
    });
})();
