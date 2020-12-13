import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import SingleRelation from "./SingleRelation";
export default class SingleRelation extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	getRelation(aDirection, aConnectionType, aObjectType, aOnlyActive = true) {
		//console.log("getEditor");
		//console.log(aDirection, aConnectionType, aObjectType);
		
		let relations = this.item.getType("relations").getValue(aDirection + "." + aConnectionType + "." + aObjectType);
		if(relations && relations.length > 0) {
			
			let currentArray = relations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let item = this.item.group.getItem(relations[i]);
				let relation = item.getType("relation");
				if(relation.isActiveNow() || !aOnlyActive) {
					return item;
				}
			}
		}
		
		return null;
	}
	
	getUserRelation(aConnectionType, aOnlyActive = true) {
		//console.log("getUserRelation");
		//console.log(aConnectionType);
		
		let relations = this.item.getType("relations").getValue("userRelations." + aConnectionType);
		if(relations && relations.length > 0) {
			
			let currentArray = relations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let item = this.item.group.getItem(relations[i]);
				let relation = item.getType("relation");
				if(relation.isActiveNow() || !aOnlyActive) {
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
		let onlyActive = true;
		
		switch(firstPart) {
			case "item":
				let restParts = tempArray.join(".");
				return Wprr.objectPath(this[firstPart], restParts);
			case "includeAll":
				onlyActive = false;
				firstPart = tempArray.shift();
				break;
		}
		let connectionType = tempArray.shift();
		
		if(firstPart === "userRelations") {
			let restParts = tempArray.join(".");
		
			return Wprr.objectPath(this.getUserRelation(connectionType, onlyActive), restParts);
		}
		
		let objectType = tempArray.shift();
		
		let restParts = tempArray.join(".");
		
		return Wprr.objectPath(this.getRelation(firstPart, connectionType, objectType, onlyActive), restParts);
	}
}