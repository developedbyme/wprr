import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import MultipleRelations from "./MultipleRelations";
export default class MultipleRelations extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		
	}
	
	getRelation(aDirection, aConnectionType, aObjectType) {
		//console.log("getEditor");
		//console.log(aDirection, aConnectionType, aObjectType);
		
		let returnArray = new Array();
		
		let relations = this.item.getType("relations").getValue(aDirection + "." + aConnectionType + "." + aObjectType);
		if(relations) {
			let currentArray = relations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				returnArray.push(this.item.group.getItem(currentArray[i]));
			}
		}
		
		return returnArray;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		
		switch(firstPart) {
			case "item":
				let restParts = tempArray.join(".");
				return Wprr.objectPath(this[firstPart], restParts);
		}
		let connectionType = tempArray.shift();
		let objectType = tempArray.shift();
		
		let restParts = tempArray.join(".");
		
		return Wprr.objectPath(this.getRelation(firstPart, connectionType, objectType), restParts);
	}
}