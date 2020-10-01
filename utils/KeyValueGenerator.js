import Wprr from "wprr/Wprr";

// import KeyValueGenerator from "wprr/utils/KeyValueGenerator";
export default class KeyValueGenerator {
	
	constructor() {
		
		this._values = new Array();
	}
	
	createNewObject(aKey, aAdditionalParameters = null) {
		let returnObject;
		if(aAdditionalParameters) {
			returnObject = Wprr.utils.object.copyViaJson(aAdditionalParameters);
		}
		else {
			returnObject = new Object();
		}
		
		returnObject["key"] = aKey;
		this._values.push(returnObject);
		
		return returnObject;
	}
	
	addKeyValue(aKey, aValue, aAdditionalParameters = null) {
		
		let newObject = this.createNewObject(aKey, aAdditionalParameters);
		newObject["value"] = aValue;
		
		return this;
	}
	
	addKeyLabel(aKey, aLabel, aAdditionalParameters = null) {
		
		let newObject = this.createNewObject(aKey, aAdditionalParameters);
		newObject["label"] = aLabel;
		
		return this;
	}
	
	addKeyValueLabel(aKey, aValue, aLabel, aAdditionalParameters = null) {
		
		let newObject = this.createNewObject(aKey, aAdditionalParameters);
		newObject["value"] = aValue;
		newObject["label"] = aLabel;
		
		return this;
	}
	
	addItems(aItemArrays) {
		let currentArray = aItemArrays;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._values.push(currentArray[i]);
		}
		
		return this;
	}
	
	getAsArray() {
		return this._values;
	}
	
	getIndexForKey(aKey) {
		return Wprr.utils.array.getItemIndexByIfExists("key", aKey, this._values);
	}
	
	static create() {
		let newKeyValueGenerator = new KeyValueGenerator();
		
		return newKeyValueGenerator;
	}
	
	static convertArrayToOptions(aArray, aValueField, aLabelField) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			
			let value = Wprr.objectPath(currentObject, aValueField);
			let label = Wprr.objectPath(currentObject, aLabelField);
			
			let encodedData = {"key": value, "value": value, "label": label, "item": currentObject};
			returnArray.push(encodedData);
		}
		
		return returnArray;
	}
	
	static normalizeOptions(aOptions) {
		let returnArray = new Array();
		
		if(!aOptions) {
			console.error("Options not set.", this);
			
			return returnArray;
		}
		
		let options = aOptions;
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentObject = currentArray[i];
				
				if(currentObject === null || currentObject === undefined) {
					console.error("Option is null.", i, currentArray);
					continue;
				}
				else if(typeof(currentObject) === "object") {
					
					let encodedData = {"key": currentObject["value"], "value": currentObject["value"], "label": currentObject["label"]};
					if(currentObject["additionalData"]) {
						encodedData["additionalData"] = currentObject["additionalData"];
					}
					
					returnArray.push(encodedData);
				}
				else {
					returnArray.push({"key": currentObject, "value": currentObject, "label": currentObject});
				}
			}
		}
		else {
			for(let objectName in options) {
				returnArray.push({"key": objectName, "value": objectName, "label": options[objectName]});
			}
		}
		
		return returnArray;
	}
	
	static normalizeArrayOrObject(aOptions) {
		let returnArray = new Array();
		
		if(!aOptions) {
			console.error("Options not set.", this);
			
			return returnArray;
		}
		
		let options = aOptions;
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentObject = currentArray[i];
				
				if(currentObject === null || currentObject === undefined) {
					console.error("Option is null.", i, currentArray);
					continue;
				}
				else if(typeof(currentObject) === "object") {
					
					let encodedData = {"key": currentObject["key"], "value": currentObject["value"], "label": currentObject["value"]};
					if(currentObject["additionalData"]) {
						encodedData["additionalData"] = currentObject["additionalData"];
					}
					
					returnArray.push(encodedData);
				}
				else {
					returnArray.push({"key": currentObject, "value": currentObject, "label": currentObject});
				}
			}
		}
		else {
			for(let objectName in options) {
				returnArray.push({"key": objectName, "value": options[objectName], "label": options[objectName]});
			}
		}
		
		return returnArray;
	}
	
	static tranlatedList(aOptions, aTextManager, aTranslationPath) {
		let returnArray = new Array();
		let currentArray = Wprr.utils.array.arrayOrSeparatedString(aOptions);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			let textPath = currentId;
			if(aTranslationPath) {
				textPath = aTranslationPath + "." + textPath;
			}
			
			let label = aTextManager.getTextOrId(textPath, currentId);
			returnArray.push({"key": currentId, "value": currentId, "label": label});
		}
		
		return returnArray;
	}
}