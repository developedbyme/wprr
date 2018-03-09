import objectPath from "object-path";

// import AcfFunctions from "wprr/wp/AcfFunctions";
export default class AcfFunctions {
	
	static getAcfSubfieldData(aStartObject) {
		//console.log("wprr/wp/AcfFunctions::getAcfSubfieldData");
		//console.log(aStartObject);
		
		let passedPath = new Array();
		let currentObject = aStartObject;
		
		let currentArray = arguments;
		let currentArrayLength = currentArray.length;
		for(let i = 1; i < currentArrayLength; i++) {
			let currentPathPart = currentArray[i];
			
			passedPath.push(currentPathPart);
			
			if(!currentObject || !currentObject[currentPathPart]) {
				console.warn("No acf field for path", passedPath, "from start object", aStartObject);
				return null;
			}
			
			if(typeof(currentPathPart) === "string") {
				currentObject = currentObject[currentPathPart].value;
			}
			else {
				currentObject = currentObject[currentPathPart];
			}
		}
		
		return currentObject;
	}
	
	static getFirstObjectInArray(aArray) {
		if(aArray && aArray.length > 0) {
			return aArray[0];
		}
		return null;
	}
	
	static getRowIndexByFieldValue(aRows, aFieldName, aValue) {
		let currentArray = aRows;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			let currentValue = AcfFunctions.getAcfSubfieldData(currentRow, aFieldName);
			if(currentValue === aValue) {
				return i;
			}
		}
		return -1;
	}
	
	static getRowByFieldValue(aRows, aFieldName, aValue) {
		let index = AcfFunctions.getRowIndexByFieldValue(aRows, aFieldName, aValue);
		if(index === -1) {
			return null;
		}
		return aRows[index];
	}
}