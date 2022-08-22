import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Loop from "wprr/elements/create/Loop";
import InjectChildren from "wprr/manipulation/InjectChildren";

//import WpMenu from "wprr/wp/menu/WpMenu";
export default class WpMenu extends ManipulationBaseObject {

	_construct() {
		super._construct();
		
		/*
		let menuLocation = this.getFirstInput("menuLocation");
		
		this._elementTreeItem.requireValue("loaded", false);
		
		let loader = this._elementTreeItem.addNode("eventLoader", new Wprr.utils.data.nodes.LoadDataRange());
		loader.setUrl(this.getWprrUrl("range/?select=menu&encode=menuItem&location=" + menuLocation, "wprrData"));
		console.log("loader>>>>>", loader);
		
		this._elementTreeItem.getType("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._loaded));
		this._elementTreeItem.getType("loaded").input(loader.item.getType("loaded"));
		*/
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/menu/WpMenu::_removeUsedProps");
		
		delete aReturnObject["menuLocation"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let menuLocation = this.getFirstInput("menuLocation");
		
		if(!menuLocation) {
			console.error("No menuLocation set for menu.", this);
		}
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = React.createElement(InjectChildren);
		}
		
		return [React.createElement(WprrDataLoader, {"loadData": {"input": "m-router-data/v1/menu/" + menuLocation}},
			React.createElement(Loop, {}, children)
		)];
	}
}
