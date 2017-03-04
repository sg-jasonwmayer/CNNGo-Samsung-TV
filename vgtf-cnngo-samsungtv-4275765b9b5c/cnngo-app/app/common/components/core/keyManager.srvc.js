'use strict';

angular.module('keyManager', []).service('keyManagerService', keyManagerService);

function keyManagerService($document, $rootScope, APP_CONSTANTS, EVENTS, ENV, KEY) {
    
    var historyCallbacks = [];
    var keyDownCallbacks = {};
    var keyUpCallbacks = {};
    var persistentKeyDownCallbacks = {};
    var persistentKeyUpCallbacks = {};
    
    $document[0].onkeydown = onKeyDown.bind(this); 
    $document[0].onkeyup = onKeyUp.bind(this);
    
    this.registerKeys = registerKeys;
    this.registerKeyCallbackHandler = registerKeyCallbackHandler;
    this.resetKeyCallbackHandler = resetKeyCallbackHandler;
    this.setKeyCallbackHandler = setKeyCallbackHandler;
    this.setPersistentKeyCallbackHandler = setPersistentKeyCallbackHandler;
    this.unsetKeyCallbackHandler = unsetKeyCallbackHandler;
    this.unsetPersistentKeyCallbackHandler = unsetPersistentKeyCallbackHandler;
    this.pushHistoryCallback = pushHistoryCallback;
    this.popHistoryCallback = popHistoryCallback;
    this.updateHistoryCallback = updateHistoryCallback;
    this.flushHistoryCallback = flushHistoryCallback;


    function registerKeys() {
        KEY.registerKeys.forEach(
            function (key) {
                tizen.tvinputdevice.registerKey(key.keyName);
            }
        );        
    }
    
    function registerKeyCallbackHandler() {
        KEY.allKeys.forEach(
            function (key) {
                keyDownCallbacks[key.keyName] = null;
                keyUpCallbacks[key.keyName] = null;
            }
        );
    }
    
    function resetKeyCallbackHandler() {
        registerKeyCallbackHandler();
        keyDownCallbacks[KEY.keyName.BACK] = backKeyHandler;
    }
    
    function setKeyCallbackHandler(keyList, keyHandler, isUpHandler) {
        if( typeof keyList === 'string' ) {
            keyList = [ keyList ];
        }
        
        keyList.forEach(
            function (key) {
                if(isUpHandler === true){
                    keyUpCallbacks[key] = keyHandler;
                }
                else {
                    keyDownCallbacks[key] = keyHandler;
                }
            }
        );
    }

    function setPersistentKeyCallbackHandler(keyList, keyHandler, isUpHandler) {
        if( typeof keyList === 'string' ) {
            keyList = [ keyList ];
        }
        
        keyList.forEach(
            function (key) {
                if(isUpHandler === true){
                    persistentKeyUpCallbacks[key] = keyHandler;
                }
                else {
                    persistentKeyDownCallbacks[key] = keyHandler;
                }
            }
        );
    }

    function unsetKeyCallbackHandler(keyList, isUpHandler) {
        if( typeof keyList === 'string' ) {
            keyList = [ keyList ];
        }
        
        keyList.forEach(
            function (key) {
                if(isUpHandler === true){
                    keyUpCallbacks[key] = null;
                }
                else {
                    keyDownCallbacks[key] = null;
                }
            }
        );
    }

    function unsetPersistentKeyCallbackHandler(keyList, isUpHandler) {
        if( typeof keyList === 'string' ) {
            keyList = [ keyList ];
        }
        
        keyList.forEach(
            function (key) {
                if(isUpHandler === true){
                    persistentKeyUpCallbacks[key] = null;
                }
                else {
                    persistentKeyDownCallbacks[key] = null;
                }
            }
        );
    }
       
    function pushHistoryCallback(handler) {
        if(typeof handler !== 'undefined' && handler !== null) {
            historyCallbacks.push(handler);
        }
    }
     
    function popHistoryCallback() {
        if (historyCallbacks.length > 0) {
            return historyCallbacks.pop();
        }
        else {
            console.log('History stack is empty');
        }
    }
    
    function peepHistoryCallback() {
        if (historyCallbacks.length > 0) {
            return historyCallbacks[historyCallbacks.length - 1];
        }
    }
    
    function updateHistoryCallback(checkCallback) {
        var callback = peepHistoryCallback();
        if(typeof callback !== 'undefined' && callback !== null) {
            if(callback === checkCallback) {
                popHistoryCallback();
            }
        }
    }
    
    function backKeyHandler() {
        var callback = popHistoryCallback();
        if(typeof callback !== 'undefined' && callback !== null) {
            callback();
        }
        else {
            $rootScope.$broadcast(EVENTS.triggerExit);
        }
    }
    
    function flushHistoryCallback() {
        
    }
    
    function onKeyDown(e) {
        var key = KEY.allKeys.filter(function ( keyObj ) {
            return keyObj.keyCode === e.keyCode;
        })[0];

        if(typeof key !== 'undefined') {
            var callback = persistentKeyDownCallbacks[key.keyName] || keyDownCallbacks[key.keyName];
            
            if(typeof callback !== 'undefined' && callback !== null) {
                callback();
            }
            else {
                console.log('Key Down callback is not defined');
            }
        }
    }

    function onKeyUp(e) {
        var key = KEY.allKeys.filter(function ( keyObj ) {
            return keyObj.keyCode === e.keyCode;
        })[0];

        if(typeof key !== 'undefined') {
            var callback = persistentKeyUpCallbacks[key.keyName] || keyUpCallbacks[key.keyName];
            
            if(typeof callback !== 'undefined' && callback !== null) {
                callback();
            }
            else {
                console.log('Key Up callback is not defined');
            }
        }
    }

}