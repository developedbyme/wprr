import React from 'react';
import ReactDOM from "react-dom";

import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import PortalledItem from "wprr/elements/abstract/PortalledItem";
export default class PortalledItem extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._placementStorage = new Wprr.utils.DataStorage();
		this._placementStorage.updateValue("x", 0);
		this._placementStorage.updateValue("y", 0);
		this._placementStorage.updateValue("width", 0);
		
		this._updatePositionBound = this._updatePosition.bind(this);
		this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
		this._interval = -1;
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["parentElement"];
		delete aReturnObject["overlayClassName"];
	}
	
	_updatePosition() {
		let parentElement = this.getFirstInputWithDefault("parentElement", document.querySelector("body"));
		let element = this.getMainElement();
		
		if(element && parentElement) {
			let elementPosition = element.getBoundingClientRect();
			let parentPosition = parentElement.getBoundingClientRect();
			
			this._placementStorage.updateValue("x", elementPosition.left-parentPosition.left);
			this._placementStorage.updateValue("y", elementPosition.top-parentPosition.top);
			this._placementStorage.updateValue("width", elementPosition.width);
		}
	}
	
	_callback_sizeChanged(aEvent) {
		//console.log("wprr/manipulation/measure/ElementSize::_callback_sizeChanged");
		
		this._updatePosition();
	}
	
	componentDidMount() {
		super.componentDidMount();
		
		this._updatePosition();
		
		window.addEventListener("resize", this._callback_sizeChangedBound, false);
		
		this._interval = setInterval(this._updatePositionBound, Math.round(0.1*1000));
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/measure/ElementSize::componentWillUnmount");
		
		window.removeEventListener("resize", this._callback_sizeChangedBound, false);
		
		clearInterval(this._interval);
		this._interval = -1;
	}
	
	_getStyle(aX, aY, aWidth) {
		
		let returnObject = {"left": aX, "top": aY};
		
		if(aWidth > 0) {
			returnObject["width"] = aWidth;
		}
		
		return returnObject;
	}
	
	_renderMainElement() {
		
		let level = this.getFirstInputWithDefault(Wprr.sourceReferenceIfExists("portalLevel"), 0);
		let newLevel = level+1;
		
		let parentElement = this.getFirstInputWithDefault("parentElement", document.querySelector("body"));
		let overlayClassName = this.getFirstInputWithDefault("overlayClassName", "");
		overlayClassName += " portal-level-" + newLevel;
		overlayClassName += " position-absolute";
		
		let props = this.getProps();
		
		let positionedElement = React.createElement(Wprr.ExternalStorageProps, {"props": "x,y,width", "externalStorage": this._placementStorage},
			React.createElement(Wprr.Adjust, {
				"adjust": [
					Wprr.adjusts.resolveSources("style"),
					Wprr.adjusts.removeProps("x,y,width")
				],
				"style": Wprr.sourceFunction(this, this._getStyle, [Wprr.sourceProp("x"), Wprr.sourceProp("y"), Wprr.sourceProp("width")])
			},
				React.createElement(Wprr.AddReference, {"data": newLevel, "as": "portalLevel"}, 
					React.createElement("div", {"className": overlayClassName},
						props.children
					)
				)
			)
		);
		
		let portal = ReactDOM.createPortal(positionedElement, parentElement);
		
		return React.createElement("div", {"className": "portal-positioning"}, portal);
	}
}