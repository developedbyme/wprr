import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

//import LoadAdditionalItem from "./LoadAdditionalItem";
export default class LoadAdditionalItem extends Layout {

	_construct() {
		super._construct();
		
		this._layoutName = "loadAdditionalItem";
		
		this._elementTreeItem.requireValue("loaded", false);
		
		let path = this.getFirstInputWithDefault("path", this.getWprrUrl("range/?select=idSelection&encode=postTitle&ids={ids}", "wprrData"));
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		
		let detailsLoaderItem = this._elementTreeItem.group.getItem(path);
		if(!detailsLoaderItem.hasType("additionalLoader")) {
			let loader = new Wprr.utils.data.nodes.LoadAdditionalItems();
			loader.setItemConnection(detailsLoaderItem);
			loader.setup();
			
			let detailsLoader = detailsLoaderItem.addType("additionalLoader", loader);
			detailsLoaderItem.setValue("url", path);
		}
		this._elementTreeItem.addSingleLink("detailsLoader", detailsLoaderItem.id);
		
		let inArrayCondition = Wprr.utils.data.nodes.InArrayCondition.connect(detailsLoaderItem.getLinks("loadedIds").idsSource, this._elementTreeItem.getValueSource("loaded"), id);
		this._elementTreeItem.addType("inArrayCondition", inArrayCondition);
		
		detailsLoaderItem.getLinks("ids").addUniqueItem(id);
		
	}
	
	_getLayout(aSlots) {
		//console.log("LoadAdditionalItem::_getLayout");
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("loaded")},
				aSlots.default(React.createElement("div", {}, "No element set"))
			),
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("loaded"), "checkType": "invert/default"},
				aSlots.slot("loaderElement", React.createElement(Wprr.layout.loader.LoaderDisplay))
			)
		);
	}
}
