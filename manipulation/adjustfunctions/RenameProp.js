//import RenameProp from "wprr/manipulation/adjustfunctions/RenameProp";
/**
 * Adjust function that renames a prop.
 */
export default class RenameProp {
	
	/**
	 * Constructor
	 */
	constructor() {
		this._fromName = "notSet";
		this._toName = "notSet";
	}
	
	/**
	 * Sets the names for the prop to rename.
	 *
	 * @param	aFromName	String	The name of the original prop.
	 * @param	aToName		String	The name that the prop should get.
	 *
	 * @return	RenameProp	self
	 */
	setNames(aFromName, aToName) {
		this._fromName = aFromName;
		this._toName = aToName;
		
		return this;
	}
	
	/**
	 * Renames the prop.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/RenameProp::adjust");
		
		let currentData = aData[this._fromName];
		delete aData[this._fromName];
		aData[this._toName] = currentData
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aFromName	String	The name of the original prop.
	 * @param	aToName		String	The name that the prop should get.
	 *
	 * @return	RenameProp	The new instance.
	 */
	static create(FromName, aToName) {
		let newRenameProp = new RenameProp();
		newRenameProp.setNames(FromName, aToName);
		
		return newRenameProp;
	}
}
