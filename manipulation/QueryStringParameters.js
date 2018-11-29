import React from 'react';
import queryString from "query-string";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import QueryStringParameters from "wprr/manipulation/QueryStringParameters";
export default class QueryStringParameters extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._propsThatShouldNotCopy.push("parameters");
	}
	
	_getParameterNames() {
		let parameters = this.getSourcedProp("parameters");
		
		if(parameters) {
			let currentArray;
			if(typeof(parameters) === "string") {
				currentArray = parameters.split(","); //METODO: remove whitespace
			}
			else if(parameters instanceof Array) {
				currentArray = parameters;
			}
			return currentArray;
		}
		return [];
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/QueryStringParameters::_manipulateProps");
		
		let parsedQueryString = queryString.parse(location.search);
		
		let currentArray = this._getParameterNames();
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				if(parsedQueryString[currentName] !== undefined) {
					aReturnObject[currentName] = parsedQueryString[currentName];
				}
			}
		}
		
		return aReturnObject;
	}
}
