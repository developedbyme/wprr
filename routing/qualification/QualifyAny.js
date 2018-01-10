import Qualification from "wprr/routing/qualification/Qualification";

//import QualifyAny from "wprr/routing/qualification/QualifyAny";
/**
 * Qualification that qualifies if any of the added qualifiers qualify.
 */
export default class QualifyAny extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._qualifiers = new Array();
	}
	
	/**
	 * Sets the qualifiers that is going to be uesd for the qualification.
	 * 
	 * @param	aQualifiers	Array of Qualification	The qualifiers to use.
	 *
	 * @return	QualifyAny	self
	 */
	setQualifiers(aQualifiers) {
		this._qualifiers = aQualifiers;
		
		return this;
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if any of the added qualifiers qualify.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation.
	 */
	qualify(aData) {
		let currentArray = this._qualifiers;
		let currentArrayLength = currentArray.length;
		
		if(currentArrayLength.length) {
			console.warn("No qualifiers added.", this);
			return true;
		}
		
		for(let i = 0; i < currentArrayLength; i++) {
			let currentQualifier = currentArray[i];
			
			if(currentQualifier.qualify(aData)) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Creates a new instance of this class.
	 * 
	 * @param	...aQualifiers	Array of Qualification	The qualifiers to use.
	 *
	 * @return	QualifyAny	The new instance
	 */
	static create(...aQualifiers) {
		var newQualifyAny = new QualifyAny();
		newQualifyAny.setQualifiers(aQualifiers);
		
		return newQualifyAny;
	}
}