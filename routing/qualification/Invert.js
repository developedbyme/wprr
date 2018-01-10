import Qualification from "wprr/routing/qualification/Qualification";

//import Invert from "wprr/routing/qualification/Invert";
/**
 * Qualification that inverts the results of an added qualifier.
 */
export default class Invert extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._qualifier = null;
	}
	
	/**
	 * Sets the qualifier to invert.
	 * 
	 * @param	aQualifier	Qualification	The qualifier to invert.
	 *
	 * @return	Invert	self
	 */
	setQualifier(aQualifier) {
		this._qualifier = aQualifier;
		
		return this;
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if the added qualifier does not.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation.
	 */
	qualify(aData) {
		
		if(!this._qualifier) {
			console.error("No qualifier added.", this);
			return false;
		}
		
		return !this._qualifier.qualify(aData);
	}
	
	/**
	 * Creates a new instance of this class.
	 * 
	 * @param	aQualifier	Qualification	The qualifier to invert.
	 *
	 * @return	Invert	The new instance
	 */
	static create(aQualifier) {
		var newInvert = new Invert();
		newInvert.setQualifier(aQualifier);
		
		return newInvert;
	}
}