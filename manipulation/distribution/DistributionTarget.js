import React from 'react';

import PropTypes from 'prop-types';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import DistributionTarget from "wprr/manipulation/distribution/DistributionTarget";
export default class DistributionTarget extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ReferenceInjection::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		var distributionName = "default";
		
		var distributionObject = this.context.distributions[distributionName];
		for(var objectName in distributionObject) {
			returnObject[objectName] = distributionObject[objectName];
		}
		
		return returnObject;
	}
}

DistributionTarget.contextTypes = {
	"distributions": PropTypes.object
};
