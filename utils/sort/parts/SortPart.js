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
		this.inputs.setInput("orderMultiplier", 1);
		
		this._performingElement = null;
		this._props = null;
		
	};
	
	setPerformingElement(aElement, aProps = null) {
		this._performingElement = aElement;
		if(aProps === null) {
			if(aElement && aElement.props) {
				aProps = aElement.props;
			}
			else {
				aProps = {};
			}
		}
		this._props = aProps;
		
		return this;
	}
	
	_formatValue(aValue) {
		return aValue;
	}
	
	_performSortItem(aA, aB) {
		
		if(aA === undefined || aB === undefined) {
			console.warn("Undefined value in sort", aA, aB, this);
		}
		
		let formatFunction = this.getInput("formatFunction");
		if(formatFunction) {
			aA = formatFunction.call(this, aA);
			aB = formatFunction.call(this, aB);
		}
		
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
		//console.log("wprr/utils/sort/parts/SortPart::applyFilter");
		
		let active = this.getInput("active");
		if(active) {
			let sortFunction = this.getInput("sortFunction");
			let orderMultiplier = this.getInput("orderMultiplier");
			return orderMultiplier*sortFunction.call(this, aA, aB);
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
				this.inputs.setInput("orderMultiplier", 1);
				break;
			case "desc":
				this.inputs.setInput("orderMultiplier", -1);
				break;
			default:
				console.warn("Unknown order " + aOrder, this);
				break;
		}
		
		return this;
	}
	
	format_accordingToOrder(aValue) {
		//console.log("format_accordingToOrder");
		//console.log(aValue);
		
		let order = this.getInput("order");
		
		let sortIndex = -1;
		if(order) {
			sortIndex = order.indexOf(aValue);
			if(sortIndex === -1) {
				sortIndex = order.length;
			}
		}
		
		return sortIndex;
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
	
	static createAccordingToOrder(aOrder, aActive = null) {
		let newSortPart = new SortPart();
		
		newSortPart.inputs.setInputWithoutNull("order", aOrder);
		newSortPart.inputs.setInputWithoutNull("formatFunction", newSortPart.format_accordingToOrder);
		newSortPart.inputs.setInputWithoutNull("active", aActive);
		
		return newSortPart;
	}
	
	static format_none(aValue) {
		return aValue;
	}
	
	static format_number(aValue) {
		let returnValue = 1*aValue;
		if(isNaN(returnValue)) {
			returnValue = 0;
		}
		return returnValue;
	}
	
	static format_caseInsensitive(aValue) {
		return (""+aValue).toLowerCase();
	}
}