//Define config module
var configModule = angular.module('app.utilities')
	.service('configService', function($http, $q, $log){
	    var isDevMode = environmentName == 'dev';
	    var configData = null;
	    var deferred = $q.defer();
	    
		console.log('trying to get configuration.');
		
		function loadRemoteConfig(environment, version){
			console.log('attempting to load remote config.');
			var _confUrl = [
	            'http://data.cnn.com/jsonp/cnn-go/firetv', //TODO: use samsung tv config url.
	            environment,
	            version,
	            'config.json?callback=JSON_CALLBACK'
	          ].join('/');
	
	          $http.jsonp(_confUrl).then(
	            function success(response) {
	              readConfig(response.data.data[0], environment, version);
	            }, 
	            function configLoadError(error){
	              $log.info('Error loading cloud config: ', error.status + ' - ' + error.statusText, ' | Trying local config instead');
	              loadLocalConfig(environment); // Load local config if cloud load fails
	            }
	          ); 
		};
		
		function readConfig(config, env, version){
	      var value, 
	          cache,
	          environment = env,
	          config = config;
	
	      if (!cache) {
	          cache = config.base;
	          cache.environment = environment;
	          cache.appVersion = version;
	      }      
	      //setConfigData(cache);
	      deferred.resolve(cache);
	    };
	
	    // Load the local config file. 
	    function loadLocalConfig(env) {
	    	console.log('loading local config.');
		    $http.get('utilities/config/samtv_config.json').then(
		      function success(response) {
		        readConfig(response.data[0], env, 'NotDefined');
		      }, function loadLocalConfigError(error){
		        $log.info('Error loading local config | Application initialization failed: ', error);
		        deferred.reject('Error loading local config | Application initialization failed: ', error)
		    });
	    };
	   
	//    if(isDevMode === true){
	//    	console.log('Loading local config file.')
	//    	loadLocalConfig(environmentName)
	//    } else {
	//    	$http.get('config/version.json').then(
	//			function success(response) {          
	//	          loadRemoteConfig(environment, (!!response.data && !!response.data.version) ? response.data.version : null);
	//	        }, 
	//	        function configVersionError(error){      
	//	          $log.info('Error reading version file: ', error.status + ' - ' + error.statusText, ' | Load local config instead');
	//	          loadLocalConfig(environment); // Load local config if cloud load fails
	//	        }
	//    	);
	//    }
	    
	    
		this.loadConfig = function(){		
	//		return $http.get('config/samtv_config.json');
			if(isDevMode === true){
		    	console.log('Loading local config file.')
		    	loadLocalConfig(environmentName)
		    } else {
		    	$http.get('config/version.json').then(
					function success(response) {          
			          loadRemoteConfig(environment, (!!response.data && !!response.data.version) ? response.data.version : null);
			        }, 
			        function configVersionError(error){      
			          $log.info('Error reading version file: ', error.status + ' - ' + error.statusText, ' | Load local config instead');
			          loadLocalConfig(environment); // Load local config if cloud load fails
			        }
		    	);
		    }
			
			return deferred.promise;
		}
		this.getConfigData = function(){
			return configData;
		}
		this.setConfigData = function(data){
			configData = data;
			configModule.constant('ENV', data);
		}
});