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
	
	static _compare(aA, aB, aCompareType) {
		switch(aCompareType) {
			case "<":
				return (aA < aB);
			case "<=":
				return (aA <= aB);
			case ">":
				return (aA > aB);
			case ">=":
				return (aA >= aB);
			case "===":
				return (aA === aB);
			case "==":
				return (aA == aB);
			case "!==":
				return (aA !== aB);
			case "!=":
				return (aA != aB);
			default:
				console.error("Unknown comparison " + aCompareType);
		}
		
		return false;
	}
	
	static _formatValue(aValue, aFormat) {
		switch(aFormat) {
			case "number":
				return 1*aValue;
			case "string":
				return ""+aValue;
		}
		
		return aValue;
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
			
			let passes = FilterPartFunctions._compare(currentValue, matchValue, compareType);
			
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
	
	static matchInArray(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let matchValues = this.getInput("compareValues");
		let field = this.getInput("field");
		let valueFormat = this.getInput("valueFormat");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentValue = objectPath.get(currentItem, field);
			if(valueFormat) {
				currentValue = FilterPartFunctions._formatValue(currentValue, valueFormat);
			}
			console.log(matchValues, currentValue);
			if(matchValues.indexOf(currentValue) !== -1) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createInArrayField(aField, aCompareValues, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.matchInArray, aActive);
		
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("compareValues", aCompareValues);
		
		return newFilterPart;
	}
}