/**
 * @module CNNgoApp
 * DEVELOPED BY JASON MAYER STUDIO ™ √
 * @requires ui.router
 */
var app = angular.module('CNNgoApp', [
            'splash',
            'main',
            'player',
            'appData',
            'appFilters',
            'ui.router',
            'globalNavigation',
            'appConstants',
            'caph.ui',
            'featured',
            'keyManager',
            'settingsNavigation',
            'app.utilities',
            'category',
            'shows',
            'settings',
            'signIn',
            'analytics',
            'live',
            'informationModal',
            'playerControls',
            'exitModal'
        ])
        .config(config);

function config($stateProvider, $urlRouterProvider, focusControllerProvider, keyManagerServiceProvider) {
    // Register remote keys
    keyManagerServiceProvider.$get().registerKeys();
    
    // Setup Key Handler
    keyManagerServiceProvider.$get().registerKeyCallbackHandler();
    
    // Set intial focus depth
    focusControllerProvider.setInitialDepth(1);

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('main', {
        url : '/',
        views : {
            'main' : {
                templateUrl : 'app/common/components/main/main.tmpl.html',
                controller : 'mainController'
            }
        }
     }).state('main.featured', {
        url : '/featured',
        resolve: {
            pageData: getFeaturedData,
            categoriesListData: getCategoriesListData
        },
        views : {
            'content@main' : {
                templateUrl : 'app/components/featured/featured.tmpl.html',
                controller : 'featuredController'
            }
        },
        params: {
            previousFocusId : null
        }
    }).state('main.shows', {
        url: '/shows',
        resolve : {
          showsData : getShowsData
        },
        views: {
           'content@main': {
              templateUrl: 'app/components/shows/shows.tmpl.html',
              controller: 'showsController'
           }
        }
    }).state('main.featured.category', {
        url : '/:category',
        resolve : {
            categoryData: getCategoryData
        },
        views : {
            'content@main' : {
                templateUrl : 'app/components/category/category.tmpl.html',
                controller : 'categoryController'
            }
         }
    }).state('main.live', {
        url : '/live',
        views : {
            'content@main' : {
                templateUrl : 'app/components/live/live.tmpl.html',
                controller : 'liveController'
            }
        }
    }).state('main.search', {
        url : '/search',
        views : {
            'content@main' : {
                templateUrl : 'app/components/search/search.tmpl.html'
            }
        }
    }).state('main.settings', {
        url : '/settings',
        views : {
            'content@main' : {
                templateUrl : 'app/components/settings/settings.tmpl.html',
                controller : 'settingsController'
            }
        }
    }).state('main.settings.accessibility', {
        url : '/MyCnn',
        templateUrl : 'app/components/settings/accessibility/accessibility.tmpl.html'
    }).state('main.settings.privacyPolicy', {
        url : '/privacyPolicy',
        templateUrl : 'app/components/settings/privacyPolicy/privacyPolicy.tmpl.html'
    }).state('main.settings.signIn', {
        url : '/signIn',
        templateUrl : 'app/components/settings/signIn/signIn.tmpl.html',
        controller: 'signInController',
        onEnter: function($rootScope, EVENTS){
            $rootScope.$broadcast(EVENTS.onLoginPage);
        },
        onExit: function($rootScope, EVENTS){
            $rootScope.$broadcast(EVENTS.leftLoginPage);
        }
    }).state('main.settings.closedCaptioning', {
        url : '/closedCaptioning',
        templateUrl : 'app/components/settings/closedCaptioning/closedCaptioning.tmpl.html'
    }).state('main.settings.termsConditions', {
        url : '/termsConditions',
        templateUrl : 'app/components/settings/termsConditions/termsConditions.tmpl.html'
    });
};



function getFeaturedData(appDataService) {
    var promise = appDataService.getFeaturedData();
    return promise;
}

function getCategoriesListData(appDataService) {
    var promise = appDataService.getCategoriesListData();
    return promise;
}

function getShowsData(appDataService) {
    var promise = appDataService.getShowsData();
    return promise;   
}

function getCategoryData(appDataService, $stateParams){
    var promise = appDataService.getCategoryData($stateParams.category);
    return promise;
}

/**
 * Bootstrap the application
 * 
 */
 
angular.element(document).ready(function() {
    console.log('Document Ready');
    
    if (window.tizen === undefined) {
        console.log('This application needs to run on a Tizen device');
    }    
    
    console.log('Injecting necessary dependencies for config service module.');
    
    var initInjector = angular.injector(['ng', 'app.utilities']);
    var configService = initInjector.get('configService');
    
    configService.loadConfig().then(

      function success(response) {
          console.log(response, "success");
          //This creates a constant called ENV that will allow us to inject a config object into any module necessary.
          app.constant('ENV', response);
          console.log('Bootstrapping the app now.');
    //    setTimeout(function(){
              angular.bootstrap(document, [ 'CNNgoApp' ]);
    //    }, 2000);
            
      }, function loadLocalConfigError(error){
          console.log('Error loading local config | Application initialization failed: ', error);
    });
    
    
});
