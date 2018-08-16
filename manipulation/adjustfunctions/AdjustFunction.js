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
		this._inputs = new Object();
	}
	
	/**
	 * Sets an input of this function, and skipping null values.
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	AdjustFunction	self
	 */
	setInputWithoutNull(aName, aValue) {
		if(aValue !== null && aValue !== undefined) {
			this.setInput(aName, aValue);
		}
		
		return this;
	}
	
	/**
	 * Sets an input of this function
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	AdjustFunction	self
	 */
	setInput(aName, aValue) {
		this._inputs[aName] = aValue;
		
		return this;
	}
	
	getRawInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		return this._inputs[aName];
	}
	
	/**
	 * Gets an input for this function.
	 *
	 * @param	aName				String			The name of the input.
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	Thne value of the input
	 */
	getInput(aName, aProps, aManipulationObject) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		
		return this.resolveSource(this._inputs[aName], aProps, aManipulationObject);
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//MENOTE: should be overridden
		//METODO: source cleanup of inputs
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
