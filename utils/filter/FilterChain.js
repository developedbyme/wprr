import Wprr from "wprr/Wprr";

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
	
	setParts(aParts) {
		this.inputs.setInput("filters", aParts);
		
		return this;
	}
	
	removePart(aPart) {
		let parts = this.inputs.getInput("filters");
		
		let index = parts.indexOf(aPart);
		if(index >= 0) {
			parts.splice(index, 1);
		
			this.inputs.setInput("filters", parts);
		}
		
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
	
	addFieldsSearch(aFields, aSearchValue, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createFieldsSearch(aFields, aSearchValue, aActive));
		
		return this;
	}
	
	addMatchField(aField, aCompareValue, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createMatchField(aField, aCompareValue, aActive));
		
		return this;
	}
	
	addMatchFieldToAny(aField, aCompareValues, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createInArrayField(aField, aCompareValues, aActive));
		
		return this;
	}
	
	addFilterOutObjectProperties(aObject, aField = null, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createFilterOutObjectProperties(aObject, aField, aActive));
		
		return this;
	}
	
	addFilterOutValues(aIgnoreValues, aField = null, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createFilterOutValues(aIgnoreValues, aField, aActive));
		
		return this;
	}
	
	addDateRangeFilter(aStartDate, aEndDate, aField = null, aActive = null) {
		this.addPart(Wprr.utils.filterPartFunctions.createInDateRange(aStartDate, aEndDate, aField, aActive));
		
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
	
	getApplyAdjustFunction(aInput, aOutputName) {
		let adjustFunction = Wprr.adjusts.applyFilterChain(aInput, this, aOutputName);
		
		return adjustFunction;
	}
	
	static create(aFilterParts = null, aActive = null) {
		let newFilterChain = new FilterChain();
		
		newFilterChain.inputs.setInputWithoutNull("filters", aFilterParts);
		newFilterChain.inputs.setInputWithoutNull("active", aActive);
		
		return newFilterChain;
	}
}