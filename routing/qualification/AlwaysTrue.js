import Qualification from "wprr/routing/qualification/Qualification";

//import AlwaysTrue from "wprr/routing/qualification/AlwaysTrue";
/**
 * Qualification that always returns true.
 */
export default class AlwaysTrue extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it alwyas does.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation. Always true.
	 */
	qualify(aData) {
		return true;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @return	AlwaysTrue	The new instance
	 */
	static create() {
		var newAlwaysTrue = new AlwaysTrue();
		
		return newAlwaysTrue;
	}
}