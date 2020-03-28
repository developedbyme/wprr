"use strict";

import React from "react";

import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";

import WprrRenderer from "wprr/WprrRenderer";

// import PageModuleWithRendererCreator from "wprr/modulecreators/PageModuleWithRendererCreator";
export default class PageModuleWithRendererCreator extends PageModuleCreator {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("PageModuleWithRendererCreator::constructor");
		
		super();
		
		this._renderer = new WprrRenderer();
	}
	
	_configureRenderer(aHolderNode, aData) {
		//console.log("PageModuleWithRendererCreator::_configureRenderer");
		let startCheckForRender = false;
		
		this._renderer.setup(this._storeController, aHolderNode);
		
		let currentHref = aData.paths.current;

		if(aData.renderId > 0) {
			let initialLoadPath = aData.paths.rest + "m-router-data/v1/post/" + aData.renderId + "/initial-load";
			this._renderer.setupInitialLoad(initialLoadPath, currentHref, this._storeController, aHolderNode);
			startCheckForRender = true;
		}
		
		/*
		var renderData = aData.render;
		if(renderData) {
			let renderPath = aData.paths.rest + "m-router-data/v1/seo-render";
			this._renderer.setupSeoRender(renderPath, renderData.path, renderData.key);
			startCheckForRender = true;
		}
		*/

		if(startCheckForRender) {
			this._renderer.startCheckingForRender();
		}
	}
	
	_configureModule(aHolderNode, aData) {
		
		super._configureModule(aHolderNode, aData);
		this._configureRenderer(aHolderNode, aData);
		
	}
	
	static create(aClass) {
		var newPageModuleWithRendererCreator = new PageModuleWithRendererCreator();
		newPageModuleWithRendererCreator.setClass(aClass);
		
		return newPageModuleWithRendererCreator;
	}
}