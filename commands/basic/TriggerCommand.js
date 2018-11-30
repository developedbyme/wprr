import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import TriggerCommand from "wprr/commands/basic/TriggerCommand";
/**
 * Command that runs a trigger
 */
export default class TriggerCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("triggerName", null);
		this.setInput("value", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let triggerName = this.getInput("triggerName");
		let value = this.getInput("value");
		
		if(element) {
			if(element.trigger) {
				element.trigger(triggerName, value);
			}
			else {
				console.error("Element doesn't have a trigger function, can't set value " + triggerName + " with value " + value, element, this);
			}
		}
		else {
			console.error("Element is not set, can't trigger " + triggerName + " with value " + value, this);
		}
	}
	
	static create(aElement = null, aTriggerName = null, aValue = null) {
		let newTriggerCommand = new TriggerCommand();
		
		newTriggerCommand.setInputWithoutNull("element", aElement);
		newTriggerCommand.setInputWithoutNull("triggerName", aTriggerName);
		newTriggerCommand.setInputWithoutNull("value", aValue);
		
		return newTriggerCommand;
	}
}
