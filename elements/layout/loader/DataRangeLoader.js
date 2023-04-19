import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

//import DataRangeLoader from "./DataRangeLoader";
export default class DataRangeLoader extends Layout {

	_construct() {
		super._construct();
		
		this._layoutName = "dataRangeLoader";
		this._item = Wprr.sourceValue(null);
		
		this.addExposedProps("path");
	}
	
	_prepareInitialRender() {
		//console.log("DataRangeLoader::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let items = this.getFirstInput("items", Wprr.sourceReference("items"), Wprr.sourceReference("wprr/project", "items"));
		let path = this.getWprrUrl(this.getFirstInput("path"), "wprrData");
		
		let item = items.getItem(path);
		
		let calculations = this.getFirstInput("calculations");
		if(calculations) {
			item.setValue("calculations", calculations);
		}
		
		items.prepareItem(item, "dataRangeLoader");
		this._item.value = item;
		item.getType("loader").load();
	}
	
	_getLayout(aSlots) {
		//console.log("DataRangeLoader::_getLayout");
		
		let as = this.getFirstInput("as");
		
		return React.createElement(Wprr.AddReference, {"data": this._item, "as": as},
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference(as, "loaded")},
				aSlots.default(React.createElement("div", {}, "No element set"))
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference(as, "loaded"), "checkType": "invert/default"},
				aSlots.slot("loaderElement", React.createElement(Wprr.layout.loader.LoaderDisplay))
			)
		);
	}
}
