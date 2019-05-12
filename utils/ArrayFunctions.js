import objectPath from "object-path";

//import ArrayFunctions from "wprr/utils/ArrayFunctions";
export default class ArrayFunctions {
	
	static trimArray(aArray, aMode = 3) {
		
		if(aMode > 0) {
			//METODO: use mode
			if(aArray) {
				let currentArray = aArray;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentString = currentArray[i];
				
					currentArray[i] = currentString.trim();
				}
			}
		}
		
		return aArray;
	}
	
	static arrayOrSeparatedString(aData, aSeparator = ",", aTrim = 3) {
		if(aData === null || aData === undefined) {
			return [];
		}
		else if(aData instanceof Array) {
			return aData;
		}
		else if(typeof(aData) === "string") {
			return ArrayFunctions.trimArray(aData.split(aSeparator));
		}
		
		console.error(aData + " is not array or string.");
		return [];
	}
	
	static numericArrayOrSeparatedString(aData, aSeparator = ",", aTrim = 3) {
		let returnArray = new Array();
		let currentArray = ArrayFunctions.arrayOrSeparatedString(aData, aSeparator, aTrim);
		let currentarrayLength = currentArray.length;
		for(let i = 0; i < currentarrayLength; i++) {
			returnArray.push(parseFloat(currentArray[i]));
		}
		
		return returnArray;
	}
	
	static mapArrayToObject(aArray, aKeyField, aDataField = null, aKeyPrefix = "") {
		
		let returnObject = new Object();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentArrayEntry = currentArray[i];
			let key = aKeyPrefix + objectPath.get(currentArrayEntry, aKeyField);
			let data = aDataField ? objectPath.get(currentArrayEntry, aDataField) : currentArrayEntry;
			
			returnObject[key] = data;
		}
		
		return returnObject;
	}
	
	static mapObjectToArray(aObject, aKeyField, aDataField = null, aKeyPrefix = "") {
		let returnArray = new Array();
		
		for(let objectName in aObject) {
			let currentEntry = aObject[objectName];
			let newObject = new Object();
			
			if(aDataField !== null) {
				newObject[aDataField] = currentEntry;
			}
			else {
				for(let objectName2 in currentEntry) {
					newObject[objectName2] = currentEntry[objectName2];
				}
			}
			newObject[aKeyField] = objectName.substring(aKeyPrefix.length, objectName.length);
			
			returnArray.push(newObject);
		}
		
		return returnArray;
	}
	
	static createRange(aStartValue, aEndValue, aStepValue = 1) {
		
		let returnArray = new Array();
		
		for(let i = aStartValue; i <= aEndValue; i += aStepValue) {
			returnArray.push(i);
		}
		
		return returnArray;
	}
	
	static getItemIndexBy(aField, aIdentifier, aArray) {
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = objectPath.get(currentArray[i], aField);
			if(currentValue == aIdentifier) {
				return i;
			}
		}
		
		console.warn("No item with field " + aField + " matching " + aIdentifier, aArray);
		return -1;
	}
	
	static getItemBy(aField, aIdentifier, aArray) {
		
		let index = ArrayFunctions.getItemIndexBy(aField, aIdentifier, aArray);
		
		if(index >= 0) {
			return aArray[index];
		}
		
		return null;
	}
	
	static mapField(aArray, aField) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(objectPath.get(currentArray[i], aField));
		}
		
		return returnArray;
	}
	
	static arrayFromSingleOrMultiple(aArrayOrItem) {
		if(Array.isArray(aArrayOrItem)) {
			return aArrayOrItem;
		}
		return [aArrayOrItem];
	}
}