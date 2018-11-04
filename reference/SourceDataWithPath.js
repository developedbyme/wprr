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
	}
	
	setDeepPath(aPath) {
		
		this._deepPath = aPath;
		
		return this;
	}
	
	getSource(aFromObject) {
		let sourceData = super.getSource(aFromObject);
		let returnData = objectPathWithInheritedProps.get(sourceData, this._deepPath);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSource(aFromObject);
		}
		return returnData;
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		let sourceData = super.getSourceInStateChange(aFromObject, aNewPropsAndState);
		
		let returnData = objectPathWithInheritedProps.get(sourceData, this._deepPath);
		
		if(returnData instanceof SourceData) {
			returnData = returnData.getSourceInStateChange(aFromObject, aNewPropsAndState);
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