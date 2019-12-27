"use strict";

import objectPath from "object-path";
const objectPathWithInheritedProps = objectPath.create({includeInheritedProps: true});

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
	
	setDeepPath(aPath) {
		
		this._deepPath = aPath;
		
		return this;
	}
	
	static getDeepPathValue(aData, aPath) {
		if(aData && aData.hasObjectPathHandling && aData.hasObjectPathHandling()) {
			return aData.getValueForPath(aPath);
		}
		
		let returnData = objectPathWithInheritedProps.get(aData, aPath);
		
		return returnData;
	}
	
	getSource(aFromObject) {
		let sourceData = super.getSource(aFromObject);
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSource(aFromObject);
		}
		
		let returnData = SourceDataWithPath.getDeepPathValue(sourceData, deepPath);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSource(aFromObject);
		}
		
		this._debug_lastEvaluatedDeepValue = returnData;
		
		return returnData;
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		let sourceData = super.getSourceInStateChange(aFromObject, aNewPropsAndState);
		let deepPath = this._deepPath;
		if(deepPath instanceof SourceData) {
			deepPath = deepPath.getSourceInStateChange(aFromObject, aNewPropsAndState);
		}
		
		let returnData = SourceDataWithPath.getDeepPathValue(sourceData, deepPath);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSourceInStateChange(aFromObject, aNewPropsAndState);
		}
		
		this._debug_lastEvaluatedDeepValue = returnData;
		
		return returnData;
	}
	
	static create(aType, aPath, aDeepPath) {
		let newSourceDataWithPath = new SourceDataWithPath();
		
		newSourceDataWithPath.setup(aType, aPath);
		newSourceDataWithPath.setDeepPath(aDeepPath);
		
		return newSourceDataWithPath;
	}
}