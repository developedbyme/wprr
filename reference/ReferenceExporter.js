import React from "react";
import PropTypes from "prop-types";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ReferenceExporter from "wprr/reference/ReferenceExporter";
export default class ReferenceExporter extends ManipulationBaseObject {

	constructor (props) {
		super(props);
	}
	
	getReferences() {
		return this.props.references;
	}
	
	getChildContext() {
		//console.log("wprr/reference/ReferenceExporter::getReferences")
		return {"references": this.props.references};
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ReferenceExporter::removeUsedProps");
		
		delete aReturnObject["references"];
		
		return aReturnObject;
	}
}

ReferenceExporter.childContextTypes = {
	"references": PropTypes.object
};
