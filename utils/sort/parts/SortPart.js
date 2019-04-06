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
		this.inputs.setInput("filterFunction", this._performSortItem);
		
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
	
	_performSortItem(aA, aB) {
		
		//MENOTE: should be overridden
		
		return 0;
	}
	
	getInput(aName) {
		return this.inputs.getInput(aName, this._props, this._performingElement);
	}
	
	applySort(aA, aB) {
		console.log("wprr/utils/sort/parts/SortPart::applyFilter");
		
		let active = this.getInput("active");
		if(active) {
			let filterFunction = this.getInput("filterFunction");
			return filterFunction.call(this, aA, aB);
		}
		return 0;
	}
	
	activate() {
		this.inputs.setInput("active", true);
	}
	
	deactivate() {
		this.inputs.setInput("active", false);
	}
	
	static create(aFilterFunction = null, aActive = null) {
		let newSortPart = new SortPart();
		
		newSortPart.inputs.setInputWithoutNull("filterFunction", aFilterFunction);
		newSortPart.inputs.setInputWithoutNull("active", aActive);
		
		return newSortPart;
	}
}