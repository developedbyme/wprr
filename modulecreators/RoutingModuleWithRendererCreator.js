"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import RoutingModuleCreator from "wprr/modulecreators/RoutingModuleCreator";

import WprrRenderer from "wprr/WprrRenderer";

// import RoutingModuleWithRendererCreator from "wprr/modulecreators/RoutingModuleWithRendererCreator";
export default class RoutingModuleWithRendererCreator extends RoutingModuleCreator {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("RoutingModuleWithRendererCreator::constructor");
		
		super();
		
		this._renderer = new WprrRenderer();
		this.skipPreloadedData = false;
	}
	
	_configureModule(aHolderNode, aData) {
		
		super._configureModule(aHolderNode, aData);
		this._configureRenderer(aHolderNode, aData);
		
	}
	
	_configureRenderer(aHolderNode, aData) {
		console.log("RoutingModuleWithRendererCreator::_configureRenderer");
		let startCheckForRender = true;
		
		this._renderer.setup(this._storeController, aHolderNode);
		
		let currentHref = document.location.href;
		
		let initialLoadPath = aData.paths.rest + "wprr/v1/action/wprr/save-initial-load-cache";
		this._renderer.setupInitialLoad(initialLoadPath, currentHref, aData.paths.rest);
		
		if(!this.skipPreloadedData) {
			for(let objectName in aData.preloadedData) {
			
				let currentLoaderData = aData.preloadedData[objectName];
			
				let newLoader = this._project.getSharedLoader(objectName);
				newLoader.setUrl(objectName);
				newLoader.setData({"status": "success", "data": currentLoaderData.data});
				newLoader.setStatus(Wprr.utils.JsonLoader.LOADED);
				//console.log(currentLoaderData.performance, objectName);
				
				console.log(newLoader);
			
				//this._storeController.addLoader(objectName, newLoader);
			}
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

	
	static create() {
		var newRoutingModuleWithRendererCreator = new RoutingModuleWithRendererCreator();
		
		return newRoutingModuleWithRendererCreator;
	}
}