import React from 'react';

import WprrBaseObject from "wprr/WprrBaseObject";

//import Part from "wprr/elements/abstract/Part";
export default class Part extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._partData = new Object();
		
	}
	
	_renderMainElement() {
		
		let owner = this.getSourcedProp("owner");
		if(!owner) {
			console.error("No owner set.", this);
			return React.createElement("div", {}, "No owner set");
		}
		
		let part = this.getSourcedProp("part");
		let type = this.getSourcedProp("type");
		if(!type) {
			type = part;
		}
		
		return owner.renderPart(part, type, this.props, this);
	}
}
