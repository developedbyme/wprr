import ChangeDataFunctions from "wprr/wp/admin/ChangeDataFunctions";

// import ChangeData from "wprr/wp/admin/ChangeData";
export default class ChangeData  {
	
	constructor() {
		this._title = "";
		this._changes = new Array();
	}
	
	getCreateData() {
		return ChangeDataFunctions.createCreateData(this._title, this._changes);
	}
	
	getEditData() {
		return ChangeDataFunctions.createEditData(this._changes);
	}
	
	getChanges() {
		return this._changes;
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
	
	setTerm(aTerms, aTaxonomy, aField = "id", aChangeType = "terms") {
		this.setTerms([aTerms], aTaxonomy, aField, aChangeType);
		
		return this;
	}
	
	toggleTerm(aActive, aTerm, aTaxonomy, aField = "id") {
		
		let changeType = aActive ? "addTerms" : "removeTerms";
		
		this.setTerms([aTerm], aTaxonomy, aField, changeType);
	}
	
	setRelation(aTerm, aPath, aField = "id") {
		
		let changeValue = new Object();
		changeValue['value'] = aTerm;
		changeValue['path'] = aPath;
		changeValue['field'] = aField;
		
		this.addChange(ChangeDataFunctions.createChangeData("dbm/relation", changeValue));
		
		return this;
	}
}