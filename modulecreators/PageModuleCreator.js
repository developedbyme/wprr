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

// import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
export default class PageModuleCreator {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.PageModuleCreator::constructor");
		
		this._reactClass = null;
		this._store = null;
		
		this._initialPath = null;
		
		this._referenceHolder = new ReferenceHolder();
		this._storeController = new StoreController();
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
	
	_createReduxStore(aConfigurationData) {
		
		//METODO: full store
		//METODO: clean this up
		let initialState = {
			"mRouter": {
				"currentPage": aConfigurationData.paths.current,
				"data": aConfigurationData.initialMRouterData
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
	
	/**
	 * Creates a new module
	 *
	 * aHolderNode	HTMLElement	The element to add the module to
	 * aData		Object		The dynamic data for the module
	 */
	createModule(aHolderNode, aData) {
		//console.log("oa.PageModuleCreator::createModule");
		//console.log(aHolderNode, aData);
		
		this._store = this._createReduxStore(aData);
		this._storeController.setStore(this._store);
		
		this._referenceHolder.addObject("redux/store", this._store);
		this._referenceHolder.addObject("redux/store/mRouterController", this._storeController);
		
		//METODO: change this to a local image loader
		if(window.wprr.imageLoaderManager) {
			window.wprr.imageLoaderManager.setNamedSizes(aData.imageSizes);
			this._referenceHolder.addObject("wprr/imageLoaderManager", this._storeController);
		}
		
		let pageData = aData.initialMRouterData.data[aData.paths.current].data;
		
		let rootObject = <Provider store={this._store}>
			<ReferenceExporter references={this._referenceHolder}>
				<ReferenceInjection injectData={{"wprr/pageData": pageData}}>
					<PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
						{React.createElement(this._reactClass, {})}
					</PostDataInjection>
				</ReferenceInjection>
			</ReferenceExporter>
		</Provider>;
		
		return ReactDOM.render(rootObject, aHolderNode);
	}
	
	static create(aClass) {
		var newPageModuleCreator = new PageModuleCreator();
		newPageModuleCreator.setClass(aClass);
		
		return newPageModuleCreator;
	}
}