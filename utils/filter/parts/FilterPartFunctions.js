import Wprr from "wprr/Wprr";
import objectPath from "object-path";
import moment from "moment";

import FilterPart from "wprr/utils/filter/parts/FilterPart";

// import FilterPartFunctions from "wprr/utils/filter/parts/FilterPartFunctions";
/**
 * Filtering functions to use for filter parts.
 */
export default class FilterPartFunctions  {
	
	static matchField(aCurrentArray, aOriginalArray) {
		//console.log("wprr/utils/filter/parts/FilterPartFunctions::matchField");
		
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
	
	static matchFieldInArray(aCurrentArray, aOriginalArray) {
		//console.log("wprr/utils/filter/parts/FilterPartFunctions::matchFieldInArray");
		
		let returnArray = new Array();
		let ignoredArray = new Array();
		
		let matchValue = this.getInput("compareValue");
		let arrayField = this.getInput("arrayField");
		let field = this.getInput("field");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentArray2 = objectPath.get(currentItem, arrayField);
			if(currentArray2) {
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					
					let currentArrayItem = currentArray2[j];
					if(objectPath.get(currentArrayItem, field) === matchValue) {
						returnArray.push(currentItem);
						break;
					}
				}
			}
			
			ignoredArray.push(currentItem);
		}
		
		let invert = this.getInput("invert");
		if(invert) {
			return ignoredArray;
		}
		
		return returnArray;
	}
	
	static createMatchFieldInArray(aArrayField, aField, aCompareValue, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.matchFieldInArray, aActive);
		
		newFilterPart.inputs.setInput("arrayField", aArrayField);
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
			case "date":
				let theMoment = moment(aValue);
				if(!theMoment.isValid()) {
					return null;
				}
				return theMoment.format("Y-MM-DD");
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
		let ignoredArray = new Array();
		
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
			if(matchValues.indexOf(currentValue) !== -1) {
				returnArray.push(currentItem);
			}
			else {
				ignoredArray.push(currentItem);
			}
		}
		
		let invert = this.getInput("invert");
		if(invert) {
			return ignoredArray;
		}
		
		return returnArray;
	}
	
	static createInArrayField(aField, aCompareValues, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.matchInArray, aActive);
		
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("compareValues", aCompareValues);
		newFilterPart.inputs.setInput("valueFormat", "none");
		
		return newFilterPart;
	}
	
	static filterOutValues(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let ignoreValues = this.getInput("ignoreValues");
		let field = this.getInput("field");
		let valueFormat = this.getInput("valueFormat");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentValue = currentItem;
			if(field) {
				currentValue = objectPath.get(currentItem, field);
			}
			if(valueFormat) {
				currentValue = FilterPartFunctions._formatValue(currentValue, valueFormat);
			}
			
			if(ignoreValues.indexOf(currentValue) === -1) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createFilterOutValues(aIgnoreValues, aField = null, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.filterOutValues, aActive);
		
		newFilterPart.inputs.setInput("ignoreValues", aIgnoreValues);
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("valueFormat", "none");
		
		return newFilterPart;
	}
	
	static filterOutObjectProperties(aCurrentArray, aOriginalArray) {
		console.log("filterOutObjectProperties");
		console.log(this);
		
		let returnArray = new Array();
		
		let theObject = this.getInput("object");
		let field = this.getInput("field");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentValue = currentItem;
			if(field) {
				currentValue = objectPath.get(currentItem, field);
			}
			
			if(!theObject || theObject[currentValue] === undefined) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createFilterOutObjectProperties(aObject, aField = null, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.filterOutObjectProperties, aActive);
		
		newFilterPart.inputs.setInput("object", aObject);
		newFilterPart.inputs.setInput("field", aField);
		
		return newFilterPart;
	}
	
	static filterInDateRange(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let startDate = FilterPartFunctions._formatValue(this.getInput("startDate"), "date");
		let endDate = FilterPartFunctions._formatValue(this.getInput("endDate"), "date");
		let field = this.getInput("field");
		let valueFormat = this.getInput("valueFormat");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentValue = currentItem;
			if(field) {
				currentValue = objectPath.get(currentItem, field);
			}
			if(valueFormat) {
				currentValue = FilterPartFunctions._formatValue(currentValue, valueFormat);
			}
			
			if(startDate <= currentValue && endDate >= currentValue) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createInDateRange(aStartDate, aEndDate, aField = null, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.filterInDateRange, aActive);
		
		newFilterPart.inputs.setInput("valueFormat", "date");
		newFilterPart.inputs.setInput("startDate", aStartDate);
		newFilterPart.inputs.setInput("endDate", aEndDate);
		newFilterPart.inputs.setInput("field", aField);
		
		return newFilterPart;
	}
	
	static compareField(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let valueFormat = this.getInput("valueFormat");
		let matchValue = FilterPartFunctions._formatValue(this.getInput("compareValue"), valueFormat);
		let field = this.getInput("field");
		
		let compareType = this.getInput("compareType");
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = FilterPartFunctions._formatValue(objectPath.get(currentItem, field), valueFormat);
			
			let passes = FilterPartFunctions._compare(currentValue, matchValue, compareType);
			
			if(passes) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createCompareField(aField, aCompareValue, aCompareType = "=", aValueFormat = "string", aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.compareField, aActive);
		
		newFilterPart.inputs.setInput("field", aField);
		newFilterPart.inputs.setInput("compareValue", aCompareValue);
		newFilterPart.inputs.setInput("compareType", aCompareType);
		newFilterPart.inputs.setInput("valueFormat", aValueFormat);
		
		return newFilterPart;
	}
	
	static fieldsSearch(aCurrentArray, aOriginalArray) {
		let returnArray = new Array();
		
		let currentArray2 = this.getInput("fields");
		let currentArray2Length = currentArray2.length;
		let searchValue = this.getInput("searchValue");
		
		if(!searchValue) {
			return returnArray.concat(aCurrentArray);
		}
		
		searchValue = (""+searchValue).toLowerCase();
		
		let currentArray = aCurrentArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let passes = false;
			for(let j = 0; j < currentArray2Length; j++) {
				let fieldValue = (""+objectPath.get(currentItem, currentArray2[j])).toLowerCase();
				if(fieldValue.indexOf(searchValue) !== -1) {
					passes = true;
					break;
				}
			}
			
			if(passes) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	static createFieldsSearch(aFields, aSearchValue, aActive = null) {
		let newFilterPart = FilterPart.create(FilterPartFunctions.fieldsSearch, aActive);
		
		newFilterPart.inputs.setInput("fields", aFields);
		newFilterPart.inputs.setInput("searchValue", aSearchValue);
		
		return newFilterPart;
	}
}