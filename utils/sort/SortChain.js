import Wprr from "wprr/Wprr";

import SortPart from "wprr/utils/sort/parts/SortPart";

// import SortChain from "wprr/utils/sort/SortChain";
/**
 * A chain of sort functions.
 */
export default class SortChain extends SortPart {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.inputs.setInput("parts", new Array());
		
		this._performSortItemBound = this._performSortItem.bind(this);
	};
	
	setPerformingElement(aElement, aProps = null) {
		super.setPerformingElement(aElement, aProps);
		
		let currentArray = this.getInput("parts");
		let curentarrayLength = currentArray.length;
		for(let i = 0; i < curentarrayLength; i++) {
			let currentPart = currentArray[i];
			currentPart.setPerformingElement(aElement, aProps);
		}
	}
	
	_performSortItem(aA, aB) {
		let returnValue = 0;
		
		let currentArray = this.getInput("parts");
		let curentarrayLength = currentArray.length;
		for(let i = 0; i < curentarrayLength; i++) {
			let currentPart = currentArray[i];
			
			returnValue = currentPart.applySort(aA, aB);
			if(returnValue !== 0) {
				return returnValue;
			}
		}
		
		return returnValue;
	}
	
	sort(aArray, aPerformingElement, aProps = null) {
		let currentArray = aArray;
		
		this.setPerformingElement(aPerformingElement, aProps);
		currentArray.sort(this._performSortItemBound);
		
		return currentArray;
	}
	
	addPart(aPart) {
		
		let parts = this.getInput("parts");
		parts.push(aPart);
		this.inputs.getInput("parts", parts);
		
		return this;
	}
	
	removePart(aPart) {
		let parts = this.inputs.getInput("parts");
		
		let index = parts.indexOf(aPart);
		if(index >= 0) {
			parts.splice(index, 1);
		
			this.inputs.setInput("parts", parts);
		}
		
		return this;
	}
	
	addFieldSort(aField, aFormatFunction = null, aActive = null) {
		this.addPart(Wprr.utils.FieldSort.create(aField, aFormatFunction, aActive));
		
		return this;
	}
	
	static create(aParts = null, aActive = null) {
		let newSortChain = new SortChain();
		
		newSortChain.inputs.setInputWithoutNull("parts", aParts);
		newSortChain.inputs.setInputWithoutNull("active", aActive);
		
		return newSortChain;
	}
}