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
		
		this._selectedItem = Wprr.sourceValue(null);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/SelectItem::_removeUsedProps");
		
		delete aReturnObject["id"];
		delete aReturnObject["from"];
		delete aReturnObject["as"];
		
		return aReturnObject;
	}
	
	_prepareRender() {
		
		let fromObject = this.getFirstInput("from", Wprr.sourceReference(this._defaultFrom));
		let id = this.getFirstInput("id");
		
		let itemSource = Wprr.sourceStatic(
			fromObject,
			id
		);
		
		let item = this.getFirstInput(itemSource);
		
		if(!item) {
			console.warn("No item with id " + id + " from", fromObject);
		}
		
		this._selectedItem.setValue(item);
	}
	
	_renderMainElement() {
		let children = this.getProps()["children"];
		
		let injectData = new Object();
		injectData[this.getFirstInputWithDefault("as", this._defaultAs)] = this._selectedItem;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, children);
	}
}
