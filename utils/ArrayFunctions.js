import objectPath from "object-path";
import Wprr from "wprr/Wprr";

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
			if(aData === "") {
				return [];
			}
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
	
	static getItemIndexByIfExists(aField, aIdentifier, aArray) {
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = objectPath.get(currentArray[i], aField);
			if(currentValue == aIdentifier) {
				return i;
			}
		}
		
		return -1;
	}
	
	static getItemIndexBy(aField, aIdentifier, aArray) {
		let returnValue = ArrayFunctions.getItemIndexByIfExists(aField, aIdentifier, aArray);
		
		if(returnValue === -1) {
			console.warn("No item with field " + aField + " matching " + aIdentifier, aArray);
		}
		
		return returnValue;
	}
	
	static getItemBy(aField, aIdentifier, aArray) {
		
		let index = ArrayFunctions.getItemIndexBy(aField, aIdentifier, aArray);
		
		if(index >= 0) {
			return aArray[index];
		}
		
		return null;
	}
	
	static getItemsBy(aField, aIdentifier, aArray) {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = objectPath.get(currentArray[i], aField);
			if(currentValue == aIdentifier) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
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
	
	static removeDuplicates(aArray) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			if(returnArray.indexOf(currentValue) === -1) {
				returnArray.push(currentValue);
			}
		}
		
		return returnArray;
	}
	
	static removeValues(aArray, aRemoveValues) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			if(aRemoveValues.indexOf(currentValue) === -1) {
				returnArray.push(currentValue);
			}
		}
		
		return returnArray;
	}
	
	static castToFloat(aArray) {
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			currentArray[i] = parseFloat(currentArray[i]);
		}
		
		return aArray;
	}
	
	static arrayFromSingleOrMultiple(aArrayOrItem) {
		if(Array.isArray(aArrayOrItem)) {
			return aArrayOrItem;
		}
		return [aArrayOrItem];
	}
	
	static getUnselectedItems(aSelectedItems, aAllItems) {
		let returnItems = new Array();
		
		let currentArray = aAllItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			if(aSelectedItems.indexOf(currentItem) === -1) {
				returnItems.push(currentItem);
			}
		}
		
		return returnItems;
	}
	
	static selectAndMapObjectFields(aArray, aFieldConversions) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let renamedObject = new Object();
			for(let objectName in aFieldConversions) {
				let currentValue = objectPath.get(currentItem, objectName);
				objectPath.set(renamedObject, aFieldConversions[objectName], currentValue);
			}
			returnArray.push(renamedObject);
		}
		
		return returnArray;
	}
	
	static mergeFields(aArray, aField, aAdditionFields, aSeparator = " ") {
		
		let currentArray2 = ArrayFunctions.arrayOrSeparatedString(aAdditionFields);
		let currentArray2Length = currentArray2.length;
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let newValue = objectPath.get(currentItem, aField);
			for(let j = 0; j < currentArray2Length; j++) {
				let currentValue = objectPath.get(currentItem, currentArray2[j]);
				if(currentValue && currentValue !== "") {
					newValue += aSeparator + currentValue;
				}
				objectPath.del(currentItem, currentArray2[j]);
			}
			objectPath.set(currentItem, aField, newValue);
		}
		
		return aArray;
	}
	
	static convertValueInField(aArray, aField, aConversions, aNoMatchValue = null) {
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let oldValue = objectPath.get(currentItem, aField);
			let newValue = objectPath.get(aConversions, oldValue);
			if(newValue === undefined) {
				newValue = aNoMatchValue;
			}
			objectPath.set(currentItem, aField, newValue);
		}
		
		return aArray;
	}
	
	static filterOnField(aArray, aField, aCompareValue, aCompareType = "==", aValueFormat = "string") {
		let fieldFilter = Wprr.utils.FilterChain.create([
			Wprr.utils.filterPartFunctions.createCompareField(aField, aCompareValue, aCompareType, aValueFormat)
		]);
		
		return fieldFilter.filter(aArray);
	}
	
	static getPathsInObject(aObject, aReturnArray = [], aSeparator = "/", aPrefix = "", aRecursionLimit = 256) {
		for(let objectName in aObject) {
			let currentData = aObject[objectName];
			
			if(typeof(currentData) !== 'object' && currentData.constructor !== Object) {
				aReturnArray.push({"key": aPrefix + objectName, "value": currentData});
			}
			else {
				let newRecursionLimit = (aRecursionLimit > 0) ? aRecursionLimit-- : aRecursionLimit;
				if(newRecursionLimit === -1 || newRecursionLimit > 0) {
					ArrayFunctions.getPathsInObject(currentData, aReturnArray, aSeparator, aPrefix + objectName + aSeparator, newRecursionLimit);
				}
				else {
					console.log("Part of object ignored due to recursion limit");
				}
			}
		}
		
		return aReturnArray;
	}
	
	static groupArray(aArray, aField, aGroupPrefix = "") {
		let groupNames = new Array();
		let groups = new Object();
		
		{
			let currentArray = aArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				let currentGroup = aGroupPrefix + objectPath.get(currentItem, aField);
				if(!groups[currentGroup]) {
					groups[currentGroup] = new Array();
					groupNames.push(currentGroup);
				}
				groups[currentGroup].push(currentItem);
			}
		}
		
		let returnArray = new Array();
		
		{
			let currentArray = groupNames;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let groupName = currentArray[i];
				let returnItem = new Object()
				returnItem["key"] = groupName;
				returnItem["value"] = groups[groupName];
				
				returnArray.push(returnItem);
			}
		}
		
		return returnArray;
	}
}