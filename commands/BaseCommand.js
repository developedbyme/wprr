import SourceData from "wprr/reference/SourceData";

//import BaseCommand from "wprr/commands/BaseCommand";
/**
 * Base object for commands.
 */
export default class BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		this._triggerElement = null;
		this._eventData = null;
		this._inputs = new Object();
	}
	
	setTriggerElement(aElement) {
		this._triggerElement = aElement;
		
		return this;
	}
	
	setEventData(aEventData) {
		this._eventData = aEventData;
		
		return this;
	}
	
	/**
	 * Sets an input of this function, and skipping null values.
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	BaseCommand	self
	 */
	setInputWithoutNull(aName, aValue) {
		if(aValue !== null && aValue !== undefined) {
			this.setInput(aName, aValue);
		}
		
		return this;
	}
	
	/**
	 * Sets an input of this function
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	BaseCommand	self
	 */
	setInput(aName, aValue) {
		this._inputs[aName] = aValue;
		
		return this;
	}
	
	/**
	 * Gets the input without resolving sources
	 *
	 * @param	aName	String	The name of the input.
	 *
	 * @return	*	The raw value of the input
	 */
	getRawInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		return this._inputs[aName];
	}
	
	/**
	 * Gets an input for this function.
	 *
	 * @param	aName				String			The name of the input.
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The value of the input
	 */
	getInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		
		return this.resolveSource(this._inputs[aName]);
	}
	
	/**
	 * Resolves a source
	 * 
	 * @param	aData				*				The data to resolve
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 */
	resolveSource(aData) {
		//console.log("wprr/commands/BaseCommand::resolveSource");
		
		if(aData instanceof SourceData) {
			
			let props = this._triggerElement ? this._triggerElement.props : {};
			let state = this._triggerElement ? this._triggerElement.state : {};
			
			let changePropsAndStateObject = {"props": props, "state": state, "event": this._eventData};
			
			return aData.getSourceInStateChange(this._triggerElement, changePropsAndStateObject);
		}
		
		return aData;
	}
	
	perform() {
		//METODO: should be overridden
	}
}
