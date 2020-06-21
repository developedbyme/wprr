import React from "react";

import NativeElementArea from "wprr/elements/area/NativeElementArea";

//import InjectExistingElements from "wprr/elements/area/InjectExistingElements";
export default class InjectExistingElements extends NativeElementArea {

	constructor(aProps) {
		super(aProps);
	}
	
	_updateRender() {
		
		let elements = this.getFirstInput("elements");
		
		let currentArray = elements;
		let currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			let currentElement = currentArray[i];
			this._element.appendChild(currentElement);
		}
		
		super._updateRender();
	}
}
