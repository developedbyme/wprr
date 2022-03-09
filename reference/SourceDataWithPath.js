"use strict";
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

// import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
export default class SourceDataWithPath extends SourceData {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/SourceDataWithPath::constructor");
		
		super();
		
		this._deepPath = null;
		this._debug_lastEvaluatedDeepValue = null;
	}
	
	_shouldUpdateOwner(aName, aOwner) {
		//console.log("SourceDataWithPath::_shouldUpdateOwner")
		if(aName) {
			let pathName = SourceDataWithPath.getDeepPathForOwner(this._deepPath, aOwner);
			//console.log(this._type, pathName, aName, aOwner, this);
			if(typeof(pathName) === "string") {
				let minLength = Math.min(pathName.length, aName.length);
				if(pathName.substring(0, minLength) !== aName.substring(0, minLength)) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	setDeepPath(aPath) {
		
		this._deepPath = aPath;
		
		return this;
	}
	
	updateValueFromObject(aValue, aFromObject) {
		
		let sourceData = super.getSource(aFromObject);
		
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSource(aFromObject);
		}
		
		if(sourceData instanceof Wprr.utils.AbstractDataStorage) {
			sourceData.updateValue(deepPath, aValue);
		}
		else {
			let valueData = Wprr.objectPath(sourceData, deepPath);
			if(valueData instanceof Wprr.utils.ValueSourceData) {
				valueData.updateValueFromObject(aValue, aFromObject);
			}
		}
		
		return this;
	}
	
	getUpdateSource(aFromObject) {
		//console.log("getUpdateSource");
		
		let returnValue = super.getUpdateSource(aFromObject);
		
		let sourceData = super.getSource(aFromObject);
		
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSource(aFromObject);
		}
		
		let valueData = Wprr.objectPath(sourceData, deepPath);
		if(valueData instanceof Wprr.utils.ValueSourceData) {
			returnValue = valueData;
		}
		
		return returnValue;
	}
	
	static getDeepPathForOwner(aDeepPath, aOwner) {
		let deepPath = aDeepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSource(aOwner);
		}
		
		return deepPath;
	}
	
	static getDeepPathValue(aData, aPath, aAdditionalInput, aFromObject) {
		
		let returnData = null;
		
		if(aData && aData.hasObjectPathHandling && aData.hasObjectPathHandling()) {
			
			if(aAdditionalInput && aData.setAdditionalDataBeforePath) {
				if(aAdditionalInput instanceof SourceData) {
					aAdditionalInput = aAdditionalInput.getSource(aFromObject);
				}
				aData.setAdditionalDataBeforePath(aAdditionalInput, aFromObject);
			}
			returnData = aData.getValueForPath(aPath);
		}
		else {
			returnData = Wprr.objectPath(aData, aPath);
		}
		
		return returnData;
	}
	
	getSource(aFromObject) {
		let sourceData = super.getSource(aFromObject);
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSource(aFromObject);
		}
		
		let returnData = SourceDataWithPath.getDeepPathValue(sourceData, deepPath, this._additionalInput, aFromObject);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSource(aFromObject);
		}
		
		this._debug_lastEvaluatedDeepValue = returnData;
		
		if(this._debug) {
			debugger;
		}
		
		return returnData;
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		let sourceData = super.getSourceInStateChange(aFromObject, aNewPropsAndState);
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSourceInStateChange(aFromObject, aNewPropsAndState);
		}
		
		let returnData = SourceDataWithPath.getDeepPathValue(sourceData, deepPath, this._additionalInput, aFromObject);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSourceInStateChange(aFromObject, aNewPropsAndState);
		}
		
		this._debug_lastEvaluatedDeepValue = returnData;
		
		if(this._debug) {
			debugger;
		}
		
		return returnData;
	}
	
	static create(aType, aPath, aDeepPath) {
		let newSourceDataWithPath = new SourceDataWithPath();
		
		newSourceDataWithPath.setup(aType, aPath);
		newSourceDataWithPath.setDeepPath(aDeepPath);
		
		return newSourceDataWithPath;
	}
}