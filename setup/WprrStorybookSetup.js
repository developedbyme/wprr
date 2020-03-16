import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import TextManager from "wprr/textmanager/TextManager";
import StoreController from "wprr/store/StoreController";

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
		
		this._defaultPath = null;
	}
	
	_addReducers() {
		
		let storeController = this._storeController;
		
		storeController.addDynamicReducer(storeController.createLocalReducer("mRouter", storeController.reduce));
		storeController.addDynamicReducer(storeController.createLocalReducer("settings", storeController.reduceSettings));
		storeController.addDynamicReducer(storeController.createLocalReducer("globalVariables", storeController.reduceGlobalVariables));
	}
	
	_createReduxStore() {
		console.log("WprrStorybookSetup::_createReduxStore");
		
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
		console.log("WprrStorybookSetup::setupStore");
		
		this._store = this._createReduxStore();
		this._storeController.setStore(this._store);
		
		return this;
	}
	
	setDefaultPath(aPath) {
		this._defaultPath = aPath;
		this._injectionData["wprr/paths/rest"] = aPath;
		
		return this;
	}
	
	addImagesPath(aPath, aLocationName = "images") {
		
		this._injectionData["wprr/paths/" + aLocationName] = aPath;
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
	
	static create(aDataPath) {
		let newWprrStorybookSetup = new WprrStorybookSetup();
		
		newWprrStorybookSetup.setDefaultPath(aDataPath).setupStore();
		
		return newWprrStorybookSetup;
	}
}