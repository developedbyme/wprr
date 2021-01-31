"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import LoadAdditionalItems from "./LoadAdditionalItems";
export default class LoadAdditionalItems extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("LoadAdditionalItems::constructor");

		super();
		
		this._layoutName = "loadAdditionalItems";
		
		this._loaded = Wprr.sourceValue(0);
		
		this._updateCommand = Wprr.commands.callFunction(this, this._updateLoadStatus);
	}
	
	_updateLoadStatus() {
		//console.log("LoadAdditionalItems::_updateLoadStatus");
		let ids = Wprr.utils.array.removeValues(Wprr.utils.array.singleOrArray(this.getFirstInput("ids")), [null, undefined, 0]);
		let items = this.getAdditionalLoader().items;
		
		let isLoaded = items.hasItemsWithType(ids, "data");
		
		this._loaded.value = isLoaded ? 1 : 0;
	}
	
	getAdditionalLoader() {
		console.log("getAdditionalLoader");
		
		let additionalLoader = this.getFirstInput(
			"loader",
			Wprr.sourceReference("loadAdditionalItems/slots/loader"),
			Wprr.sourceReference("items", "additionalLoader")
		);
		
		console.log(additionalLoader, this.getFirstInput(Wprr.sourceReference("items", "additionalLoader")), this.getFirstInput(Wprr.sourceReference("items")));
		
		return additionalLoader;
	}
	
	_prepareInitialRender() {
		//console.log("LoadAdditionalItems::_prepareInitialRender");
		super._prepareInitialRender();
		
		this.getAdditionalLoader().addCommand(this._updateCommand, "loaded");
		//METODO
	}
	
	_prepareRender() {
		//console.log("LoadAdditionalItems::_prepareRender");
		super._prepareRender();
		
		let ids = Wprr.utils.array.removeValues(Wprr.utils.array.singleOrArray(this.getFirstInput("ids")), [null, undefined, 0]);
		
		if(ids) {
			this.getAdditionalLoader().loadItems(ids);
			this._updateLoadStatus();
		}
		else {
			console.error("No ids set", this);
		}
	}
	
	_getLayout(aSlots) {
		
		let isDoneSource = Wprr.sourceStatic(this._externalStorage, "loaded");
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.HasData, {"check": this._loaded},
				aSlots.default(React.createElement("div", {}, "No element set"))
			),
			React.createElement(Wprr.HasData, {"check": this._loaded, checkType: "invert/default"},
				aSlots.slot("loaderDisplay", React.createElement("div", {}, Wprr.translateText("Loading...")))
			),
		);
	}
	
	static createFromRelation(aDirection, aConnectionType, aObjectType, aElement) {
		
		let pointerName = (aDirection === "outgoing") ? "to" : "from";
		let idSource = Wprr.sourceReference("item", "multipleRelations." + aDirection + "." + aConnectionType + "." + aObjectType + ".(every)." + pointerName + ".id");
		
		return React.createElement(LoadAdditionalItems, {"ids": idSource},
			aElement
		);
	}
}