import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";
import SourceData from "wprr/reference/SourceData";

//import DynamicKey from "wprr/manipulation/adjustfunctions/DynamicKey";
/**
 * Adjust function that sets a key to a resolved source
 */
export default class DynamicKey extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this._dynamicKeyName = "dynamicKey";
	}
	
	/**
	 * Sets the names for the prop to use as key.
	 *
	 * @param	aDynamicKeyName	String	The name of the original prop.
	 *
	 * @return	DynamicKey	self
	 */
	setNames(aDynamicKeyName) {
		this._dynamicKeyName = aDynamicKeyName;
		
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
		//console.log("wprr/manipulation/adjustfunctions/DynamicKey::adjust");
		
		if(this._dynamicKeyName instanceof SourceData) {
			aData["key"] = this.resolveSource(this._dynamicKeyName, aData, aManipulationObject);
			
			return aData;
		}
		
		let key = this.resolveSource(aData[this._dynamicKeyName], aData, aManipulationObject);
		delete aData[this._dynamicKeyName];
		aData["key"] = key;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aDynamicKeyName	String	The name of the original prop.
	 *
	 * @return	DynamicKey	The new instance.
	 */
	static create(aDynamicKeyName) {
		let newDynamicKey = new DynamicKey();
		if(aDynamicKeyName) {
			newDynamicKey.setNames(aDynamicKeyName);
		}
		
		return newDynamicKey;
	}
}
