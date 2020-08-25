import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import InputDataHolder from "wprr/utils/InputDataHolder";

// import DataStorageChangeCommands from "wprr/utils/DataStorageChangeCommands";
export default class DataStorageChangeCommands {
	
	constructor() {
		this.inputs = new InputDataHolder();
		
		this._dataStorage = null;
		this._lastExceutedHash = null;
		
	}
	
	setup(aValueNames, aPerformingObject) {
		
		this.inputs.setInputWithoutNull("valueNames", aValueNames);
		this.inputs.setInputWithoutNull("performingObject", aPerformingObject);
		
		return this;
	}
	
	setDataStorage(aDataStorage) {
		if(aDataStorage !== this._dataStorage) {
			if(this._dataStorage) {
				this.removeDataStorage();
			}
		
			this._dataStorage = aDataStorage;
			this._dataStorage.addOwner(this);
		}
		
		return this;
	}
	
	setCommands(aCommands) {
		this.inputs.setInputWithoutNull("commands", aCommands);
		
		return this;
	}
	
	removeDataStorage() {
		if(this._dataStorage) {
			this._dataStorage.removeOwner(this);
		}
		
		return this;
	}
	
	externalDataChange() {
		//console.log("DataStorageChangeCommands::externalDataChange");
		
		let performingObject = this.inputs.getRawInput("performingObject");
		
		let props = performingObject ? performingObject.props : {};
		
		let valueNames = this.inputs.getInput("valueNames", props, performingObject);
		
		let dataObject = new Object();
		
		let currentArray = Wprr.utils.array.arrayOrSeparatedString(valueNames);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			objectPath.set(dataObject, currentName, this._dataStorage.getValue(currentName));
			
		}
		
		let currentHash = JSON.stringify(dataObject);
		if(this._lastExceutedHash !== currentHash) {
			this._lastExceutedHash = currentHash;
			let commands = this.inputs.getInput("commands", props, performingObject);
			Wprr.utils.commandPerformer.perform(commands, dataObject, performingObject);
		}
	}
}