import InputDataHolder from "wprr/utils/InputDataHolder";

// import SortPart from "wprr/utils/sort/parts/SortPart";
/**
 * A sort function that is part of a sort chain.
 */
export default class SortPart  {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		this.inputs = InputDataHolder.create();
		this.inputs.setInput("active", true);
		this.inputs.setInput("sortFunction", this._performSortItem);
		this.inputs.setInput("formatFunction", this._formatValue);
		this.inputs.setInput("orderMultipler", 1);
		
		this._performingElement = null;
		this._props = null;
		
	};
	
	setPerformingElement(aElement, aProps = null) {
		this._performingElement = aElement;
		if(aProps === null) {
			aProps = aElement.props;
		}
		this._props = aProps;
		
		return this;
	}
	
	_formatValue(aValue) {
		return aValue
	}
	
	_performSortItem(aA, aB) {
		
		let formatFunction = this.getInput("formatFunction");
		aA = formatFunction.call(this, aA);
		aB = formatFunction.call(this, aB);
		
		if(aA < aB) {
			return -1;
		}
		else if(aA > aB) {
			return 1;
		}
		
		return 0;
	}
	
	setInput(aName, aValue) {
		this.inputs.setInput(aName, aValue);
		
		return this;
	}
	
	getInput(aName) {
		return this.inputs.getInput(aName, this._props, this._performingElement);
	}
	
	applySort(aA, aB) {
		console.log("wprr/utils/sort/parts/SortPart::applyFilter");
		
		let active = this.getInput("active");
		if(active) {
			let sortFunction = this.getInput("sortFunction");
			let orderMultipler = this.getInput("orderMultipler");
			return orderMultipler*sortFunction.call(this, aA, aB);
		}
		return 0;
	}
	
	activate() {
		this.inputs.setInput("active", true);
	}
	
	deactivate() {
		this.inputs.setInput("active", false);
	}
	
	setOrder(aOrder) {
		switch(aOrder) {
			case "asc":
				this.inputs.setInput("orderMultipler", 1);
				break;
			case "desc":
				this.inputs.setInput("orderMultipler", -1);
				break;
			default:
				console.warn("Unknown order " + aOrder, this);
				break;
		}
		
		return this;
	}
	
	static create(aSortFunction = null, aFormatFunction = null, aActive = null) {
		let newSortPart = new SortPart();
		
		newSortPart.inputs.setInputWithoutNull("sortFunction", aSortFunction);
		newSortPart.inputs.setInputWithoutNull("formatFunction", aFormatFunction);
		newSortPart.inputs.setInputWithoutNull("active", aActive);
		
		return newSortPart;
	}
	
	static createNumeric(aSortFunction = null, aActive = null) {
		let newSortPart = new SortPart();
		
		newSortPart.inputs.setInputWithoutNull("sortFunction", aSortFunction);
		newSortPart.inputs.setInputWithoutNull("formatFunction", SortPart.format_number);
		newSortPart.inputs.setInputWithoutNull("active", aActive);
		
		return newSortPart;
	}
	
	static format_number(aValue) {
		let returnValue = 1*aValue;
		if(isNaN(returnValue)) {
			returnValue = 0;
		}
		return returnValue;
	}
}