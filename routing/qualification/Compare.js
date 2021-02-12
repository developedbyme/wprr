import Wprr from "wprr/Wprr";

import Qualification from "wprr/routing/qualification/Qualification";

//import Compare from "wprr/routing/qualification/Compare";
/**
 * Qualification that checks a WP conditional.
 */
export default class Compare extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._path = null;
		this._matchValue = true;
		this._compareType = "==";
	}
	
	/**
	 * Sets the path of the data to check.
	 * 
	 * @param	aPath	String	The path to check.
	 *
	 * @return	Compare	self
	 */
	setDataPath(aPath) {
		this._path = aPath;
		
		return this;
	}
	
	/**
	 * Sets the matching value for the data
	 *
	 * @param	aValue	*	The value that the data should match
	 *
	 * @return	Compare	self
	 */
	setMatchValue(aValue) {
		this._matchValue = aValue;
		
		return this;
	}
	
	/**
	 * Sets the compare type for the compare
	 *
	 * @param	aValue	*	The type of comparison
	 *
	 * @return	Compare	self
	 */
	setCompareValue(aValue) {
		this._compareValue = aValue;
		
		return this;
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if the conditional tag is set to true.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation.
	 */
	qualify(aData) {
		//console.log("wprr/routing/qualification/wp/Compare::qualify");
		//console.log(aData);
		
		let path = this._path;
		
		let checkValue = Wprr.objectPath(aData, path);
		
		if(Wprr.utils.filterPartFunctions._compare(checkValue, this._matchValue, this._compareValue)) {
			return true;
		}
		
		return false; 
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPath		String	The path to the data to check.
	 * @param	aMatchValue	*		The value that the data should match.
	 *
	 * @return	Compare	The new instance
	 */
	static create(aPath, aMatchValue = true, aCompareType = "==") {
		let newCompare = new Compare();
		newCompare.setDataPath(aPath);
		newCompare.setMatchValue(aMatchValue);
		newCompare.setCompareValue(aCompareType);
		
		return newCompare;
	}
}