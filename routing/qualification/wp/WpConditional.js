import objectPath from "object-path";

import Qualification from "wprr/routing/qualification/Qualification";

//import WpConditional from "wprr/routing/qualification/wp/WpConditional";
/**
 * Qualification that checks a WP conditional.
 */
export default class WpConditional extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._conditional = null;
		this._matchValue = true;
	}
	
	/**
	 * Sets the name of the conditional to check.
	 * 
	 * @param	aConditional	String	The conditional to check.
	 *
	 * @return	WpConditional	self
	 */
	setConditional(aConditional) {
		this._conditional = aConditional;
		
		return this;
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if the conditional tag is set to true.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation. Always true.
	 */
	qualify(aData) {
		//console.log("wprr/routing/qualification/wp/WpConditional::qualify");
		//console.log(aData);
		
		let path = "templateSelection." + this._conditional;
		
		let checkValue = objectPath.get(aData, path);
		
		if(checkValue === undefined) {
			console.warn("Conditional " + this._conditional + " doesn't exist on path " + path + " from object ", aData);
		}
		
		return (checkValue === this._matchValue); 
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aConditional	String	The conditional to check.
	 *
	 * @return	WpConditional	The new instance
	 */
	static create(aConditional) {
		var newWpConditional = new WpConditional();
		newWpConditional.setConditional(aConditional);
		
		return newWpConditional;
	}
}