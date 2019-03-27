import wprr from "wprr/Wprr";
import objectPath from "object-path";

import FilterPart from "wprr/utils/filter/parts/FilterPart";

// import FilterPartFunctions from "wprr/utils/filter/parts/FilterPartFunctions";
/**
 * Filtering functions to use for firlter parts.
 */
export default class FilterPartFunctions  {
	
	static matchField(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let matchValue = this.getInput("compareValue");
		let field = this.getInput("field");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			if(objectPath.get(currentItem, field) === matchValue) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createMatchField(aField, aCompareValue, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.matchField, aActive);
		
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("compareValue", aCompareValue);
		
		return newFilterPart;
	}
	
	static compareNumericField(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let matchValue = 1*this.getInput("compareValue");
		let field = this.getInput("field");
		let compareType = this.getInput("compareType");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = 1*objectPath.get(currentItem, field);
			
			let passes = false;
			console.log(compareType, currentValue, matchValue);
			
			switch(compareType) {
				case "<":
					if(currentValue < matchValue) {
						passes = true;
					}
					break;
				case "<=":
					if(currentValue <= matchValue) {
						passes = true;
					}
					break;
				case ">":
					if(currentValue > matchValue) {
						passes = true;
					}
					break;
				case ">=":
					if(currentValue >= matchValue) {
						passes = true;
					}
					break;
				case "===":
					if(currentValue === matchValue) {
						passes = true;
					}
					break;
				case "==":
					if(currentValue == matchValue) {
						passes = true;
					}
					break;
				case "!==":
					if(currentValue !== matchValue) {
						passes = true;
					}
					break;
				case "!=":
					if(currentValue != matchValue) {
						passes = true;
					}
					break;
			}
			
			if(passes) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createCompareNumericField(aField, aCompareValue, aCompareType = "=", aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.compareNumericField, aActive);
		
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("compareValue", aCompareValue);
		newFilterPart.inputs.setInput("compareType", aCompareType);
		
		return newFilterPart;
	}
}