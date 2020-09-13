import Wprr from "wprr/Wprr";

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
		
		let aValue = aA;
		let bValue = aB;
		
		if(field) {
			aValue = Wprr.objectPath(aValue, field);
			bValue = Wprr.objectPath(bValue, field);
		}
		
		if(aValue === undefined || bValue === undefined) {
			console.warn("Undefined value in sort", aValue, bValue, this, aA, aB, field);
		}
		
		console.log(this);
		
		aValue = formatFunction.call(this, aValue);
		bValue = formatFunction.call(this, bValue);
		
		console.log(aValue, bValue);
		
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
	
	static createAccordingToOrder(aField, aOrder, aActive = null) {
		let newFieldSort = new FieldSort();
		
		newFieldSort.inputs.setInputWithoutNull("field", aField);
		newFieldSort.inputs.setInputWithoutNull("order", aOrder);
		newFieldSort.inputs.setInputWithoutNull("formatFunction", newFieldSort.format_accordingToOrder);
		newFieldSort.inputs.setInputWithoutNull("active", aActive);
		
		return newFieldSort;
	}
}