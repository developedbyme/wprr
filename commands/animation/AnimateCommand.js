import Wprr from "wprr/Wprr";
import TWEEN from "@tweenjs/tween.js";

import BaseCommand from "wprr/commands/BaseCommand";

import SourceData from "wprr/reference/SourceData";

//import AnimateCommand from "wprr/commands/animation/AnimateCommand";
/**
 * Command that triggers an animation
 */
export default class AnimateCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("animationControl", SourceData.create("reference", "control/animation"));
		this.setInput("values", {});
		this.setInput("time", 0.5);
		this.setInput("easingFunction", TWEEN.Easing.Quadratic.Out);
		this.setInput("delay", 0);
		this.setInput("completeCommands", null);
		
	}
	
	perform() {
		
		let animationControl = this.getInput("animationControl");
		let values = this.getInput("values");
		let time = this.getInput("time");
		let easingFunction = this.getInput("easingFunction");
		let delay = this.getInput("delay");
		let completeCommands = this.getInput("completeCommands");
		
		if(animationControl) {
			if(animationControl.animate) {
				animationControl.animate(values, time, easingFunction, delay, completeCommands);
			}
			else {
				console.error("Control doesn't have an animate function, can't animate values " + values, animationControl, this);
			}
		}
		else {
			console.error("Control is not set, can't animate values " + values, this);
		}
	}
	
	static create(aAnimationControl = null, aValues = null, aTime = null, aEasingFunction = null, aDelay  = null, aCompleteCommands = null) {
		let newAnimateCommand = new AnimateCommand();
		
		newAnimateCommand.setInputWithoutNull("animationControl", aAnimationControl);
		newAnimateCommand.setInputWithoutNull("values", aValues);
		newAnimateCommand.setInputWithoutNull("time", aTime);
		newAnimateCommand.setInputWithoutNull("easingFunction", aEasingFunction);
		newAnimateCommand.setInputWithoutNull("delay", aDelay);
		newAnimateCommand.setInputWithoutNull("completeCommands", aCompleteCommands);
		
		return newAnimateCommand;
	}
}
