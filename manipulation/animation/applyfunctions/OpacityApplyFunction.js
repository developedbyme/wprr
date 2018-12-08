import AnimationApplyFunction from "wprr/manipulation/animation/applyfunctions/AnimationApplyFunction";

import ValueResolver from "wprr/manipulation/animation/inputresolvers/ValueResolver";

//import OpacityApplyFunction from "wprr/manipulation/animation/applyfunctions/OpacityApplyFunction";
export default class OpacityApplyFunction extends AnimationApplyFunction {

	constructor() {
		super();
		
		this.setInput("opacity", ValueResolver.create("opacity"));
	}
	
	setAnimationProps(aProps, aStyle) {
		
		let opacity = this.getInput("opacity");
		aStyle["opacity"] = opacity;
	}
	
	static create(aValueResolver = null) {
		let newOpacityApplyFunction = new OpacityApplyFunction();
		
		newOpacityApplyFunction.setInputWithoutNull("opacity", aValueResolver);
		
		return newOpacityApplyFunction;
	}
}
