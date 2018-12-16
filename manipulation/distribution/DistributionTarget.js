import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import DistributionTarget from "wprr/manipulation/distribution/DistributionTarget";
export default class DistributionTarget extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ReferenceInjection::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		var distributionName = "default";
		
		var distributionObject = this.getReference("distributions/" + distributionName);
		for(var objectName in distributionObject) {
			returnObject[objectName] = distributionObject[objectName];
		}
		
		return returnObject;
	}
}
