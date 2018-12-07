import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import TWEEN from "@tweenjs/tween.js";

//import OpenCloseExpandableArea from "wprr/elements/area/OpenCloseExpandableArea";
export default class OpenCloseExpandableArea extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._heightElement = null;
		
		this.state["open"] = false;
		this.state["height"] = 0;
		this.state["envelope"] = 0;
		
		this._setHeightElementBound = this._setHeightElement.bind(this);
		this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
	}
	
	_setHeightElement(aElement) {
		//console.log("wprr/interaction/OpenCloseExpandableArea::_setHeightElement");
		//console.log(aElement);
		
		this._heightElement = aElement;
		this._updateHeight();
	}
	
	_updateHeight() {
		//console.log("wprr/interaction/OpenCloseExpandableArea::_updateHeight");
		
		if(this._heightElement) {
			let currentHeight = this._heightElement.clientHeight;
		
			if(currentHeight !== this.state["height"]) {
				this.setState({"height": currentHeight});
			}
		}
		
	}
	
	_callback_sizeChanged(aEvent) {
		//console.log("wprr/interaction/OpenCloseExpandableArea::_callback_sizeChanged");
		
		this._updateHeight();
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		if(this.getSourcedProp("open")) {
			this.setState({"open": true, "envelope": 1});
		}
	}
	
	componentDidMount() {
		//console.log("wprr/interaction/OpenCloseExpandableArea::componentDidMount");
		
		this._updateHeight();
		
		window.addEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	componentDidUpdate() {
		//console.log("wprr/interaction/OpenCloseExpandableArea::componentDidUpdate");
		
		this._updateHeight();
		
		let open = this.getSourcedProp("open");
		
		if(open !== this.state["open"]) {
			let tweenParameters = {"envelope": this.state.envelope};
			let updateFunction = (function() {
				this.setState(tweenParameters);
			}).bind(this);
			
			let newEnvelope = open ? 1 : 0;
			
			this.setState({"open": open});
			this._tween = new TWEEN.Tween(tweenParameters).to({"envelope": newEnvelope}, 1000*0.4).easing(TWEEN.Easing.Quadratic.Out).onUpdate(updateFunction).start();
		}
	}
	
	componentWillUnmount() {
		//console.log("wprr/interaction/OpenCloseExpandableArea::componentWillUnmount");
		
		window.removeEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	_renderMainElement() {
		
		let height = this.state["height"]*this.state["envelope"];
		let styleObject = {"height": height, "overflow": "hidden"};
		
		if(this.state["envelope"] === 1) {
			styleObject["height"] = "auto";
			styleObject["overflow"] = "visible";
		}
		
		return React.createElement("wrapper", {},
			React.createElement("div", {"className": "animation-element border-box-sizing", "style": styleObject},
				React.createElement("div", {"ref": this._setHeightElementBound}, this.props.children)
			)
		);
	}
}
