import React from "react";
import {Fragment} from "react";
import PropTypes from "prop-types";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import DeepDistribution from "wprr/manipulation/distribution/DeepDistribution";
export default class DeepDistribution extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
	}
	
	getChildContext() {
		//console.log("wprr/ReferenceInjection::getReferences")
		
		var distributions = new Object();
		
		var distributionName = "default";
		
		distributions[distributionName] = this._getMainElementProps();
		
		return {"distributions": distributions};
	}
}

DeepDistribution.childContextTypes = {
	"distributions": PropTypes.object
};
