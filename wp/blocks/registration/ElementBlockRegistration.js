import React from "react";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceHolder from "wprr/reference/ReferenceHolder";
import AttributeDataStorage from "wprr/wp/blocks/AttributeDataStorage";

import TextManager from "wprr/textmanager/TextManager";
import StoreController from "wprr/store/StoreController";

// import ElementBlockRegistration from "wprr/wp/blocks/registration/ElementBlockRegistration";
export default class ElementBlockRegistration {
	
	constructor() {
		//console.log("wprr/wp/blocks/registration/ElementBlockRegistration::constructor");
		
		this._element = null;
		this._registrationData = new Object();
		this._registrationData["attributes"] = new Object();
		
		this._componentName = null;
		
		/*
		this._registrationData["getEditWrapperProps"] = function( attributes ) {
			return { 'data-align': "wide", 'data-resized': false };
		};
		*/
		
		this._registrationData["edit"] = this.edit.bind(this);
		this._registrationData["save"] = this.save.bind(this);
		
		this.addAttribute("componentData", "object");
		this.addAttribute("adminData", "object");
		
		this._textManager = new TextManager();
		this._storeController = new StoreController();
		
		this._store = this._createReduxStore(wprrAdminData);
		this._storeController.setStore(this._store);
		this._storeController.setUser(wprrAdminData.userData);
		
		this._referenceHolders = new Object();
	}
	
	_addReducers() {
		
		let storeController = this._storeController;
		
		storeController.addDynamicReducer(storeController.createLocalReducer("mRouter", storeController.reduce));
		storeController.addDynamicReducer(storeController.createLocalReducer("settings", storeController.reduceSettings));
		storeController.addDynamicReducer(storeController.createLocalReducer("globalVariables", storeController.reduceGlobalVariables));
	}
	
	_createReduxStore(aConfigurationData) {
		
		let initialState = {
			"mRouter": {
				
			},
			"settings": {
				"wpApiUrlBase": aConfigurationData.restApiBaseUrl
			}
		};
		this._storeController.getUrlResolvers().addBasePath("default", aConfigurationData.restApiBaseUrl);
		
		this._addReducers();
		return createStore(
			this._storeController.dynamicReduceBound,
			initialState,
			compose(
				applyMiddleware(thunk)
			)
		);
	}
	
	setElement(aElement) {
		this._element = aElement;
		
		return this;
	}
	
	setComponent(aName) {
		this._componentName = aName;
		
		return this;
	}
	
	setupRegistration(aTitle, aIcon, aCategory) {
		
		this._registrationData["title"] = aTitle;
		this._registrationData["icon"] = aIcon;
		this._registrationData["category"] = aCategory;
		
		return this;
	}
	
	addAttribute(aName, aType = "string") {
		this._registrationData["attributes"][aName] = {
			"type": aType,
		};
		
		return this;
	}
	
	getRegistrationData() {
		return this._registrationData;
	}
	
	getReferenceHolderForBlock(aClientId, aAttributes, aSetAttributes) {
		
		let blocksPrefix = "wprr/wpBlockEditor/";
		
		if(!this._referenceHolders[aClientId]) {
			let referenceHolder = new ReferenceHolder();
			let externalStorage = new AttributeDataStorage();
			
			referenceHolder.addObject(blocksPrefix + "externalStorage", externalStorage);
			
			referenceHolder.addObject("redux/store", this._store);
			referenceHolder.addObject("redux/store/mRouterController", this._storeController);
			referenceHolder.addObject("redux/store/wprrController", this._storeController);
			
			referenceHolder.addObject("wprr/textManager", this._textManager);
			
			this._referenceHolders[aClientId] = referenceHolder;
		}
		return this._referenceHolders[aClientId];
	}
	
	edit(aProps) {
		//console.log("wprr/wp/blocks/registration/ElementBlockRegistration::edit");
		//console.log(aProps, this);
		
		let clientId = aProps.clientId;
		let blocksPrefix = "wprr/wpBlockEditor/";
		
		let referenceHolder = this.getReferenceHolderForBlock(clientId, aProps.attributes, aProps.setAttributes);
		
		let externalStorage = referenceHolder.getObject(blocksPrefix + "externalStorage");
		externalStorage.setupAttributes(aProps.attributes, aProps.setAttributes);
		externalStorage.setPathPrefix("componentData");
		
		referenceHolder.addObject(blocksPrefix + "attributes", aProps.attributes);
		referenceHolder.addObject(blocksPrefix + "setAttributes", aProps.setAttributes);
		
		return React.createElement(ReferenceExporter, {"references": referenceHolder, "attributes": aProps.attributes}, this._element);
	}
	
	save(aProps) {
		//console.log("wprr/wp/blocks/registration/ElementBlockRegistration::save");
		//console.log(aProps);
		
		let componentData = JSON.stringify(aProps.attributes.componentData);
		if(componentData) {
			componentData = componentData.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
		}
		
		return React.createElement("div", {"data-expanded-content": "1", "data-wprr-component": this._componentName, "data-wprr-component-data": componentData});
	}
}