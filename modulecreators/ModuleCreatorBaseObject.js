"use strict";

import Wprr from "wprr/Wprr";
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
import RefGroup from "wprr/reference/RefGroup";
import DataStorage from "wprr/utils/DataStorage";
import WprrBaseObject from "wprr/WprrBaseObject";

// import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";
export default class ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ModuleCreatorBaseObject::constructor");
		
		this._wprrInstance = null;
		this._mainComponent = null;
		this._store = null;
		this._strictMode = false;
		this._usedMulitpleTimes = false;
		this.parseInitialContent = true;
		
		this._referenceHolder = new ReferenceHolder();
		this._storeController = new StoreController();
		
		this._urlResolvers = new MultipleUrlResolver();
		this._textManager = new TextManager();
		
		this._siteStorage = new DataStorage();
		
		this._project = null;
		this._siteNavigation = new Wprr.utils.navigation.SiteNavigation();
		
		
		this._siteDataLoader = new Wprr.utils.navigation.SiteDataLoader();
		this._siteNavigation.urlSource.addChangeCommand(Wprr.commands.setProperty(this._siteDataLoader.urlSource.reSource(), "value", this._siteNavigation.urlSource))
		
	}
	
	setWprrInstance(aWprrInstance) {
		this._wprrInstance = aWprrInstance;
		
		return this;
	}
	
	setProject(aProject) {
		
		this._project = aProject;
		
		this._siteDataLoader.setItems(this._project.items);
		
		return this;
	}
	
	get siteNavigation() {
		return this._siteNavigation;
	}
	
	get siteDataLoader() {
		return this._siteDataLoader;
	}
	
	/**
	 * Sets the class to use for creating classes
	 *
	 * @param	aClass	React.Component	The class to use for creatirn new modules.
	 *
	 * @return	self
	 */
	setClass(aClass) {
		this.setMainComponent(React.createElement(aClass, {}));
		
		return this;
	}
	
	setMainComponent(aElement) {
		this._mainComponent = aElement;
		
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
		
		let storeController = this._storeController;
		
		storeController.addDynamicReducer(storeController.createLocalReducer("mRouter", storeController.reduce));
		storeController.addDynamicReducer(storeController.createLocalReducer("settings", storeController.reduceSettings));
		storeController.addDynamicReducer(storeController.createLocalReducer("globalVariables", storeController.reduceGlobalVariables));
	}
	
	_createReduxStore(aConfigurationData) {
		
		let initialState = {};
		if(aConfigurationData.fullStore) {
			initialState = aConfigurationData.fullStore;
		}
		else {
			//METODO: clean this up
			
			let currentUrl = objectPath.get(aConfigurationData, "paths.current");
			let pageData = objectPath.get(aConfigurationData, "initialMRouterData.data");
			
			initialState = {
				"mRouter": {
					"currentPage": currentUrl,
					"data": pageData,
					"apiData": objectPath.get(aConfigurationData, "initialMRouterData.apiData")
				},
				"settings": {
					"homeUrl": objectPath.get(aConfigurationData, "paths.home"),
					"sitePath": objectPath.get(aConfigurationData, "paths.site"),
					"themePath": objectPath.get(aConfigurationData, "paths.theme"),
					"wpApiUrlBase": objectPath.get(aConfigurationData, "paths.rest")
				}
			};
			
			this._siteDataLoader.setupDataForUrl(document.location.href, pageData[currentUrl]["data"]);
		}
		
		let defaultPath = objectPath.get(initialState, "settings.wpApiUrlBase");
		if(defaultPath) {
			this._storeController.getUrlResolvers().addBasePath("default", defaultPath);
		}
		else {
			console.warn("No default API path set", this);
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
		//console.log("wprr/modulecreators/AppModuleCreator::_configureModule");
		//console.log(aHolderNode, aData);
		
		this._store = this._createReduxStore(aData);
		this._storeController.setStore(this._store);
		
		this._storeController.setUser(aData.userData);
		
		this._referenceHolder.addObject("redux/store", this._store);
		this._referenceHolder.addObject("redux/store/mRouterController", this._storeController);
		this._referenceHolder.addObject("redux/store/wprrController", this._storeController);
		
		this._referenceHolder.addObject("wprr/userData", aData.userData);
		this._referenceHolder.addObject("wprr/settings", aData.settings);
		
		this._referenceHolder.addObject("wprr/moduleData", aModuleData);
		this._referenceHolder.addObject("wprr/textManager", this._textManager);
	}
	
	_configureModule(aHolderNode, aData, aModuleData) {
		console.log("wprr/modulecreators/AppModuleCreator::_configureModule");
		console.log(aHolderNode, aData, aModuleData);
		
		this._store = this._createReduxStore(aData);
		this._storeController.setStore(this._store);
		this._configureReferences(aData, aModuleData);
		
		if(this._project) {
			this._project.setMainReferences(this._referenceHolder);
			this._referenceHolder.addObject("wprr/project", this._project);
			this._referenceHolder.addObject("wprr/projectName", this._project.name);
		}
		
		let paths = aData.paths;
		if(paths) {
			for(let objectName in paths) {
				this._referenceHolder.addObject("wprr/paths/" + objectName, paths[objectName]);
				this._referenceHolder.addObject("urlResolver/" + objectName, this._urlResolvers);
			}
			this._urlResolvers.setBasePaths(paths);
			this._storeController.getUrlResolvers().setBasePaths(paths);
		}
		
		//METODO: change this to a local image loader
		if(this._wprrInstance && this._wprrInstance.imageLoaderManager) {
			this._wprrInstance.imageLoaderManager.setNamedSizes(aData.imageSizes);
			this._referenceHolder.addObject("wprr/imageLoaderManager", this._wprrInstance.imageLoaderManager);
		}
	}
	
	_getMainCompnentWithInjections() {
		return this._mainComponent;
	}
	
	_getRootObject(aData) {
		
		let initialState = this._store.getState();
		
		let currentPath = objectPath.get(aData, "paths.current");
		let urlData = objectPath.get(initialState, "mRouter.data");
		
		let injectData = new Object();
		injectData["wprr/externalStorage/site"] = this._siteStorage;
		
		let pageData = null;
		if(urlData && urlData[currentPath]) {
			pageData = urlData[currentPath].data;
			injectData["wprr/pageData"] = pageData;
		}
		
		let rootObject = React.createElement(Provider, {"store": this._store},
			React.createElement(ReferenceExporter, {"references": this._referenceHolder},
				React.createElement(RefGroup, {"group": "site"},
					React.createElement(Wprr.ReferenceInjection, {"injectData": {"wprr/rawUrl": this._siteNavigation.urlSource, "wprr/pageItem": this._siteDataLoader.itemSource}}, 
						React.createElement(ReferenceInjection, {"injectData": injectData},
							this._getMainCompnentWithInjections()
						)
					)
				)
			)
		);
		
		if(this._strictMode) {
			rootObject = React.createElement(React.StrictMode, {}, rootObject);
		}
		
		return rootObject;
	}
	
	getReactElement(aData, aModuleData) {
		this._configureModule(null, aData, aModuleData);
		
		let rootObject = this._getRootObject(aData);
		
		return rootObject;
	}
	
	_createDomForContent(aLoadedUrls, aReferenceHolder) {
		//console.log("_createDomForContent");
		if(aLoadedUrls) {
			for(let objectName in aLoadedUrls) {
				let currentData = aLoadedUrls[objectName];
				let currentArray = Wprr.objectPath(currentData, "data.posts");
				if(currentArray) {
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let currentPost = currentArray[i];
						
						let contentParser = Wprr.wp.blocks.BlockContentParser.createInBody(currentPost.content);
						aReferenceHolder.addObject("wprr/parsedContent/" + currentPost.id, contentParser);
					}
				}
			}
		}
	}
	
	/**
	 * Creates a new module
	 *
	 * aHolderNode	HTMLElement	The element to add the module to
	 * aData		Object		The confuguration data for the module
	 * aModuleData	Object		The dynamic data for just this module
	 */
	createModule(aHolderNode, aData, aModuleData, aAddMode = ModuleCreatorBaseObject.RENDER) {
		console.log("ModuleCreatorBaseObject::createModule");
		console.log(aHolderNode, aData, aModuleData);
		
		if(this._usedMulitpleTimes) {
			//METODO: look over this
			this._referenceHolder = new ReferenceHolder();
			this._storeController = new StoreController();
			this._siteStorage = new DataStorage();
		}
		
		this._configureModule(aHolderNode, aData, aModuleData);
		
		if(this.parseInitialContent && !Wprr.objectPath(aModuleData, "componentData.parsedContent")) {
			this._createDomForContent(Wprr.objectPath(aData, "initialMRouterData.data"), this._referenceHolder);
		}
		
		this._siteNavigation.setUrlFromLocation();
		//this._siteNavigation.start();
		
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