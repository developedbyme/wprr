"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import objectPath from "object-path";

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import StoreController from "wprr/store/StoreController";
import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";
import TextManager from "wprr/textmanager/TextManager";

// import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";
export default class ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.ModuleCreatorBaseObject::constructor");
		
		this._wprrInstance = null;
		this._mainComponent = null;
		this._store = null;
		
		this._referenceHolder = new ReferenceHolder();
		this._storeController = new StoreController();
		
		this._urlResolvers = new MultipleUrlResolver();
		this._textManager = new TextManager();
	}
	
	setWprrInstance(aWprrInstance) {
		this._wprrInstance = aWprrInstance;
		
		return this;
	}
	
	/**
	 * Sets the class to use for creating classes
	 *
	 * @param	aClass	React.Component	The class to use for creatirn new modules.
	 *
	 * @return	self
	 */
	setClass(aClass) {
		this._mainComponent = React.createElement(aClass, {});
		
		return this;
	}
	
	getReferenceHolder() {
		return this._referenceHolder;
	}
	
	getTextManager() {
		return this._textManager;
	}
	
	getStoreController() {
		return this._storeController;
	}
	
	_addReducers() {
		this._storeController.addDynamicReducer(combineReducers({
			"mRouter": this._storeController.reduce,
			"settings": this._storeController.reduceSettings
		}));
	}
	
	_createReduxStore(aConfigurationData) {
		
		let initialState = {};
		if(aConfigurationData.fullStore) {
			initialState = aConfigurationData.fullStore;
		}
		else {
			//METODO: clean this up
			initialState = {
				"mRouter": {
					"currentPage": aConfigurationData.paths.current,
					"data": aConfigurationData.initialMRouterData.data,
					"apiData": aConfigurationData.initialMRouterData.apiData
				},
				"settings": {
					"homeUrl": aConfigurationData.paths.home,
					"sitePath": aConfigurationData.paths.site,
					"themePath": aConfigurationData.paths.theme,
					"wpApiUrlBase": aConfigurationData.paths.rest
				}
			};
		}
		
		this._addReducers();
		return createStore(
			this._storeController.dynamicReduceBound,
			initialState,
			compose(
				applyMiddleware(thunk)
			)
		);
	}
	
	_configureReferences(aData, aModuleData) {
		this._referenceHolder.addObject("redux/store", this._store);
		this._referenceHolder.addObject("redux/store/mRouterController", this._storeController);
		
		this._referenceHolder.addObject("wprr/userData", aData.userData);
		this._referenceHolder.addObject("wprr/settings", aData.settings);
		
		this._referenceHolder.addObject("wprr/moduleData", aModuleData);
		this._referenceHolder.addObject("wprr/textManager", this._textManager);
	}
	
	_configureModule(aHolderNode, aData, aModuleData) {
		//console.log("wprr/modulecreators/AppModuleCreator::_configureModule");
		//console.log(aHolderNode, aData, aModuleData);
		
		this._store = this._createReduxStore(aData);
		this._storeController.setStore(this._store);
		this._configureReferences(aData, aModuleData);
		
		let paths = aData.paths;
		if(paths) {
			for(let objectName in paths) {
				this._referenceHolder.addObject("wprr/paths/" + objectName, paths[objectName]);
			}
		}
		
		//METODO: change this to a local image loader
		if(this._wprrInstance && this._wprrInstance.imageLoaderManager) {
			this._wprrInstance.imageLoaderManager.setNamedSizes(aData.imageSizes);
			this._referenceHolder.addObject("wprr/imageLoaderManager", this._wprrInstance);
		}
		
		this._urlResolvers.setBasePaths(aData.paths);
	}
	
	_getMainCompnentWithInjections() {
		return this._mainComponent;
	}
	
	_getRootObject(aData) {
		
		let initialState = this._store.getState();
		
		let currentPath = objectPath.get(aData, "paths.current");
		let urlData = objectPath.get(initialState, "mRouter.data");
		
		let pageData = null;
		if(urlData[currentPath]) {
			pageData = urlData[currentPath].data;
		}
		
		let rootObject = React.createElement(Provider, {"store": this._store},
			React.createElement(ReferenceExporter, {"references": this._referenceHolder},
				React.createElement(ReferenceInjection, {"injectData": {"wprr/pageData": pageData}},
					this._getMainCompnentWithInjections()
				)
			)	
		);
		
		return rootObject;
	}
	
	getReactElement(aData, aModuleData) {
		this._configureModule(null, aData, aModuleData);
		
		let rootObject = this._getRootObject(aData);
		
		return rootObject;
	}
	
	/**
	 * Creates a new module
	 *
	 * aHolderNode	HTMLElement	The element to add the module to
	 * aData		Object		The confuguration data for the module
	 * aModuleData	Object		The dynamic data for just this module
	 */
	createModule(aHolderNode, aData, aModuleData, aAddMode = ModuleCreatorBaseObject.RENDER) {
		//console.log("oa.ModuleCreatorBaseObject::createModule");
		//console.log(aHolderNode, aData);
		
		this._configureModule(aHolderNode, aData, aModuleData);
		
		let rootObject = this._getRootObject(aData);
		
		if(aAddMode === ModuleCreatorBaseObject.HYDRATE) {
			return ReactDOM.hydrate(rootObject, aHolderNode);
		}
		return ReactDOM.render(rootObject, aHolderNode);
	}
	
	static create(aClass) {
		var newModuleCreatorBaseObject = new ModuleCreatorBaseObject();
		newModuleCreatorBaseObject.setClass(aClass);
		
		return newModuleCreatorBaseObject;
	}
}

ModuleCreatorBaseObject.RENDER = "render";
ModuleCreatorBaseObject.HYDRATE = "hydrate";