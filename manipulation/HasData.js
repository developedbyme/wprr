import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

//import HasData from "wprr/manipulation/HasData";
export default class HasData extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/HasData::_removeUsedProps");
		
		delete aReturnObject["check"];
		delete aReturnObject["checkType"];
		
		return aReturnObject;
	}
	
	_checkData(aData, aType) {
		
		if(typeof(aType) === "string" && aType.indexOf("invert/") === 0) {
			return !this._checkData(aData, aType.substring(("invert/").length, aType.length));
		}
		
		switch(aType) {
			case "notEmpty":
				if(aData && aData.length > 0) {
					return true;
				}
				break;
			case "positiveValue":
				if(aData && 1*aData > 0) {
					return true;
				}
				break;
			case "greaterThan":
				if(aData && 1*aData > 1*this.getSourcedProp("compareValue")) {
					return true;
				}
				break;
			default:
				console.warn("Unknown check type " + aType + ". Using default.");
			case "default":
				if(aData) {
					return true;
				}
				break;
		}
		
		return false;
	}
	
	_renderMainElement() {
		//console.log("wprr/manipulation/HasData::_renderMainElement");
		
		let data = this.getSourcedProp("check");
		let type = this.getSourcedPropWithDefault("checkType", "default");
		
		if(this._checkData(data, type)) {
			return super._renderMainElement();
		}
		
		return null;
	}
}
