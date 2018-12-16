import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import Link from "wprr/elements/interaction/Link";
export default class Link extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._mainElementType = "a";
	}
	
	_copyPassthroughProps(aReturnObject) {
		
		super._copyPassthroughProps(aReturnObject);
		
		let href = this.getSourcedProp("href");
		if(href) {
			let prefix = this.getSourcedProp("prefix");
			if(prefix) {
				href = prefix + href;
			}
			aReturnObject["href"] = href;
		}
		
		let target = this.getSourcedProp("target");
		if(target) {
			aReturnObject["target"] = target;
		}
	}
	
	_renderMainElement() {
		return React.createElement("wrapper", {}, this.props.children);
	}
}