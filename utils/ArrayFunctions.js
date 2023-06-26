import objectPath from "object-path";
import Wprr from "wprr/Wprr";

import moment from "moment";

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
					
					if(typeof(currentString) === "string") {
						currentArray[i] = currentString.trim();
					}
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
	
	static singleOrArray(aData) {
		if(aData === null || aData === undefined) {
			return [];
		}
		else if(aData instanceof Array) {
			return aData;
		}
		
		return [aData];
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
			let key = aKeyPrefix + Wprr.objectPath(currentArrayEntry, aKeyField);
			let data = aDataField ? Wprr.objectPath(currentArrayEntry, aDataField) : currentArrayEntry;
			
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
			if(aKeyField) {
				newObject[aKeyField] = objectName.substring(aKeyPrefix.length, objectName.length);
			}
			
			returnArray.push(newObject);
		}
		
		return returnArray;
	}
	
	static createRange(aStartValue, aEndValue, aStepValue = 1, aIncludeEndValue = true) {
		
		let returnArray = new Array();
		
		let loopCompare;
		 
		if(aStepValue > 0) {
			if(aIncludeEndValue) {
				loopCompare = function(aIndex, aLimit) {
					return aIndex <= aLimit;
				};
			}
			else {
				loopCompare = function(aIndex, aLimit) {
					return aIndex < aLimit;
				};
			}
		}
		else {
			if(aIncludeEndValue) {
				loopCompare = function(aIndex, aLimit) {
					return aIndex >= aLimit;
				};
			}
			else {
				loopCompare = function(aIndex, aLimit) {
					return aIndex > aLimit;
				};
			}
		}
		
		for(let i = aStartValue; loopCompare(i, aEndValue); i += aStepValue) {
			returnArray.push(i);
		}
		
		return returnArray;
	}
	
	static createDateRange(aStartDate, aEndDate, aStepValue = 1, aFormat = "Y-MM-DD") {
		
		let currentDate = moment(aStartDate);
		let endDate = moment(aEndDate);
		
		let returnArray = new Array();
		
		let debugCounter = 0;
		while(currentDate <= endDate) {
			if(debugCounter++ > 1000) {
				console.error("Loop ran for too long");
				break;
			}
			
			returnArray.push(currentDate.format(aFormat));
			currentDate.add(aStepValue, "day");
		}
		
		return returnArray;
	}
	
	static getAllItemsBy(aField, aIdentifier, aArray, aCompareType = "==") {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = Wprr.objectPath(currentArray[i], aField);
			if(Wprr.utils.filterPartFunctions._compare(currentValue, aIdentifier, aCompareType)) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static getItemIndexByIfExists(aField, aIdentifier, aArray, aCompareType = "==") {
		
		if(!Array.isArray(aArray)) {
			console.warn("No array provided", aArray);
			return -1;
		}
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = Wprr.objectPath(currentArray[i], aField);
			if(Wprr.utils.filterPartFunctions._compare(currentValue, aIdentifier, aCompareType)) {
				return i;
			}
		}
		
		return -1;
	}
	
	static hasItemBy(aField, aIdentifier, aArray, aCompareType = "==") {
		return ArrayFunctions.getItemIndexByIfExists(aField, aIdentifier, aArray, aCompareType) > -1;
	}
	
	static getItemIndexBy(aField, aIdentifier, aArray, aCompareType = "==") {
		let returnValue = ArrayFunctions.getItemIndexByIfExists(aField, aIdentifier, aArray, aCompareType);
		
		if(returnValue === -1) {
			console.warn("No item with field " + aField + " matching " + aIdentifier + "(" + aCompareType + ")", aArray);
		}
		
		return returnValue;
	}
	
	static getItemBy(aField, aIdentifier, aArray, aCompareType = "==") {
		
		let index = ArrayFunctions.getItemIndexBy(aField, aIdentifier, aArray, aCompareType);
		
		if(index >= 0) {
			return aArray[index];
		}
		
		return null;
	}
	
	static getItemByIfExists(aField, aIdentifier, aArray, aCompareType = "==") {
		
		let index = ArrayFunctions.getItemIndexByIfExists(aField, aIdentifier, aArray, aCompareType);
		
		if(index >= 0) {
			return aArray[index];
		}
		
		return null;
	}
	
	static getItemsBy(aField, aIdentifier, aArray, aCompareType = "==") {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = Wprr.objectPath(currentArray[i], aField);
			
			if(Wprr.utils.filterPartFunctions._compare(currentValue, aIdentifier, aCompareType)) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static selectItemsBy(aField, aValues, aArray, aCompareType = "==", aSkipNone = true) {
		let returnArray = new Array();
		
		let currentArray = aValues;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			let selectedValue = ArrayFunctions.getItemBy(aField, currentValue, aArray, aCompareType);
			if(aSkipNone && (selectedValue === null || selectedValue === undefined)) {
				continue;
			}
			returnArray.push(selectedValue);
		}
		
		return returnArray;
	}
	
	static mapField(aArray, aField) {
		
		if(!aArray) {
			console.error("No array provided");
			return [];
		}
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(Wprr.objectPath(currentArray[i], aField));
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
	
	static removeDuplicatesBy(aArray, aField) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			let matchValue = Wprr.objectPath(currentValue, aField);
			
			if(ArrayFunctions.getItemIndexBy(aField, matchValue, currentArray) === i) {
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
	
	static findMinorDiffs(aArray1, aArray2) {
		
		let length1 = aArray1.length;
		let length2 = aArray2.length;
		
		let minLength = Math.min(length1, length2);
		let maxLength = Math.max(length1, length2);
		
		let returnArray1 = new Array();
		let returnArray2 = new Array();
		
		for(let i = 0; i < minLength; i++) {
			let value1 = aArray1[i];
			let value2 = aArray2[i]
			if(value1 !== value2) {
				returnArray1.push(value1);
				returnArray2.push(value2);
			}
		}
		
		if(length1 > length2) {
			for(let i = minLength; i < maxLength; i++) {
				returnArray1.push(aArray1[i]);
			}
		}
		else if(length2 > length1) {
			for(let i = minLength; i < maxLength; i++) {
				returnArray2.push(aArray2[i]);
			}
		}
		
		return [returnArray1, returnArray2];
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
				let currentValue = Wprr.objectPath(currentItem, objectName);
				objectPath.set(renamedObject, aFieldConversions[objectName], currentValue);
			}
			returnArray.push(renamedObject);
		}
		
		return returnArray;
	}
	
	static convertFields(aArray, aFieldConversions, aFromObject = null) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let renamedObject = new Object();
			for(let objectName in aFieldConversions) {
				let currentValue;
				let path = aFieldConversions[objectName];
				if(Wprr.isSource(path)) {
					currentValue = path.getSourceInStateChange(aFromObject, {"event": {"item": currentItem}});
				}
				else {
					currentValue = Wprr.objectPath(currentItem, path);
				}
				
				objectPath.set(renamedObject, objectName, currentValue);
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
				let currentValue = Wprr.objectPath(currentItem, currentArray2[j]);
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
			
			let oldValue = Wprr.objectPath(currentItem, aField);
			let newValue = Wprr.objectPath(aConversions, oldValue);
			if(newValue === undefined) {
				newValue = aNoMatchValue;
			}
			objectPath.set(currentItem, aField, newValue);
		}
		
		return aArray;
	}
	
	static filterOnField(aArray, aField, aCompareValue, aCompareType = "==", aValueFormat = "string") {
		
		if(!aArray) {
			return [];
		}
		
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
				let currentGroup = aGroupPrefix + Wprr.objectPath(currentItem, aField);
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
	
	static groupArrayByFunction(aArray, aFunction, aGroupPrefix = "") {
		let groupNames = new Array();
		let groups = new Object();
		
		{
			let currentArray = aArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				let currentGroup = aGroupPrefix + aFunction(currentItem, i, currentArray);
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
	
	static convertValueToObjectInArray(aArray, aFieldName = "key") {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = new Object();
			currentObject[aFieldName] = currentArray[i];
			returnArray.push(currentObject);
		}
		
		return returnArray;
	}
	
	static renameValue(aArray, aInputValue, aOutputValue) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let value = currentArray[i];
			if(value === aInputValue) {
				value = aOutputValue;
			}
			
			returnArray.push(value);
		}
		
		return returnArray;
	}
	
	static _selectAllDeepValuesRecursive(aPathArray, aObject, aResolvedPath, aReturnArray) {
		//console.log("_selectAllDeepValuesRecursive");
		//console.log(aPathArray, aObject, aResolvedPath, aReturnArray);
		
		let newResolvedPath = [].concat(aResolvedPath);
		newResolvedPath.push(aObject);
		
		if(aPathArray.length > 0 && aObject !== null && aObject !== undefined) {
			let newPaths = [].concat(aPathArray);
			let nextStep = newPaths.shift();
			let nextObject = Wprr.objectPath(aObject, nextStep);
			
			if(Array.isArray(nextObject)) {
				let currentArray = nextObject;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					ArrayFunctions._selectAllDeepValuesRecursive(newPaths, currentArray[i], newResolvedPath, aReturnArray);
				}
			}
			else {
				ArrayFunctions._selectAllDeepValuesRecursive(newPaths, nextObject, newResolvedPath, aReturnArray);
			}
		}
		else {
			aReturnArray.push({"value": aObject, "path": newResolvedPath});
		}
	}
	
	static selectAllDeepValues(aPath, aObject) {
		let returnArray = new Array();
		let pathArray = ArrayFunctions.arrayOrSeparatedString(aPath, ".");
		
		if(Array.isArray(aObject)) {
			let currentArray = aObject;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				this._selectAllDeepValuesRecursive(pathArray, aObject[i], [], returnArray);
			}
		}
		else {
			this._selectAllDeepValuesRecursive(pathArray, aObject, [], returnArray);
		}
		
		return returnArray;
	}
	
	static sum(aArray) {
		let returnValue = 0;
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = 1*currentArray[i];
			if(isNaN(currentValue)) {
				console.error("NaN value in array", i, currentArray, currentArray[i]);
				continue;
			}
			returnValue += currentValue;
		}
		
		return returnValue;
	}
	
	static getBestItem(aArray, aCompareFunction, aQualifyFunction = null) {
		let bestItem = null;
		
		let qualifiedItems = aArray;
		if(aQualifyFunction) {
			let groups = ArrayFunctions.groupArrayByFunction(aArray, aQualifyFunction);
			qualifiedItems = objectPath.get(ArrayFunctions.getItemByIfExists("key", "true", groups), "value", []);
		}
		
		if(qualifiedItems.length > 0) {
			bestItem = qualifiedItems[0];
			let currentArray = qualifiedItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				if(aCompareFunction(currentArray[i], bestItem)) {
					bestItem = currentArray[i];
				}
			}
		}
		
		return bestItem;
	}
	
	static getBestItemByScore(aArray, aCompareFunction, aQualifyFunction = null) {
		let bestItem = null;
		
		let qualifiedItems = aArray;
		if(aQualifyFunction) {
			let groups = ArrayFunctions.groupArrayByFunction(aArray, aQualifyFunction);
			qualifiedItems = objectPath.get(ArrayFunctions.getItemByIfExists("key", "true", groups), "value", []);
		}
		
		//METODO: this function doesn't actually do any scoring
		
		if(qualifiedItems.length > 0) {
			bestItem = qualifiedItems[0];
			let currentArray = qualifiedItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				if(aCompareFunction(currentArray[i], bestItem)) {
					bestItem = currentArray[i];
				}
			}
		}
		
		return bestItem;
	}
	
	static addUniqueItemBy(aField, aItem, aArray) {
		let fieldData = objectPath.get(aItem, aField);
		let index = ArrayFunctions.getItemIndexByIfExists(aField, fieldData, aArray);
		if(index === -1) {
			aArray.push(aItem);
		}
	}
	
	static addUniqueItemsBy(aField, aItems, aArray) {
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			ArrayFunctions.addUniqueItemBy(aField, currentArray[i], aArray);
		}
	}
	
	static removeBy(aField, aValue, aArray) {
		let index = ArrayFunctions.getItemIndexByIfExists(aField, aValue, aArray);
		if(index >= 0) {
			aArray.splice(index, 1);
		}
	}
	
	static removeItemsBy(aField, aItems, aArray) {
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			ArrayFunctions.removeBy(aField, objectPath.get(currentArray[i], aField), aArray);
		}
	}
	
	static prefixItems(aItems, aPrefix) {
		
		let returnArray = new Array();
		
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(aPrefix + "" + currentArray[i]);
		}
		
		return returnArray;
	}
	
	static hasAnyValue(aArray) {
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(currentArray[i] !== undefined) {
				return true;
			}
		}
		
		return false;
	}
	
	static copy(aArray) {
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]);
		}
		
		return returnArray;
	}
	
	static containsAny(aArray, aItemsThatNeedToBeIncluded) {
		
		let currentArray = aItemsThatNeedToBeIncluded;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let selectedItem = currentArray[i];
			if(aArray.indexOf(selectedItem) !== -1) {
				return true;
			}
		}
		
		return false;
	}
	
	static containsAll(aArray, aItemsThatNeedToBeIncluded) {
		
		let currentArray = aItemsThatNeedToBeIncluded;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let selectedItem = currentArray[i];
			if(aArray.indexOf(selectedItem) === -1) {
				return false;
			}
		}
		
		return true;
	}
	
	static makeFlat(aArray) {
		
		let  returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray = returnArray.concat(currentArray[i]);
		}
		
		return returnArray;
	}
	
	static randomize(aArray, aNumberOfMoves = -1) {
		
		let length = aArray.length;
		if(aNumberOfMoves === -1) {
			aNumberOfMoves = length;
		}
		
		for(let i = 0; i < aNumberOfMoves; i++) {
			let startIndex = i%length;
			let endIndex = (startIndex+Math.floor(Math.random()*length))%length;
			
			let temp = aArray[startIndex];
			
			aArray[startIndex] = aArray[endIndex];
			aArray[endIndex] = temp;
		}
	}
	
	static _getAllItemsInHierarchyRecursive(aItems, aChildrenField, aReturnArray) {
		if(aItems) {
			let currentArray = aItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				
				if(currentItem) {
					aReturnArray.push(currentItem);
					let children = Wprr.objectPath(currentItem, aChildrenField);
					ArrayFunctions._getAllItemsInHierarchyRecursive(children, aChildrenField, aReturnArray);
				}
			}
		}
	}
	
	static getAllItemsInHierarchy(aItems, aChildrenField = "children") {
		let returnArray = new Array();
		
		if(aItems) {
			aItems = ArrayFunctions.singleOrArray(aItems);
		
			ArrayFunctions._getAllItemsInHierarchyRecursive(aItems, aChildrenField, returnArray);
		}
		
		return returnArray;
	}
	
	static count(aArray, aValue) {
		
		let returnValue = 0;
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(currentArray[i] === aValue) {
				returnValue++;
			}
		}
		
		return returnValue;
	}
	
	static insertBetween(aArray, aItem) {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength-1; i++) { //MENOTE: skip the last item and add it after
			returnArray.push(currentArray[i]);
			returnArray.push(aItem);
		}
		
		returnArray.push(currentArray[currentArray.length-1]);
		
		return returnArray;
	}
	
	static getPartOfArray(aArray, aStartAt, aEndAt) {
		
		let returnArray = new Array();
		
		let currentArray = aArray;
		aStartAt = Math.max(0, aStartAt);
		aEndAt = Math.min(currentArray.length, aEndAt);
		for(let i = aStartAt; i < aEndAt; i++) {
			returnArray.push(currentArray[i]);
		}
		
		return returnArray;
	}
	
	static splitArray(aArray, aGroupSize) {
		let returnArray = new Array();
		let currentGroup = null;
		
		let currentArray = aArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(i % aGroupSize === 0) {
				currentGroup = new Array();
				returnArray.push(currentGroup);
			}
			currentGroup.push(currentArray[i]);
		}
		
		return returnArray;
	}
}