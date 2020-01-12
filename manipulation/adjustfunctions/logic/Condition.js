import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";
import ConditionEvaluation from "wprr/utils/logic/ConditionEvaluation";

//import Condition from "wprr/manipulation/adjustfunctions/logic/Condition";
/**
 * Adjust function that evaluates a condition.
 */
export default class Condition extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input1", SourceData.create("prop", "input1"));
		this.setInput("input2", SourceData.create("prop", "input2"));
		this.setInput("condition", SourceData.create("prop", "condition"));
		this.setInput("outputName", "output");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input1"];
		delete aProps["input2"];
		delete aProps["condition"];
	}
	
	/**
	 * Sets the class based on the prop.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/Condition::adjust");
		
		let input1 = this.getInput("input1", aData, aManipulationObject);
		let input2 = this.getInput("input2", aData, aManipulationObject);
		let condition = this.getInput("condition", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnValue = ConditionEvaluation.evaluateCondition(input1, condition, input2);
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput1		* | SourceData		The value of the first input.
	 * @param	aInput2		* | SourceData		The value of the second input.
	 * @param	aCondition	String | SourceData	The condition to test
	 * @param	aOutputName	String | SourceData	The name of the prop to set the data to.
	 *
	 * @return	Condition	The new instance.
	 */
	static create(aInput1 = null, aInput2 = null, aCondition = null, aOutputName = null) {
		let newCondition = new Condition();
		
		newCondition.setInputWithoutNull("input1", aInput1);
		newCondition.setInputWithoutNull("input2", aInput2);
		newCondition.setInputWithoutNull("condition", aCondition);
		newCondition.setInputWithoutNull("outputName", aOutputName);
		
		return newCondition;
	}
}
