"use strict";

import React from "react";

import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";

import WprrRenderer from "wprr/WprrRenderer";

// import AppModuleWithRenderCreator from "wprr/modulecreators/AppModuleWithRenderCreator";
export default class AppModuleWithRenderCreator extends AppModuleCreator {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.AppModuleWithRenderCreator::constructor");
		
		super();
		
		this._renderer = new WprrRenderer();
	}
	
	_configureModule(aHolderNode, aData) {
		//console.log("oa.AppModuleWithRenderCreator::_configureModule");
		//console.log(aHolderNode, aData);
		
		super._configureModule(aHolderNode, aData);
		
		let startCheckForRender = false;
		
		this._renderer.setup(this._storeController, aHolderNode);
		
		let currentHref = aData.paths.current;

		if(aData.renderId > 0) {
			let initialLoadPath = aData.paths.rest + "m-router-data/v1/post/" + aData.renderId + "/initial-load";
			this._renderer.setupInitialLoad(initialLoadPath, currentHref, this._storeController, aHolderNode);
			startCheckForRender = true;
		}

		var renderData = aData.render;
		if(renderData) {
			let renderPath = aData.paths.rest + "m-router-data/v1/seo-render";
			this._renderer.setupSeoRender(renderPath, renderData.path, renderData.key);
			startCheckForRender = true;
		}

		if(startCheckForRender) {
			this._renderer.startCheckingForRender();
		}
	}
	
	static create(aClass) {
		var newAppModuleWithRenderCreator = new AppModuleWithRenderCreator();
		newAppModuleWithRenderCreator.setClass(aClass);
		
		return newAppModuleWithRenderCreator;
	}
}