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
		//MENOTE: should be overridden
		let aValue = formatFunction(objectPath.get(aA, field));
		let bValue = formatFunction(objectPath.get(aB, field));
		
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
}