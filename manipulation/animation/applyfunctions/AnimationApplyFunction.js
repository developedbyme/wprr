import InputResolver from "wprr/manipulation/animation/inputresolvers/InputResolver";

//import AnimationApplyFunction from "wprr/manipulation/animation/applyfunctions/AnimationApplyFunction";
export default class AnimationApplyFunction {

	constructor() {
		
		this._currentValues = null;
		this._currentElement = null;
		
		this._inputs = new Object();
	}
	
	setInput(aName, aInput) {
		this._inputs[aName] = aInput;
		
		return this;
	}
	
	/**
	 * Sets an input of this function, and skipping null values.
	 *
	 * @param	aName	String		The name of the input.
	 * @param	aValue	*			The value of the input
	 *
	 * @return	AnimationApplyFunction	self
	 */
	setInputWithoutNull(aName, aValue) {
		if(aValue !== null && aValue !== undefined) {
			this.setInput(aName, aValue);
		}
		
		return this;
	}
	
	getInput(aName) {
		let input = this._inputs[aName];
		
		if(input) {
			//METODO: should there be source resolution here?
			
			if(input instanceof InputResolver) {
				return input.resolveValue(this._currentValues, this._currentElement);
			}
			return input;
		}
		else {
			console.error("Input with name " + aName + " doesn't exist.", this);
		}
	}
	
	setAnimationProps(aProps, aStyle) {
		//MENOTE: should be overridden
	}
	
	applyAnimation(aProps, aStyle, aAnimationValues, aElement) {
		
		this._currentValues = aAnimationValues;
		this._currentElement = aElement;
		
		this.setAnimationProps(aProps, aStyle);
		
		this._currentValues = null;
		this._currentElement = null;
	}
	
	addTransform(aStyle, aTransformOperation) {
		let previousTransform = "";
		if(aStyle["transform"]) {
			previousTransform = aStyle["transform"] + " ";
		}
		
		aStyle["transform"] = previousTransform + aTransformOperation;
	}
}
