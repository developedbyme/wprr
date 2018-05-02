import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import Link from "wprr/elements/interaction/Link";
export default class Link extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._mainElementType = "a";
	}
	
	_copyPassthroughProps(aReturnObject) {
		if(this.props.href) {
			aReturnObject["href"] = this.getSourcedProp("href");
		}
		if(this.props.target) {
			aReturnObject["target"] = this.getSourcedProp("target");
		}
		if(this.props.onClick) {
			aReturnObject["onClick"] = this.getSourcedProp("onClick");
		}
	}
	
	_renderMainElement() {
		return <wrapper>
			{this.props.children}
		</wrapper>;
	}
}