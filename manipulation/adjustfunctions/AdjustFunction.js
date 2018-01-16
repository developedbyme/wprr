import SourceData from "wprr/reference/SourceData";

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
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//MENOTE: should be overridden
	}
	
	/**
	 * Resolves a source
	 * 
	 * @param	aData				*				The data to resolve
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 */
	resolveSource(aData, aProps, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/AdjustFunction::resolveSource");
		
		if(aData instanceof SourceData) {
			
			let changePropsAndStateObject = {"props": aProps, "state": aManipulationObject.state};
			
			return aManipulationObject.resolveSourcedDataInStateChange(aData, changePropsAndStateObject);
		}
		
		return aData;
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
