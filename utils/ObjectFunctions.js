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
	
	static tryCopyViaJson(aObject) {
		try {
			return Wprr.utils.object.copyViaJson(aObject);
		}
		catch(theError) {
			
		}
		
		return aObject;
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
	
	static shallowMerge(...aObjects) {
		let returnObject = new Object();
		
		let currentArray = aObjects;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			for(let objectName in currentObject) {
				console.log(objectName);
				returnObject[objectName] = currentObject[objectName];
			}
		}
		
		return returnObject;
	}
	
	static identifyProperty(aObject, aValue) {
		for(let objectName in aObject) {
			if(aObject[objectName] === aValue) {
				return objectName;
			}
		}
		//METODO: add warning
		return null;
	}
	
	static copyProperties(aFromObject, aToObject) {
		for(let objectName in aFromObject) {
			aToObject[objectName] = aFromObject[objectName];
		}
	}
	
	static isEqual(aValue1, aValue2) {
		if(aValue1 !== null && typeof(aValue1) === "object") {
			try {
				if(aValue1 instanceof FileList) {
					return (aValue1 === aValue2);
				}
				
				let isChanged = (JSON.stringify(aValue1) === JSON.stringify(aValue2));
				return isChanged;
			}
			catch(theError) {
				return (aValue1 === aValue2);
			}
		}
		else {
			return (aValue1 === aValue2);
		}
		
		
	}
	
	static getAllRecursiveLinks(aItem, aPath) {
		let returnArray = new Array();
		
		let currentItem = aItem;
		let debugCounter = 0;
		while(currentItem) {
			if(debugCounter++ > 1000) {
				console.error("getLinkedItems ran for too long");
				return null;
			}
			returnArray.push(currentItem);
			currentItem = Wprr.objectPath(currentItem, aPath);
		}
		
		return returnArray;
	}
}