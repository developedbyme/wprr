import React from 'react';
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

//import HasData from "wprr/manipulation/HasData";
export default class HasData extends ManipulationBaseObject {

	_construct() {
		super._construct();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/HasData::_removeUsedProps");
		
		delete aReturnObject["check"];
		delete aReturnObject["checkType"];
		delete aReturnObject["compareValue"];
		
		return aReturnObject;
	}
	
	_checkData(aData, aType) {
		
		if(typeof(aType) === "string") {
			if(aType.indexOf("invert/") === 0) {
				return !this._checkData(aData, aType.substring(("invert/").length, aType.length));
			}
			else if(aType.indexOf("length/") === 0) {
				return this._checkData(Wprr.objectPath(aData, "length"), aType.substring(("length/").length, aType.length));
			}
		}
		
		let compareValue = this.getFirstInput("compareValue");
		
		if(typeof(aType) === "function") {
			let checkFunction = aType;
			return checkFunction(aData, compareValue, this);
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
				if(aData && 1*aData > 1*compareValue) {
					return true;
				}
				break;
			case "equal":
				if(aData == compareValue) {
					return true;
				}
				break;
			case "strictEqual":
				if(aData === compareValue) {
					return true;
				}
				break;
			case "exists":
				if(aData !== null && aData !== undefined) {
					return true;
				}
				break;
			default:
				return Wprr.utils.filterPartFunctions._compare(aData, compareValue, aType);
			case null:
			case undefined:
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
		
		let data = this.getFirstInput("check");
		let type = this.getFirstInputWithDefault("checkType", "default");
		
		if(this._checkData(data, type)) {
			return super._renderMainElement();
		}
		
		return null;
	}
}
