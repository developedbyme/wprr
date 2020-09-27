import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import SingleRelation from "./SingleRelation";
export default class SingleRelation extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		
	}
	
	getRelation(aDirection, aConnectionType, aObjectType) {
		//console.log("getEditor");
		//console.log(aDirection, aConnectionType, aObjectType);
		
		let relations = this.item.getType("relations").getValue(aDirection + "." + aConnectionType + "." + aObjectType);
		if(relations.length > 0) {
			return this.item.group.getItem(relations[0]);
		}
		
		return null;
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
		
		console.log(this.getRelation(firstPart, connectionType, objectType), restParts);
		return Wprr.objectPath(this.getRelation(firstPart, connectionType, objectType), restParts);
	}
}