import Wprr from "wprr/Wprr";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";
import ConditionEvaluation from "wprr/utils/logic/ConditionEvaluation";

//import ClassFromComparison from "wprr/manipulation/adjustfunctions/css/ClassFromComparison";
/**
 * Adjust function that adds a class based on a condition
 */
export default class ClassFromComparison extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("value1", null);
		this.setInput("value2", null);
		
		this.setInput("condition", "===");
		
		this.setInput("trueValue", "active");
		this.setInput("falseValue", null);
		
		this.setInput("propToAddTo", "className");
	}
	
	/**
	 * Checks if the url is at path
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/css/ClassFromComparison::adjust");
		
		let input1 = this.getInput("input1", aData, aManipulationObject);
		let input2 = this.getInput("input2", aData, aManipulationObject);
		let condition = this.getInput("condition", aData, aManipulationObject);
		let propToAddTo = this.getInput("propToAddTo", aData, aManipulationObject);
		let trueValue = this.getInput("trueValue", aData, aManipulationObject);
		let falseValue = this.getInput("falseValue", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnValue = ConditionEvaluation.evaluateCondition(input1, condition, input2);
		let addValue = returnValue ? trueValue : falseValue;
		
		let originalValue = this.resolveSource(aData[propToAddTo], aData, aManipulationObject);
		if(addValue) {
			if(!originalValue) {
				aData[propToAddTo] = addValue;
			}
			else {
				aData[propToAddTo] = originalValue + " " + addValue;
			}
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput1		* | SourceData		The value of the first input.
	 * @param	aInput2		* | SourceData		The value of the second input.
	 * @param	aCondition	String | SourceData	The condition to test
	 * @param	aTrueValue	String | SourceData	The class to add if evaluation is true.
	 * @param	aFalseValue	String | SourceData	The class to add if evaluation is false.
	 * @param	aOutputName	String | SourceData	The name of the prop to set the data to.
	 *
	 * @return	ClassFromComparison	The new instance.
	 */
	static create(aInput1 = null, aInput2 = null, aCondition = null, aTrueValue = null, aFalseValue = null, aOutputName = null) {
		let newClassFromComparison = new ClassFromComparison();
		
		newClassFromComparison.setInputWithoutNull("input1", aInput1);
		newClassFromComparison.setInputWithoutNull("input2", aInput2);
		newClassFromComparison.setInputWithoutNull("condition", aCondition);
		newClassFromComparison.setInputWithoutNull("trueValue", aTrueValue);
		newClassFromComparison.setInputWithoutNull("falseValue", aFalseValue);
		newClassFromComparison.setInputWithoutNull("outputName", aOutputName);
		
		return newClassFromComparison;
	}
}
