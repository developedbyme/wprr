import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
export default class ContentCreatorSingleItem extends ManipulationBaseObject {

	constructor (props) {
		super(props);
	}
	
	_removeUsedProps(aReturnObject) {
		let returnObject = super._removeUsedProps(aReturnObject);
		
		delete returnObject["data"];
		delete returnObject["contentCreator"];
		
		return returnObject;
	}
	
	_getChildrenToClone() {
		
		let data = this.getSourcedProp("data");
		let contentCreator = this.getSourcedProp("contentCreator");
		
		if(!contentCreator) {
			console.error("Content creator is not set.", this);
			return <div>Content creator is not set</div>;
		}
		
		if(!data) {
			data = {"children": this.props.children};
		}
		
		let returnArray = new Array();
		contentCreator(data, 0, this.getReferences(), returnArray);
		
		if(returnArray.length === 0) {
			console.error("Content creator didn't return any node.", this);
			return [<div>Content creator did not return any object</div>];
		}
		
		return returnArray;
	}
}
