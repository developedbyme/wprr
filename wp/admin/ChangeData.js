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
	
	setMeta(aField, aValue, aChangeType = "meta") {
		
		let changeValue = ChangeDataFunctions.createFieldData(aField, aValue);
		
		this.addChange(ChangeDataFunctions.createChangeData(aChangeType, changeValue));
		
		return this;
	}
}