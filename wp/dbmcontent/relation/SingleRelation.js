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
		
		console.log(">>", this.item.getType("relations"));
		let relations = this.item.getType("relations").getValue(aDirection + "." + aConnectionType + "." + aObjectType);
		if(relations && relations.length > 0) {
			
			let currentArray = relations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let item = this.item.group.getItem(relations[i]);
				let relation = item.getType("relation");
				if(relation.isActiveNow()) {
					return item;
				}
			}
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
		
		return Wprr.objectPath(this.getRelation(firstPart, connectionType, objectType), restParts);
	}
}