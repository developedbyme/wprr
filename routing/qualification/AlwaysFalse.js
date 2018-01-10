import Qualification from "wprr/routing/qualification/Qualification";

//import AlwaysFalse from "wprr/routing/qualification/AlwaysFalse";
/**
 * Qualification that always returns false.
 */
export default class AlwaysFalse extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it never does.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation. Always false.
	 */
	qualify(aData) {
		return false;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @return	AlwaysFalse	The new instance
	 */
	static create() {
		var newAlwaysFalse = new AlwaysFalse();
		
		return newAlwaysFalse;
	}
}