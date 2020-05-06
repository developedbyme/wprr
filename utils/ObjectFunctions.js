import objectPath from "object-path";
import Wprr from "wprr/Wprr";

//import ObjectFunctions from "wprr/utils/ObjectFunctions";
export default class ObjectFunctions {
	
	static groupFields(aObject, aFields, aGroupName) {
		
		let fields = Wprr.utils.array.arrayOrSeparatedString(aFields);
		
		let groupObject = new Object();
		let currentArray = fields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFieldName = currentArray[i];
			let currentValue = aObject[currentFieldName];
			delete aObject[currentFieldName];
			groupObject[currentFieldName] = currentValue;
		}
		
		aObject[aGroupName] = groupObject;
		
		return aObject;
	}
	
	static selectFields(aObject, aFields) {
		let fields = Wprr.utils.array.arrayOrSeparatedString(aFields);
		
		let returnArray = new Array();
		let currentArray = fields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(objectPath.get(aObject, currentArray[i]));
		}
		
		return returnArray;
	}
	
	static copyViaJson(aObject) {
		return JSON.parse(JSON.stringify(aObject));
	}
	
	static sumMerge(aObjectsArray) {
		let returnObject = new Object();
		
		let currentArray = aObjectsArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			for(let objectName in currentObject) {
				if(!returnObject[objectName]) {
					returnObject[objectName] = currentObject[objectName];
				}
				else {
					returnObject[objectName] += currentObject[objectName];
				}
			}
		}
		return returnObject;
	}
}