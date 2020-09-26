"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import Button from "./SteppedPathRouter";
export default class SteppedPathRouter extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SteppedPathRouter::constructor");

		super();
		
		this._layoutName = "steppedPathRouter";
		
		this._steppedPaths = new Wprr.utils.navigation.SteppedPaths();
	}
	
	_addDirections() {
		let directions = this.getFirstInput("directions");
		this._steppedPaths.addDirections(directions);
	}
	
	_setInitialPath() {
		let initialPath = this.getFirstInput("initialPath");
		this._steppedPaths.setPath(initialPath);
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		this._addDirections();
		this._setInitialPath();
	}
	
	_getLayout(aSlots) {
		
		let routes = aSlots.prop("routes", []);
		let switchableArea = Wprr.creators.SwitchableAreaCreator.getReactElementsForDynamicClasses(Wprr.sourceProp("type"), aSlots.prop("areaClasses", {}), "none");
		
		return React.createElement(Wprr.ReferenceInjection, {injectData: {"steppedPaths": this._steppedPaths, "value/path": this._steppedPaths.externalStorage}},
			<Wprr.PathRouter routes={routes} path={Wprr.sourceReference("steppedPaths", "externalStorage").deeper("path")}>
				<Wprr.ExternalStorageProps props="type" externalStorage={Wprr.sourceReference("pathRouter/externalStorage")}>
					{switchableArea}
				</Wprr.ExternalStorageProps>
			</Wprr.PathRouter>
		);
	}
}