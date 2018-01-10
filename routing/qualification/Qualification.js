//import Qualification from "wprr/routing/qualification/Qualification";
/**
 * Base object for all object that needs to implement the qualify interface.
 */
export default class Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		
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