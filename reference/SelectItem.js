import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import SelectItem from "wprr/reference/SelectItem";
export default class SelectItem extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._defaultAs = "item";
		this._defaultFrom = "items";
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/SelectItem::_removeUsedProps");
		
		delete aReturnObject["id"];
		delete aReturnObject["from"];
		delete aReturnObject["as"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let children = this.getProps()["children"];
		
		let injectData = new Object();
		
		injectData[this.getFirstInputWithDefault("as", this._defaultAs)] = this.getFirstInput(
			Wprr.sourceStatic(
				this.getFirstInput("from", Wprr.sourceReference(this._defaultFrom)),
				this.getFirstInput("id")
			)
		);
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, children);
	}
}
