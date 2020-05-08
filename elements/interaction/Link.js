import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import Link from "wprr/elements/interaction/Link";
export default class Link extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["href"];
		delete aReturnObject["prefix"];
		delete aReturnObject["target"];
	}
	
	_renderMainElement() {
		
		let newProps = new Object();
		
		let href = this.getFirstInput("href");
		if(href) {
			let prefix = this.getFirstInput("prefix");
			if(prefix) {
				href = prefix + href;
			}
			newProps["href"] = href;
		}
		
		let target = this.getFirstInput("target");
		if(target) {
			newProps["target"] = target;
		}
		
		return React.createElement("a", newProps, this.props.children);
	}
}