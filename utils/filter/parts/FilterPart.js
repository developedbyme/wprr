import InputDataHolder from "wprr/utils/InputDataHolder";

// import FilterPart from "wprr/utils/filter/parts/FilterPart";
/**
 * A filter that is part of a filter function.
 */
export default class FilterPart  {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		this.inputs = InputDataHolder.create();
		this.inputs.setInput("active", true);
		this.inputs.setInput("filterFunction", this._performFilter);
		
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
	
	_performFilter(aCurrentArray, aOriginalArray) {
		
		//MENOTE: should be overridden
		
		return aCurrentArray;
	}
	
	setInput(aName, aValue) {
		this.inputs.setInput(aName, aValue);
		
		return this;
	}
	
	getInput(aName) {
		return this.inputs.getInput(aName, this._props, this._performingElement);
	}
	
	applyFilter(aCurrentArray, aOriginalArray) {
		console.log("wprr/utils/filter/parts/FilterPart::applyFilter");
		
		let active = this.getInput("active");
		if(active) {
			let filterFunction = this.getInput("filterFunction");
			return filterFunction.call(this, aCurrentArray, aOriginalArray);
		}
		return aCurrentArray;
	}
	
	activate() {
		this.inputs.setInput("active", true);
	}
	
	deactivate() {
		this.inputs.setInput("active", false);
	}
	
	static create(aFilterFunction = null, aActive = null) {
		let newFilterPart = new FilterPart();
		
		newFilterPart.inputs.setInputWithoutNull("filterFunction", aFilterFunction);
		newFilterPart.inputs.setInputWithoutNull("active", aActive);
		
		return newFilterPart;
	}
}