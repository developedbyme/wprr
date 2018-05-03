"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceInjection from "wprr/reference/ReferenceInjection";
import PostDataInjection from "wprr/wp/postdata/PostDataInjection";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import StoreController from "wprr/store/StoreController";
import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";

// import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";
export default class AppModuleCreator {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/modulecreators/AppModuleCreator::constructor");
		
		this._reactClass = null;
		this._store = null;
		
		this._initialPath = null;
		
		this._referenceHolder = new ReferenceHolder();
		this._storeController = new StoreController();
		
		this._urlResolvers = new MultipleUrlResolver();
	}
	
	/**
	 * Sets the class to use for creating classes
	 *
	 * @param	aClass	React.Component	The class to use for creatirn new modules.
	 *
	 * @return	self
	 */
	setClass(aClass) {
		this._reactClass = aClass;
		
		return this;
	}
	
	getReferenceHolder() {
		return this._referenceHolder;
	}
	
	_createReduxStore(aConfigurationData) {
		
		//METODO: full store
		//METODO: clean this up
		
		let initialState = {
			"mRouter": {
				"currentPage": aConfigurationData.paths.current,
				"data": aConfigurationData.initialMRouterData,
				"apiData": aConfigurationData.initialMRouterData.apiData
			},
			"settings": {
				"homeUrl": aConfigurationData.paths.home,
				"sitePath": aConfigurationData.paths.site,
				"themePath": aConfigurationData.paths.theme,
				"wpApiUrlBase": aConfigurationData.paths.rest
			}
		};
		
		return createStore(
			combineReducers({
				"mRouter": this._storeController.reduce,
				"settings": this._storeController.reduceSettings
			}),
			initialState,
			compose(
				applyMiddleware(thunk)
			)
		);
	}
	
	_configureModule(aHolderNode, aData) {
		console.log("wprr/modulecreators/AppModuleCreator::_configureModule");
		console.log(aHolderNode, aData);
		
		this._store = this._createReduxStore(aData);
		this._storeController.setStore(this._store);
		
		this._referenceHolder.addObject("redux/store", this._store);
		this._referenceHolder.addObject("redux/store/mRouterController", this._storeController);
		
		this._referenceHolder.addObject("wprr/userData", aData.userData);
		this._referenceHolder.addObject("wprr/settings", aData.settings);
		
		//METODO: change this to a local image loader
		if(window.wprr.imageLoaderManager) {
			window.wprr.imageLoaderManager.setNamedSizes(aData.imageSizes);
			this._referenceHolder.addObject("wprr/imageLoaderManager", this._storeController);
		}
		
		this._urlResolvers.setBasePaths(aData.paths);
	}
	
	/**
	 * Creates a new module
	 *
	 * aHolderNode	HTMLElement	The element to add the module to
	 * aData		Object		The dynamic data for the module
	 */
	createModule(aHolderNode, aData) {
		//console.log("wprr/modulecreators/AppModuleCreator::createModule");
		//console.log(aHolderNode, aData);
		
		this._configureModule(aHolderNode, aData);
		
		let pageData = aData.initialMRouterData.data[aData.paths.current].data;
		
		let injectData = {"wprr/pageData": pageData};
		this._urlResolvers.addPathsToReferenceInjectionData(injectData);
		
		let rootObject = <Provider store={this._store}>
			<ReferenceExporter references={this._referenceHolder}>
				<ReferenceInjection injectData={injectData}>
					{React.createElement(this._reactClass, {})}
				</ReferenceInjection>
			</ReferenceExporter>
		</Provider>;
		
		return ReactDOM.render(rootObject, aHolderNode);
	}
	
	static create(aClass) {
		var newAppModuleCreator = new AppModuleCreator();
		newAppModuleCreator.setClass(aClass);
		
		return newAppModuleCreator;
	}
}