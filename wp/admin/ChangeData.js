import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import ChangeDataFunctions from "wprr/wp/admin/ChangeDataFunctions";

// import ChangeData from "wprr/wp/admin/ChangeData";
export default class ChangeData  {
	
	constructor() {
		this._title = "";
		this._changes = new Array();
		this._settings = new Object();
	}
	
	clone() {
		let newChangeData = new ChangeData();
		newChangeData._title = this._title;
		newChangeData._changes = Wprr.utils.object.copyViaJson(this._changes);
		newChangeData._settings = Wprr.utils.object.copyViaJson(this._settings);
		
		return newChangeData;
	}
	
	getCreateData() {
		let returnData = ChangeDataFunctions.createCreateData(this._title, this._changes);
		this._addSettingsToData(this._settings, returnData);
		return returnData;
	}
	
	getEditData() {
		let returnData = ChangeDataFunctions.createEditData(this._changes);
		this._addSettingsToData(this._settings, returnData);
		return returnData;
	}
	
	_addSettingsToData(aSettings, aReturnObject) {
		for(let objectName in aSettings) {
			aReturnObject[objectName] = aSettings[objectName];
		}
		return aReturnObject;
	}
	
	getChanges() {
		return this._changes;
	}
	
	addSetting(aName, aValue) {
		objectPath.set(this._settings, aName, aValue);
		
		return this;
	}
	
	addChanges(aChanges) {
		let currentArray = aChanges;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._changes.push(currentArray[i]);
		}
		
		return this;
	}
	
	addChange(aChange) {
		this._changes.push(aChange);
		
		return this;
	}
	
	createChange(aType, aData) {
		this.addChange(ChangeDataFunctions.createChangeData(aType, aData));
		
		return this;
	}
	
	setField(aField, aValue) {
		
		let currentChange = ChangeDataFunctions.createChangeDataWithSingleValue(aField, aValue);
		
		this.addChange(currentChange);
		
		return this;
	}
	
	setTitle(aTitle) {
		this._title = aTitle;
		
		this.setField("title", aTitle);
		
		return this;
	}
	
	setStatus(aStatus) {
		this.setField("status", aStatus);
		
		return this;
	}
	
	makePrivate() {
		this.setStatus("private");
		
		return this;
	}
	
	makePublic() {
		this.setStatus("publish");
		
		return this;
	}
	
	trash() {
		this.createChange("trash", null);
		
		return this;
	}
	
	setMeta(aField, aValue, aChangeType = "meta") {
		
		let changeValue = ChangeDataFunctions.createFieldData(aField, aValue);
		
		this.addChange(ChangeDataFunctions.createChangeData(aChangeType, changeValue));
		
		return this;
	}
	
	setTerms(aTerms, aTaxonomy, aField = "id", aChangeType = "terms") {
		let changeValue = ChangeDataFunctions.createFieldData(aField, aTerms);
		changeValue['taxonomy'] = aTaxonomy;
		
		this.addChange(ChangeDataFunctions.createChangeData(aChangeType, changeValue));
		
		return this;
	}
	
	setTerm(aTerm, aTaxonomy, aField = "id", aChangeType = "terms") {
		this.setTerms([aTerm], aTaxonomy, aField, aChangeType);
		
		return this;
	}
	
	addTerm(aTerm, aTaxonomy, aField = "id", aCreate = false) {
		this.setTerms([aTerm], aTaxonomy, aField, "addTerms");
		
		return this;
	}
	
	toggleTerm(aActive, aTerm, aTaxonomy, aField = "id") {
		
		let changeType = aActive ? "addTerms" : "removeTerms";
		
		this.setTerms([aTerm], aTaxonomy, aField, changeType);
	}
	
	createAndAddTerm(aSlug, aTaxonomy) {
		let changeValue = ChangeDataFunctions.createFieldData("slugPath", [aSlug]);
		changeValue['taxonomy'] = aTaxonomy;
		changeValue['create'] = true;
		
		this.addChange(ChangeDataFunctions.createChangeData("addTerms", changeValue));
		
		return this;
	}
	
	setRelation(aTerm, aPath, aField = "id") {
		
		let changeValue = new Object();
		changeValue['value'] = aTerm;
		changeValue['path'] = aPath;
		changeValue['field'] = aField;
		
		this.addChange(ChangeDataFunctions.createChangeData("dbm/relation", changeValue));
		
		return this;
	}
	
	setDataField(aField, aValue, aComment = null) {
		
		this.createChange("dbmtc/setField", {"field": aField, "value": aValue, "comment": aComment});
		
		return this;
	}
	
	addIncomingRelation(aPostId, aType, aMakePrivate = true, aReturnPrefix = null) {
		this.createChange("dbm/addIncomingRelation", {"relationType": aType, "value": aPostId, "makePrivate": aMakePrivate, "returnPrefix": aReturnPrefix});
		
		return this;
	}
	
	addOutgoingRelation(aPostId, aType, aMakePrivate = true, aReturnPrefix = null) {
		this.createChange("dbm/addOutgoingRelation", {"relationType": aType, "value": aPostId, "makePrivate": aMakePrivate, "returnPrefix": aReturnPrefix});
		
		return this;
	}
	
	replaceIncomingRelation(aPostId, aType, aObjectType, aReturnPrefix = null) {
		this.createChange("dbm/replaceIncomingRelation", {"relationType": aType, "objectType": aObjectType, "value": aPostId, "returnPrefix": aReturnPrefix});
		
		return this;
	}
	
	endIncomingRelations(aType, aObjectType) {
		this.createChange("dbm/endIncomingRelations", {"relationType": aType, "objectType": aObjectType});
		
		return this;
	}
	
	endOutgoingRelations(aType, aObjectType) {
		this.createChange("dbm/endOutgoingRelations", {"relationType": aType, "objectType": aObjectType});
		
		return this;
	}
	
	setIncomingRelations(aPostIds, aType, aObjectType) {
		this.createChange("dbm/endIncomingRelations", {"relationType": aType, "objectType": aObjectType});
		
		let currentArray = Wprr.utils.array.singleOrArray(aPostIds);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			this.createChange("dbm/addIncomingRelation", {"relationType": aType, "value": currentId, "makePrivate": true});
		}
		
		return this;
	}
	
	setOutgoingRelations(aPostIds, aType, aObjectType) {
		this.createChange("dbm/endOutgoingRelations", {"relationType": aType, "objectType": aObjectType});
		
		let currentArray = Wprr.utils.array.singleOrArray(aPostIds);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			this.createChange("dbm/addOutgoingRelation", {"relationType": aType, "value": currentId, "makePrivate": true});
		}
		
		return this;
	}
}