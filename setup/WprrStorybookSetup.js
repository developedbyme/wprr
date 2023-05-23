import Wprr from "wprr";

import objectPath from "object-path";

import TextManager from "wprr/textmanager/TextManager";
import StoreController from "wprr/store/StoreController";
import ReferenceHolder from "wprr/reference/ReferenceHolder";

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

//import WprrStorybookSetup from "wprr/setup/WprrStorybookSetup";
export default class WprrStorybookSetup {
	
	constructor() {
		this._store = null;
		this._storeController = new StoreController();
		this._textManager = new TextManager();
		this._postData = new Wprr.utils.PostData();
		this._project = null;
		
		this._postData.setData({
			"meta": {
				
			},
			"terms": {
				
			}
		})
		
		this._injectionData = new Object();
		
		this._injectionData["wprr/textManager"] = this._textManager;
		this._injectionData["redux/store/wprrController"] = this._storeController;
		this._injectionData["wprr/postData"] = this._postData;
		
		this._referenceHolder = new ReferenceHolder();
		
		this._defaultPath = null;
	}
	
	get project() {
		return this._project;
	}
	
	_addReducers() {
		
		let storeController = this._storeController;
		
		storeController.addDynamicReducer(storeController.createLocalReducer("mRouter", storeController.reduce));
		storeController.addDynamicReducer(storeController.createLocalReducer("settings", storeController.reduceSettings));
		storeController.addDynamicReducer(storeController.createLocalReducer("globalVariables", storeController.reduceGlobalVariables));
	}
	
	_createReduxStore() {
		//console.log("WprrStorybookSetup::_createReduxStore");
		
		let initialState = {};
		
		let defaultPath = this._defaultPath;
		if(defaultPath) {
			this._storeController.getUrlResolvers().addBasePath("default", defaultPath);
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
	
	setupStore() {
		//console.log("WprrStorybookSetup::setupStore");
		
		this._store = this._createReduxStore();
		this._storeController.setStore(this._store);
		this._injectionData["redux/store/wprrController"] = this._storeController;
		
		return this;
	}
	
	setupProject(aName) {
		this._project = window.wprr.getProject(aName);
		
		this._injectionData["wprr/project"] = this._project;
		
		return this;
	}
	
	addPath(aName, aPath) {
		//console.log("WprrStorybookSetup::addPath");
		
		this._injectionData["wprr/paths/" + aName] = aPath;
		
		if(this._project) {
			let pathController = Wprr.objectPath(this._project.items, "project.paths.linkedItem.pathController");
			
			let currentPath = pathController.getChild("wp/" + aName);
			let pathUrl = aPath;
			if(pathUrl[pathUrl.length-1] === "/") {
				pathUrl = pathUrl.substring(0, pathUrl.length-1);
			}
			currentPath.setFullPath(pathUrl);
		}
		else {
			console.warn("No project, cant add path " + aName + "(" + aPath + ")");
		}
		
		return this;
	}
	
	setDefaultPath(aPath) {
		this._defaultPath = aPath;
		
		this.addPath("rest", aPath);
		
		return this;
	}
	
	addImagesPath(aPath, aLocationName = "images") {
		
		this.addPath(aLocationName, aPath);
		this._injectionData["wprr/defaultImageLocation"] = aLocationName;
		
		return this;
	}
	
	addPostMeta(aName, aValue) {
		objectPath.set(this._postData.getData(), "meta." + aName, aValue);
		
		return this;
	}
	
	getMainInjections() {
		let returnObject = new Object();
		
		for(let objectName in this._injectionData) {
			returnObject[objectName] = this._injectionData[objectName];
		}
		
		return returnObject;
	}
	
	getMainReference() {
		
		for(let objectName in this._injectionData) {
			this._referenceHolder.addObject(objectName, this._injectionData[objectName]);
		}
		
		if(this._project) {
			this._project.setMainReferences(this._referenceHolder);
		}
		
		return this._referenceHolder;
	}
	
	static setupGlobalWprr() {
		if (!window.wprr) {
			let globalWprr = new Wprr();
			globalWprr.addGlobalReference(window);
		}
	}
	
	static create(aDataPath, aProjectName = "default") {
		let newWprrStorybookSetup = new WprrStorybookSetup();
		
		WprrStorybookSetup.setupGlobalWprr();
		
		newWprrStorybookSetup.setupProject(aProjectName).setDefaultPath(aDataPath).setupStore();
		
		return newWprrStorybookSetup;
	}
}