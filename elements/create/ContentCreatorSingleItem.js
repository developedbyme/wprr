import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
export default class ContentCreatorSingleItem extends ManipulationBaseObject {

	constructor (props) {
		super(props);
	}
	
	_getChildrenToClone() {
		
		var data = this.getSourcedProp("data");
		var contentCreator = this.getSourcedProp("contentCreator");
		
		if(!contentCreator) {
			console.error("Content creator is not set.", this);
			return <div>Content creator is not set</div>;
		}
		
		var returnArray = new Array();
		contentCreator(data, 0, this.getReferences(), returnArray);
		
		if(returnArray.length === 0) {
			console.error("Content creator didn't return any node.", this);
			return [<div>Content creator did not return any object</div>];
		}
		
		return returnArray;
	}
}
