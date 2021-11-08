import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

//import DataRangeLoader from "./DataRangeLoader";
export default class DataRangeLoader extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "dataRangeLoader";
		this._item = Wprr.sourceValue(null);
	}
	
	_prepareInitialRender() {
		console.log("DataRangeLoader::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let items = this.getFirstInput("items", Wprr.sourceReference("items"), Wprr.sourceReference("wprr/project", "items"));
		let path = this.getWprrUrl(this.getFirstInput("path"), "wprrData");
		
		let item = items.getItem(path);
		
		items.prepareItem(item, "dataRangeLoader");
		this._item.value = item;
	}
	
	_getLayout(aSlots) {
		console.log("DataRangeLoader::_getLayout");
		
		let as = this.getFirstInput("as");
		
		return React.createElement(Wprr.AddReference, {"data": this._item, "as": as}, aSlots.default(React.createElement("div", {}, "No element set")));
	}
}
