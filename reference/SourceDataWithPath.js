"use strict";

import objectPath from "object-path";

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
		return objectPath.get(sourceData, this._deepPath);
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		let sourceData = super.getSourceInStateChange(aFromObject, aNewPropsAndState);
		return objectPath.get(sourceData, this._deepPath);
	}
	
	static create(aType, aPath, aDeepPath) {
		let newSourceDataWithPath = new SourceDataWithPath();
		
		newSourceDataWithPath.setup(aType, aPath);
		newSourceDataWithPath.setDeepPath(aDeepPath);
		
		return newSourceDataWithPath;
	}
}