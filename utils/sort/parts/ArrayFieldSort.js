import objectPath from "object-path";

import InputDataHolder from "wprr/utils/InputDataHolder";

import SortPart from "wprr/utils/sort/parts/SortPart";

// import ArrayFieldSort from "wprr/utils/sort/parts/ArrayFieldSort";
/**
 * A sort function that sorts on a field that contains an array
 */
export default class ArrayFieldSort extends SortPart {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.inputs.setInput("field", null);
		
	};
	
	_performSortItem(aA, aB) {
		
		let field = this.getInput("field");
		let formatFunction = this.getInput("formatFunction");
		
		if(field) {
			aA = objectPath.get(aA, field);
			aB = objectPath.get(aB, field);
		}
		
		let aValue = formatFunction(aA);
		let bValue = formatFunction(aB);
		
		let maxLength = Math.min(aValue.length, bValue.length);
		for(let i = 0; i < maxLength; i++) {
			if(aValue[i] < bValue[i]) {
				return -1;
			}
			else if(aValue[i] > bValue[i]) {
				return 1;
			}
		}
		
		if(aValue.length < bValue.length) {
			return -1;
		}
		else if(aValue.length > bValue.length) {
			return 1;
		}
		
		return 0;
	}
	
	static prefixedNumericFormat(aValue) {
		var prefixRegExp = new RegExp("^([^0-9]*)([0-9]*)(.*)$");
		var result = prefixRegExp.exec(""+aValue);
		
		let theNumber = parseInt(result[2], 10);
		if(isNaN(theNumber)) {
			theNumber = 0;
		}
		
		return [result[1], theNumber, result[3]];
	}
	
	static create(aField, aFormatFunction = null, aActive = null) {
		let newArrayFieldSort = new ArrayFieldSort();
		
		newArrayFieldSort.inputs.setInputWithoutNull("field", aField);
		newArrayFieldSort.inputs.setInputWithoutNull("formatFunction", aFormatFunction);
		newArrayFieldSort.inputs.setInputWithoutNull("active", aActive);
		
		return newArrayFieldSort;
	}
}