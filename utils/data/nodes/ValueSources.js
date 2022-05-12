import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ValueSources from "./ValueSources";
export default class ValueSources extends BaseObject {
	
	constructor() {
		super();
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "sources":
			case "createSource":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.sources.create(firstPart), restParts);
	}
}