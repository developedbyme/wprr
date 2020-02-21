import Wprr from "wprr/Wprr";
import React from "react";

import InternalMessageGroup from "./InternalMessageGroup";

export default class Planning extends InternalMessageGroup {
	
	constructor() {
		super();
	}
	
	getTimeline(aPath) {
		let normalizedPath = Planning.getObjectPath(aPath);
		return this.getField(normalizedPath);
	}
	
	static getObjectPath(aPath) {
		let currentArray =  aPath.split(".");
		
		let returnArray = new Array();
		
		let currentArrayLength = currentArray.length;
		let lastPart = currentArray[currentArrayLength-1];
		
		if(lastPart === "_self") {
			currentArray.pop();
			currentArrayLength--;
		}
		
		let numberRegExp = new RegExp("^[0-9]+$");
		
		for(let i = 0; i < currentArrayLength; i++) {
			let currentPart = currentArray[i];
			returnArray
			
			let nextIndex = i+1;
			if(nextIndex < currentArrayLength) {
				let nextPart = currentArray[nextIndex];
				if(numberRegExp.test(nextPart)) {
					returnArray.push(nextPart);
					i++;
					continue;
				}
			}
			
			returnArray.push("0");
		}
		
		returnArray.push("_self");
		
		let returnString = returnArray.join(".");
		return returnString;
	}
	//METODO
}