import AnimationApplyFunction from "wprr/manipulation/animation/applyfunctions/AnimationApplyFunction";

import ValueResolver from "wprr/manipulation/animation/inputresolvers/ValueResolver";
import ValueUnitResolver from "wprr/manipulation/animation/inputresolvers/ValueUnitResolver";
import InputResolver from "wprr/manipulation/animation/inputresolvers/InputResolver";

//import TransformApplyFunction from "wprr/manipulation/animation/applyfunctions/TransformApplyFunction";
export default class TransformApplyFunction extends AnimationApplyFunction {

	constructor() {
		super();
		
		this.setInput("operation", "notSet");
		this.setInput("valueNames", []);
		
	}
	
	setAnimationProps(aProps, aStyle) {
		
		let operation = this.getInput("operation");
		
		let valueNames = this.getInput("valueNames");
		let values = new Array(valueNames.length);
		
		let currentArray = valueNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = this.getInput(currentArray[i]);
			values[i] = currentValue;
		}
		
		this.addTransform(aStyle, operation + "(" + values.join(",") + ")");
	}
	
	static create(aOperation, aValues, aUnit = null) {
		let newTransformApplyFunction = new TransformApplyFunction();
		
		newTransformApplyFunction.setInput("operation", aOperation);
		
		if(typeof(aValues) === "string") {
			aValues = aValues.split(",");
		}
		
		let valueNames = new Array(aValues.length);
		
		let currentArray = aValues;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentInputName = "_input" + i;
			let currentInput = currentArray[i];
			if(currentInput instanceof InputResolver) {
				newTransformApplyFunction.setInput(currentInputName, currentInput);
			}
			else {
				if(aUnit !== null) {
					newTransformApplyFunction.setInput(currentInputName, ValueUnitResolver.create(currentInput, aUnit));
				}
				else {
					newTransformApplyFunction.setInput(currentInputName, ValueResolver.create(currentInput));
				}
			}
			valueNames[i] = currentInputName;
		}
		newTransformApplyFunction.setInput("valueNames", valueNames);
		
		return newTransformApplyFunction;
	}
}
