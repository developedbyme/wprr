//import Qualification from "wprr/routing/qualification/Qualification";
/**
 * Base object for all object that needs to implement the qualify interface.
 */
export default class Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		this._inputs = new Object();
	}
	
	/**
	 * Sets an input of this qualification, and skipping null values.
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	AdjustFunction	self
	 */
	setInputWithoutNull(aName, aValue) {
		if(aValue !== null && aValue !== undefined) {
			this.setInput(aName, aValue);
		}
		
		return this;
	}
	
	/**
	 * Sets an input of this qualification
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	AdjustFunction	self
	 */
	setInput(aName, aValue) {
		this._inputs[aName] = aValue;
		
		return this;
	}
	
	/**
	 * Gets an input
	 *
	 * @param	aName	String	The name of the input.
	 *
	 * @return	*	The raw value of the input
	 */
	getInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		return this._inputs[aName];
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it never does. This function should always be overridden.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation. Always false.
	 */
	qualify(aData) {
		console.error("Qualify function should be overridden from base object.", this);
		
		return false;
	}
	
}