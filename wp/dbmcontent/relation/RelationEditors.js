import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import RelationEditor from "./RelationEditor";
import UserRelationEditor from "./UserRelationEditor";

//import RelationEditors from "./RelationEditors";
export default class RelationEditors extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._editors = new Object();
		
		this._commands = Wprr.utils.InputDataHolder.create();
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
		
		newRelationEditor.addCommand("changed", Wprr.commands.callFunction(this, this._changed));
		
		objectPath.set(this._editors, [aDirection, aConnectionType, aObjectType], newRelationEditor);
		
		return newRelationEditor;
	}
	
	getEditorForAnyType(aDirection, aConnectionType) {
		
		let objectType = "any";
		
		let currentEditor = objectPath.get(this._editors, [aDirection, aConnectionType, objectType]);
		if(currentEditor) {
			return currentEditor;
		}
		
		let newRelationEditor = new RelationEditor();
		newRelationEditor.setItemConnection(this.item);
		newRelationEditor.setup(aDirection, aConnectionType, objectType);
		
		newRelationEditor.addCommand("changed", Wprr.commands.callFunction(this, this._changed));
		
		objectPath.set(this._editors, [aDirection, aConnectionType, objectType], newRelationEditor);
		
		return newRelationEditor;
	}
	
	getUserRelationsEditor(aConnectionType) {
		let currentEditor = objectPath.get(this._editors, ["userRelations", aConnectionType]);
		if(currentEditor) {
			return currentEditor;
		}
		
		let newRelationEditor = new UserRelationEditor();
		newRelationEditor.setItemConnection(this.item);
		newRelationEditor.setup(aConnectionType);
		
		newRelationEditor.addCommand("changed", Wprr.commands.callFunction(this, this._changed));
		
		objectPath.set(this._editors, ["userRelations", aConnectionType], newRelationEditor);
		
		return newRelationEditor;
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
		return this;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		
		switch(firstPart) {
			case "item":
				{
					let restParts = tempArray.join(".");
					return Wprr.objectPath(this[firstPart], restParts);
				}
			case "userRelations":
				{
					let connectionType = tempArray.shift();
					let restParts = tempArray.join(".");
					return Wprr.objectPath(this.getUserRelationsEditor(connectionType), restParts);
				}
				
		}
		let connectionType = tempArray.shift();
		
		let objectType = tempArray.shift();
		
		let restParts = tempArray.join(".");
		
		if(objectType === "*" || objectType === "any") {
			return Wprr.objectPath(this.getEditorForAnyType(firstPart, connectionType), restParts);
		}
		
		return Wprr.objectPath(this.getEditor(firstPart, connectionType, objectType), restParts);
	}
	
	_getAllEditors() {
		
		//METODO: cache the result
		
		let returnArray = new Array();
		
		for(let directionName in this._editors) {
			let direction = this._editors[directionName];
			for(let objectName in direction) {
				let connnection = direction[objectName];
				if(directionName === "userRelations") {
					returnArray.push(connnection);
				}
				else {
					for(let objectName in connnection) {
						let currentEditor = connnection[objectName];
						returnArray.push(currentEditor);
					}
				}
			}
		}
		
		return returnArray;
	}
	
	hasUnsavedChanges() {
		
		let currentArray = this._getAllEditors();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentEditor = currentArray[i];
			if(currentEditor.hasUnsavedChanges()) {
				return true;
			}
		}
		
		return false;
	}
	
	getSaveDatas() {
		
		let returnArray = new Array();
		
		let currentArray = this._getAllEditors();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentEditor = currentArray[i];
			if(currentEditor.hasUnsavedChanges()) {
				currentEditor.addSaveDatas(returnArray);
			}
		}
		
		return returnArray;
	}
	
	_changed() {
		//console.log("_changed");
		
		let commandName = "changed";
		if(this._commands.hasInput(commandName)) {
			Wprr.utils.CommandPerformer.perform(this._commands.getInput(commandName, {}, this), null, this);
		}
	}
}