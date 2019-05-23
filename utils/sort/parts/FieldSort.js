import objectPath from "object-path";

import InputDataHolder from "wprr/utils/InputDataHolder";

import SortPart from "wprr/utils/sort/parts/SortPart";

// import FieldSort from "wprr/utils/sort/parts/FieldSort";
/**
 * A sort function that sorts on a field
 */
export default class FieldSort extends SortPart {
	
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
		
		if(aValue < bValue) {
			return -1;
		}
		else if(aValue > bValue) {
			return 1;
		}
		
		return 0;
	}
	
	static create(aField, aFormatFunction = null, aActive = null) {
		let newFieldSort = new FieldSort();
		
		newFieldSort.inputs.setInputWithoutNull("field", aField);
		newFieldSort.inputs.setInputWithoutNull("formatFunction", aFormatFunction);
		newFieldSort.inputs.setInputWithoutNull("active", aActive);
		
		return newFieldSort;
	}
	
	static createNumeric(aField, aActive = null) {
		let newFieldSort = new FieldSort();
		
		newFieldSort.inputs.setInputWithoutNull("field", aField);
		newFieldSort.inputs.setInputWithoutNull("formatFunction", SortPart.format_number);
		newFieldSort.inputs.setInputWithoutNull("active", aActive);
		
		return newFieldSort;
	}
}