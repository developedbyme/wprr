import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import RelationEditor from "./RelationEditor";
export default class RelationEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._direction = null;
		this._connectionType = null;
		this._objectType = null;
		
		this._commands = Wprr.utils.InputDataHolder.create();
		
	}
	
	setup(aDirection, aConnectionType, aObjectType) {
		this._direction = aDirection;
		this._connectionType = aConnectionType;
		this._objectType = aObjectType;
		
		this.externalStorage.createChangeCommands(this.path, this, Wprr.commands.callFunction(this, this._updateActiveRelations));
		this.externalStorage.createChangeCommands(this.path, this, Wprr.commands.callFunction(this, this._changed));
		this._updateActiveRelations();
		
		let ids = this.externalStorage.getValue(this.path);
		if(ids) {
			let currentArray = this.item.group.getItems(ids);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				currentItem.getType("editStorage").createChangeCommands("startAt,saved.startAt,endAt,saved.endAt", this, Wprr.commands.callFunction(this, this._changed));
			}
		}
		
		return this;
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
		return this;
	}
	
	get path() {
		return this._direction + "." + this._connectionType + "." + this._objectType;
	}
	
	get activePath() {
		return "active." + this._direction + "." + this._connectionType + "." + this._objectType;
	}
	
	get externalStorage() {
		return this.item.getType("relations");
	}
	
	get objectType() {
		return this._objectType;
	}
	
	get shortDirectionName() {
		return (this._direction === "outgoing") ? "out" : "in";
	}
	
	get directionIdName() {
		return (this._direction === "outgoing") ? "to" : "from";
	}
	
	_getLoader(aId, aMakePrivate = false) {
		//console.log("RelationEditor::_getLoader");
		//console.log(this);
		
		let loader = this.item.group.project.getLoader();
		
		let changeType = (this._direction === "outgoing") ? "dbm/addOutgoingRelation" : "dbm/addIncomingRelation";
		
		let changeData = new Wprr.utils.ChangeData();
		changeData.createChange(changeType, {"value": aId, "relationType": this._connectionType, "makePrivate": aMakePrivate});
		
		loader.setupJsonPost(this.item.group.project.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(this.item.id)), changeData.getEditData());
		
		return loader;
	}
	
	_setupRelation(aRelationId, aFromId, aToId) {
		
		let data = {"id": aRelationId, "fromId": aFromId, "toId": aToId, "startAt": -1, "endAt": -1, "status": "draft"};
		
		let item = this.item.group.getItem(aRelationId);
		if(!item.hasType("relation")) {
			let newRelation = new Wprr.utils.wp.dbmcontent.relation.Relation();
			newRelation.setup(data);
			item.addType("relation", newRelation);
			let editStorage = new Wprr.utils.DataStorage();
			item.addType("editStorage", editStorage);
			newRelation.connectToEditStorage(editStorage);
			editStorage.createChangeCommands("startAt,saved.startAt,endAt,saved.endAt", this, Wprr.commands.callFunction(this, this._changed));
			
			item.addType("data", data);
			item.addSingleLink("from", aFromId);
			item.addSingleLink("to", aToId);
			
			//console.log(">>>>>>>", item);
		}
	}
	
	_relationAdded(aId, aFromId, aToId) {
		//console.log("RelationEditor::_relationAdded");
		//console.log(aId, aToId);
		
		aId = 1*aId;
		
		this._setupRelation(aId, aFromId, aToId);
		
		this.externalStorage.addValueToArray(this.path, aId);
	}
	
	_addUpdateCommand(aLoader, aId) {
		if(this._direction === "outgoing") {
			aLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationAdded, [Wprr.source("event", "raw", "data.relationId"), this.item.id, aId]));
		}
		else {
			aLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationAdded, [Wprr.source("event", "raw", "data.relationId"), aId, this.item.id]));
		}
		
		return aLoader;
	}
	
	hasActiveRelationToItem(aId) {
		let currentArray = this.externalStorage.getValue(this.activePath);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRelationId = currentArray[i];
			let currentRelation = this.item.group.getItem(currentRelationId);
			if(Wprr.objectPath(currentRelation, this.directionIdName + ".id") === aId) {
				return true;
			}
		}
		
		return false;
	}
	
	add(aId) {
		//console.log("RelationEditor::add");
		//console.log(aId);
		
		let currentTime = moment().unix();
		
		let loader = this._getLoader(aId);
		this._addUpdateCommand(loader, aId);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setStartTimeAfterCreation, [Wprr.source("event", "raw", "data.relationId"), currentTime]));
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setStatusAfterCreation, [Wprr.source("event", "raw", "data.relationId"), "private"]));
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._changed, []));
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._added, [Wprr.source("event", "raw", "data.relationId")]));
		
		loader.load();
	}
	
	replaceWith(aId) {
		let currentTime = moment().unix();
		
		this.endAll(currentTime);
		
		if(aId > 0) {
			let loader = this._getLoader(aId);
			this._addUpdateCommand(loader, aId);
			
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setStartTimeAfterCreation, [Wprr.source("event", "raw", "data.relationId"), currentTime]));
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setStatusAfterCreation, [Wprr.source("event", "raw", "data.relationId"), "private"]));
			
			loader.load();
		}
		else {
			this._updateActiveRelations();
		}
	}
	
	endRelationNow(aId) {
		let currentTime = moment().unix();
		
		let currentRelation = this.item.group.getItem(aId).getType("relation");
		if(currentRelation) {
			currentRelation.endIfActive(currentTime);
		}
		
		this._updateActiveRelations();
	}
	
	_setStartTimeAfterCreation(aId, aTimestamp) {
		let currentRelation = this.item.group.getItem(aId).getType("relation");
		currentRelation.setStartAt(aTimestamp);
	}
	
	_setStatusAfterCreation(aId, aStatus) {
		let currentRelation = this.item.group.getItem(aId).getType("relation");
		currentRelation.setStatus(aStatus);
	}
	
	endAll(aTimestamp) {
		let currentArray = this.externalStorage.getValue(this.path);
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let currentRelation = this.item.group.getItem(currentId).getType("relation");
				if(currentRelation) {
					currentRelation.endIfActive(aTimestamp);
				}
			}
		}
	}
	
	hasUnsavedChanges() {
		//console.log("hasUnsavedChanges");
		
		let currentArray = this.externalStorage.getValue(this.path);
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let currentRelation = this.item.group.getItem(currentId).getType("relation");
				if(currentRelation.hasUnsavedChanges()) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	addSaveDatas(aReturnArray) {
		let currentArray = this.externalStorage.getValue(this.path);
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let currentRelation = this.item.group.getItem(currentId).getType("relation");
				if(currentRelation.hasUnsavedChanges()) {
					let saveData = currentRelation.getSaveData();
					aReturnArray.push(saveData);
				}
			}
		}
	}
	
	_updateActiveRelations() {
		//console.log("_updateActiveRelations");
		
		let activeArray = new Array();
		
		let currentTime = moment().unix();
		
		let ids = this.externalStorage.getValue(this.path);
		if(ids) {
			let currentArray = this.item.group.getItems(ids);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				let currentRelation = currentItem.getType("relation");
				if(currentRelation.isActiveAt(currentTime)) {
					activeArray.push(currentItem.id);
				}
			}
		}
		
		this.externalStorage.updateValue(this.activePath, activeArray);
	}
	
	_changed() {
		//console.log("_changed");
		
		let commandName = "changed";
		if(this._commands.hasInput(commandName)) {
			Wprr.utils.CommandPerformer.perform(this._commands.getInput(commandName, {}, this), null, this);
		}
	}
	
	_added(aId) {
		//console.log("_added");
		
		let commandName = "added";
		if(this._commands.hasInput(commandName)) {
			Wprr.utils.CommandPerformer.perform(this._commands.getInput(commandName, {}, this), aId, this);
		}
	}
}