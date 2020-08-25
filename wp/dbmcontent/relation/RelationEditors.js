import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import RelationEditor from "./RelationEditor";

//import RelationEditors from "./RelationEditors";
export default class RelationEditors extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._editors = new Object();
		
	}
	
	getEditor(aDirection, aConnectionType, aObjectType) {
		//console.log("getEditor");
		//console.log(aDirection, aConnectionType, aObjectType);
		
		let currentEditor = objectPath.get(this._editors, [aDirection, aConnectionType, aObjectType]);
		if(currentEditor) {
			return currentEditor;
		}
		
		let newRelationEditor = new RelationEditor();
		newRelationEditor.setItemConnection(this.item);
		newRelationEditor.setup(aDirection, aConnectionType, aObjectType);
		
		objectPath.set(this._editors, [aDirection, aConnectionType, aObjectType], newRelationEditor);
		
		return newRelationEditor;
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
		
		return Wprr.objectPath(this.getEditor(firstPart, connectionType, objectType), restParts);
	}
}