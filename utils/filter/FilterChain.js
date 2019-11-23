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
	
	addPart(aPart) {
		let parts = this.inputs.getInput("filters");
		
		parts.push(aPart);
		
		this.inputs.setInput("filters", parts);
		
		return this;
	}
	
	addFunction(aFunction) {
		
		if(!aFunction) {
			console.error("Function is not set", this);
		}
		
		let newPart = FilterPart.create(aFunction);
		
		this.addPart(newPart);
		
		return this;
	}
	
	_performFilter(aCurrentArray, aOriginalArray) {
		//console.log("wprr/utils/filter/FilterChain::_performFilter");
		
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
		//console.log("wprr/utils/filter/FilterChain::filter");
		
		let originalArray = aArray;
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