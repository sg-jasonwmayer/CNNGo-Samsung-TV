(function(){
    angular
    .module('app.utilities')
    .service('modalControllerService', function($rootScope, $compile, focusController){

        /**
         * This is the id of the html element that will contain all of the modal data.
         */
        var modalContainerId = null;

        /**
         * This is a reference for the scope of the currently open modal.
         */
        var childScope = null;

        /**
         * This is the id of the currently open modal window.
         */
        var openModalId = null;

        /**
         * Default options object used for making sure any properties not provided bu the user are set to an appropriate valie.
         */
        var defaultOptions = {
            modalElementId: null,
            classes: "",
            directiveTagName: "",
            directiveAttributes: "",
            openCallback: null,
            closeCallback: null
        };

        /**
         * Default html template for injecting modals into the modal container.
         */
        var modalTemplate = '<div id="{modalElementId}" class="{modalElementId} {classes} modal">' +
                            '<{directiveTagName} {directiveAttributes}><{directiveTagName}/>' +
                            '</div>';

        /**
         * The objects in this array should contain the following properties
         * 
         * Parameters
         * 
         * Id: A unique id for a modal
         * modalElementId: (optional) This is the id of the outer most element of the modal (not the container of all the modals)
         * classes: (optional) This is a string representing a space delimited list of class names to add to the html template.
         * directiveTagName: (optional) Tag name of the directive for the modal.
         * directiveAttributes: (optional) A string representing any custom attributes needed on the directive tag
         * modalTemplate: (optional) A string with the html template of the modal. This can be used to overried the default modal template.
         * openCallback: (optional) Function to be called when modal is opened.
         * closeCallback: (optional) Function to be called when modal is closed.
         */
        var modalList = [];

        /**
         * Private method for service to get modals from the modal list.
         * 
         * Parameters
         * 
         * modalId: unique identifier of the modal in the modal list.
         */
        function getModal(modalId){
            var modal = null;
            for(var i = 0; i < modalList.length; i++){
                if(modalList[i].Id == modalId){
                    modal = modalList[i];
                    break;
                }
            }
            return modal;
        }

        /**
         * This method takes in a modal object and returns a string representing an html relresentation of the modal for injection into the DOM
         * 
         * Parameters
         * 
         * modalObject: Object representing the modal to be used in the template inflation process.
         */
        function inflateModalTemplate(modalObject){
            var inflatedTemplate = modalObject.modalTemplate || modalTemplate;
            var modalProperties = Object.keys(modalObject);
            for(var i = 0; i < modalProperties.length; i++){
                var term = '{' + modalProperties[i] + '}';

                var regex = new RegExp(term, 'g');

                inflatedTemplate = inflatedTemplate.replace(regex, modalObject[modalProperties[i]]);
            }
            return inflatedTemplate;
        }

        /**
         * This method is used to destroy the currently open modal. In preperation of opening another modal.
         */
        function destroyCurrentModal(){
            if(childScope != null){
                childScope.$destroy();
                childScope = null;
            }
            $("#"+modalContainerId).empty();
            openModalId = null;
        }

        /**
         * This function initilizes the modal service
         * 
         * Parameters
         * 
         * _modalContainerId: Id of the outer most container of the modal elements in the app.
         * _modalList: (optional) List of objects described above that represent each modal.
         * 
         * Example Usage
         *  
         *   modalService.init("modalContainer", [
         *       {
         *           Id: "signIn",
         *           directiveTagName: "sign-in",
         *           directiveAttributes: "is-stand-alone=\"true\"",
         *           openCallback: null,
         *           closeCallback: null
         *       },
         *       {
         *           Id: "informationModal",
         *           directiveTagName: "information-modal",
         *           openCallback: null,
         *           closeCallback: null
         *       }
         *   ]);
         */
        this.init = function(_modalContainerId, _modalList){
            modalContainerId = _modalContainerId;
            for(var i = 0; i < _modalList.length; i++){
                this.addModal(_modalList[i]);
            }            
        }	    
        
        /**
         * This method is used to add additional modals to the controller
         * 
         * Parameters
         * 
         * modalObject: Object representing the modal to be used in the template inflation process.
         */
        this.addModal = function(modalObject){
            var doesExist = (getModal(modalObject.Id) != null);
            if(doesExist === false){
                var options = $.extend({}, defaultOptions, modalObject);
                if(options.modalElementId == null){
                    options.modalElementId = modalObject.Id + "ModalContainer";
                }
                modalList.push(options);
            } else {
                throw "Cannot add modal because a modal already exists with this id.", modalObject.Id;
            }
        }
        
        /**
         * This method is used to remove a modal from the controller as well as from the DOM
         * 
         * Parameters
         * 
         * modalId: This is the id of the modal object to be removed. This refers to the id on the modal object and not the html element containing it.
         */
        this.removeModal = function(modalId){
            for(var i = 0; i < modalList.length; i++){
                if(modalList[i].Id == modalId){
                    //Close the modal just incase its open.
                    this.closeModal(modalId);
                    var modal = modalList[i];
                    $("#"+modal.modalElementId).remove();
                    modalList.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * This method is used to open a modal
         * 
         * Parameters
         * 
         * modalId: This is the id of the modal object to be removed. This refers to the id on the modal object and not the html element containing it.
         * data: (optional) Any data that needs to be passed along to the openCallback of the modal.
         */
        this.showModal = function(modalId, data){
            if(openModalId != null){
                this.closeModal(modalId);
            }
            var modal = getModal(modalId);
            if(modal != null){
                childScope = $rootScope.$new();
                $rootScope.preSignInModalFocusState = {
                    element: focusController.getCurrentFocusItem(),
                    depth: focusController.getCurrentDepth(),
                    group: focusController.getCurrentGroup()
                }
                var modalView = $compile(inflateModalTemplate(modal))(childScope);

                $("#"+modalContainerId).append(modalView);
                $("#"+modalContainerId).removeClass("hidden");
                var timeout = setTimeout(function(){

                    if(modal.openCallback != null){
                        modal.openCallback(data);
                    }
                    clearTimeout(timeout);
                }, 250);
                openModalId = modalId;
            }
        }

        /**
         * This method is used to close a modal.
         * 
         * Parameters
         * 
         * modalId: This is the id of the modal object to be removed. This refers to the id on the modal object and not the html element containing it.
         * data: (optional) Any data that needs to be passed along to the closeCallback of the modal.
         */
        this.closeModal = function(modalId, data){
            var modal = getModal(modalId)
            if(modal != null && openModalId == modalId){
                $("#"+modalContainerId).addClass("hidden");
                if(modal.closeCallback != null){
                    modal.closeCallback(data);
                }
                if($rootScope.preSignInModalFocusState !== undefined){
                    focusController.setDepth($rootScope.preSignInModalFocusState.depth, $rootScope.preSignInModalFocusState.group);
                    focusController.focus($rootScope.preSignInModalFocusState.element);
                    delete $rootScope.preSignInModalFocusState;
                }
                destroyCurrentModal();
            }
        }
    });
})();