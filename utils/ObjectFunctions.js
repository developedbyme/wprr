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
	
	static copyViaJson(aObject) {
		return JSON.parse(JSON.stringify(aObject));
	}
}