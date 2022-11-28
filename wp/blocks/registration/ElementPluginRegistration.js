import Wprr from "wprr/Wprr";
import React from "react";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceHolder from "wprr/reference/ReferenceHolder";
import EditPostDataStorage from "wprr/wp/blocks/EditPostDataStorage";

import TextManager from "wprr/textmanager/TextManager";
import StoreController from "wprr/store/StoreController";

// import ElementPluginRegistration from "wprr/wp/blocks/registration/ElementPluginRegistration";
export default class ElementPluginRegistration {
	
	constructor() {
		//console.log("wprr/wp/blocks/registration/ElementPluginRegistration::constructor");
		
		this._clientId = "not-set";
		
		this._element = null;
		this._moreMenuElement = Wprr.text(Wprr.sourceReference("plugin/title"));
		
		this._registrationData = new Object();
		this._sidebarProps = new Object();
		this._moreMenuProps = new Object();
		
		this._registrationData["render"] = this.render.bind(this);
		
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
	
	setupRegistration(aSlug, aTitle, aIcon) {
		
		this._clientId = aSlug;
		this._sidebarProps["title"] = aTitle;
		this._sidebarProps["name"] = aSlug;
		
		this._moreMenuProps["target"] = aSlug;
		
		this._registrationData["icon"] = aIcon;
		
		return this;
	}
	
	getRegistrationData() {
		return this._registrationData;
	}
	
	getReferenceHolderForPlugin(aClientId) {
		
		if(!this._referenceHolders[aClientId]) {
			let referenceHolder = new ReferenceHolder();
			let externalStorage = EditPostDataStorage.create();
			
			referenceHolder.addObject("wprr/editPost/externalStorage", externalStorage);
			
			referenceHolder.addObject("redux/store", this._store);
			referenceHolder.addObject("redux/store/mRouterController", this._storeController);
			referenceHolder.addObject("redux/store/wprrController", this._storeController);
			
			referenceHolder.addObject("wprr/textManager", this._textManager);
			referenceHolder.addObject("wprr/adminData", wprrAdminData);
			
			this._referenceHolders[aClientId] = referenceHolder;
		}
		return this._referenceHolders[aClientId];
	}
	
	render(aProps) {
		//console.log("wprr/wp/blocks/registration/ElementPluginRegistration::render");
		//console.log(aProps, this);
		
		let clientId = this._clientId;
		
		let referenceHolder = this.getReferenceHolderForPlugin(clientId);
		
		referenceHolder.addObject("plugin/title", this._sidebarProps["title"]);
		
		let PluginSidebar = wp.editPost.PluginSidebar;
		let PluginSidebarMoreMenuItem = wp.editPost.PluginSidebarMoreMenuItem;
		
		return React.createElement(React.Fragment, {},
			React.createElement(PluginSidebar, this._sidebarProps,
				React.createElement(ReferenceExporter, {"references": referenceHolder}, this._element)
			),
			React.createElement(PluginSidebarMoreMenuItem, this._moreMenuProps, 
				React.createElement(ReferenceExporter, {"references": referenceHolder}, this._moreMenuElement)
			),
		);
	}
}