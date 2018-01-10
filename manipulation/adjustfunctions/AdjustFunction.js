//import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";
/**
 * Base object for adjust functions.
 */
export default class AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
	}
	
	/**
	 * Adjusts data. This function should be overridden by classes extending from this base object.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/AdjustFunction::adjust");
		
		console.warn("Adjust function should be overridden.", this);
		
		return aData;
	}
}
