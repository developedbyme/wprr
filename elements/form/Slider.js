import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import EditableProps from "wprr/manipulation/EditableProps";
import CommandPerformer from "wprr/commands/CommandPerformer";
import EventCommands from "wprr/elements/interaction/EventCommands";
import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

// import Slider from "wprr/elements/form/Slider";
export default class Slider extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._callback_mouseUpBound = this._callback_mouseUp.bind(this);
		this._callback_mouseMoveBound = this._callback_mouseMove.bind(this);
		
		this._startValue = 0;
		this._startX = 0;
		this._startY = 0;
	}
	
	getValue() {
		//console.log("wprr/elements/form/Slider::getValue");
		
		let valueName = this.getSourcedProp("valueName");
		return this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
	}
	
	validate(aType) {
		return this._validate(aType);
	}
	
	_validate(aType) {
		let validation = this.getReferenceIfExists("validation/validate");
		if(validation) {
			return validation.validate(aType);
		}
		
		return 1;
	}
	
	_getMainElementProps() {
		var returnObject = super._getMainElementProps();
		
		let value = this.getValue();
		
		let minValue = this.getSourcedPropWithDefault("minValue", 0);
		let maxValue = this.getSourcedPropWithDefault("maxValue", 1);
		
		let parameter = (value-minValue)/(maxValue-minValue);
		let invertedParameter = (1-parameter);
		
		let minX = this.getSourcedPropWithDefault("minX", 0);
		let maxX = this.getSourcedPropWithDefault("maxX", 0);
		
		let minY = this.getSourcedPropWithDefault("minY", 0);
		let maxY = this.getSourcedPropWithDefault("maxY", 0);
		
		let x = invertedParameter*minX+parameter*maxX;
		let y = invertedParameter*minY+parameter*maxY;
		
		let transform = "translate(" + x + "px," + y + "px)";
		
		returnObject["style"] = {"transform": transform, "position": "absolute"};
		
		return returnObject;
	}
	
	_updateMoveValue(aValue) {
		//METODO
		//console.log(aValue);
		
		let additionalData = this.getSourcedProp("additionalData");
		let valueName = this.getSourcedProp("valueName");
		
		let newValue = aValue;
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, newValue, additionalData);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_startMove(aX, aY) {
		//console.log("wprr/elements/form/Slider::_startMove");
		//console.log(aX, aY);
		
		this._startValue = this.getValue();
		this._startX = aX;
		this._startY = aY;
	}
	
	_updateMove(aX, aY) {
		//console.log("wprr/elements/form/Slider::_updateMove");
		//console.log(aX, aY);
		
		let movedX = aX-this._startX;
		let movedY = aY-this._startY;
		
		let movedLength = Math.sqrt(Math.pow(movedX, 2)+Math.pow(movedY, 2));
		
		if(movedLength === 0) {
			this._updateMoveValue(this._startValue);
			return;
		}
		
		let minX = this.getSourcedPropWithDefault("minX", 0);
		let maxX = this.getSourcedPropWithDefault("maxX", 0);
		
		let minY = this.getSourcedPropWithDefault("minY", 0);
		let maxY = this.getSourcedPropWithDefault("maxY", 0);
		
		let lineX = (maxX-minX);
		let lineY = (maxY-minY);
		
		let lineLength = Math.sqrt(Math.pow(lineX, 2)+Math.pow(lineY, 2));
		
		let dotProduct = (movedX/movedLength)*(lineX/lineLength)+(movedX/movedLength)*(lineY/lineLength);
		
		let minValue = this.getSourcedPropWithDefault("minValue", 0);
		let maxValue = this.getSourcedPropWithDefault("maxValue", 1);
		
		let valueChange = (maxValue-minValue)*dotProduct*movedLength/lineLength;
		let newValue = Math.max(minValue, Math.min(maxValue, this._startValue+valueChange));
		
		this._updateMoveValue(newValue);
	}
	
	_callback_mouseUp(aEvent) {
		//console.log("wprr/elements/form/Slider::_callback_mouseUp");
		//console.log(aEvent);
		
		if(aEvent.type === "touchend") {
			this._updateMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._updateMove(aEvent.pageX, aEvent.pageY);
		}
		
		document.removeEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.removeEventListener("mouseup", this._callback_mouseUpBound, false);
		
		document.removeEventListener("touchmove", this._callback_mouseMoveBound, false);
		document.removeEventListener("touchup", this._callback_mouseUpBound, false);
	}
	
	_callback_mouseMove(aEvent) {
		//console.log("wprr/elements/form/Slider::_callback_mouseMove");
		//console.log(aEvent);
		
		if(aEvent.type === "touchmove") {
			this._updateMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._updateMove(aEvent.pageX, aEvent.pageY);
		}
	}
	
	_startDrag(aEvent) {
		//console.log("wprr/elements/form/Slider::_startDrag");
		//console.log(aEvent, aEvent.type);
		
		if(aEvent.type === "touchstart") {
			this._startMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._startMove(aEvent.pageX, aEvent.pageY);
		}
		
		document.addEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.addEventListener("mouseup", this._callback_mouseUpBound, false);
		
		document.addEventListener("touchmove", this._callback_mouseMoveBound, false);
		document.addEventListener("touchup", this._callback_mouseUpBound, false);
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/Slider::_renderMainElement");
		
		let name = this.getSourcedProp("name");
		let value = this.getValue();
		
		let startCommand = CallFunctionCommand.create(this, this._startDrag, [SourceData.create("event", "raw")]);
		
		return React.createElement("wrapper", {},
			React.createElement("input", {"type": "hidden", "value": value, "readOnly": true}),
			React.createElement(EventCommands, {"events": {"onMouseDown": startCommand, "onTouchStart": startCommand}},
				this.props.children
			)
		);
		
		
	}
	
	static makeSelfContained(aElement, aValue = "") {
		
		return React.createElement(EditableProps, {"editableProps": "value", "value": aValue, "valueName": "value"}, aElement);
	}
}
