import React from "react";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import RangeDataInjection from "wprr/wp/postdata/RangeDataInjection";
export default class RangeDataInjection extends ReferenceInjection {

	constructor (props) {
		super(props);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/postdata/RangeDataInjection::_removeUsedProps");
		
		delete aReturnObject["rangeData"];
		
		return aReturnObject;
	}
	
	_getInjectData() {
		//console.log("wprr/wp/postdata/RangeDataInjection::_getInjectData");
		
		let returnObject = new Object();
		
		let previewData = this.getSourcedProp("rangeData");
		
		if(previewData) {
			returnObject["wprr/rangeData"] = previewData;
		}
		else {
			console.error("No range data provided.", this);
		}
		
		return returnObject;
	}
}
