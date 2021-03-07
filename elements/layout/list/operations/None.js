import React from "react";
import WprrBaseObject from "wprr/WprrBaseObject";

export default class None extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_update() {
		
	}
	
	_renderMainElement() {
		
		return React.createElement("div", {});
	}
}
