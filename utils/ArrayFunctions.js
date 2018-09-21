import objectPath from "object-path";

//import ArrayFunctions from "wprr/utils/ArrayFunctions";
export default class ArrayFunctions {
	
	static arrayOrSeparatedString(aData, aSeparator = ",", aTrim = 3) {
		if(aData === null || aData === undefined) {
			return [];
		}
		else if(aData instanceof Array) {
			return aData;
		}
		else if(typeof(aData) === "string") {
			return aData.split(aSeparator); //METODO: trim
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
	
	static mapObjectToArray(aObject, aKeyField, aDataField, aKeyPrefix = "") {
		let returnArray = new Array();
		
		for(let objectName in aObject) {
			let currentEntry = aObject[objectName];
			
			let newObject = new Object();
			newObject[aKeyField] = objectName.substring(aKeyPrefix.length, objectName.length);
			newObject[aDataField] = currentEntry;
			
			returnArray.push(newObject);
		}
		
		return returnArray;
	}
}