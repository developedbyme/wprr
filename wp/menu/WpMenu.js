import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Loop from "wprr/elements/create/Loop";
import InjectChildren from "wprr/manipulation/InjectChildren";

//import WpMenu from "wprr/wp/menu/WpMenu";
export default class WpMenu extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/menu/WpMenu::_removeUsedProps");
		
		delete aReturnObject["menuLocation"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let menuLocation = this.getSourcedProp("menuLocation");
		
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
