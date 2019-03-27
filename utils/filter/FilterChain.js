import FilterPart from "wprr/utils/filter/parts/FilterPart";

// import FilterChain from "wprr/utils/filter/FilterChain";
/**
 * A chain of filters.
 */
export default class FilterChain extends FilterPart {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.inputs.setInput("filters", new Array());
		
	};
	
	_performFilter(aCurrentArray, aOriginalArray) {
		
		let returnArray = aCurrentArray;
		
		let filters = this.getInput("filters");
		let currentArray = filters;
		let curentarrayLength = currentArray.length;
		for(let i = 0; i < curentarrayLength; i++) {
			let currentFilter = currentArray[i];
			currentFilter.setPerformingElement(this._performingElement, this._props);
			returnArray = currentFilter.applyFilter(returnArray, aOriginalArray);
		}
		
		return returnArray;
	}
	
	filter(aArray, aPerformingElement, aProps = null) {
		let originalArray = [].concat(aArray);
		let currentArray = [].concat(originalArray);
		
		this.setPerformingElement(aPerformingElement, aProps);
		
		return this.applyFilter(currentArray, originalArray);
	}
	
	static create(aFilterParts = null, aActive = null) {
		let newFilterChain = new FilterChain();
		
		newFilterChain.inputs.setInputWithoutNull("filters", aFilterParts);
		newFilterChain.inputs.setInputWithoutNull("active", aActive);
		
		return newFilterChain;
	}
}