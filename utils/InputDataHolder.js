import SourceData from "wprr/reference/SourceData";

// import InputDataHolder from "wprr/utils/InputDataHolder";
/**
 * Holder for input data.
 */
export default class InputDataHolder  {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		this._values = new Object();
		
	};
	
	
	/**
	 * Sets an input of this function, and skipping null values.
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	InputDataHolder	self
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
	 * @return	InputDataHolder	self
	 */
	setInput(aName, aValue) {
		this._values[aName] = aValue;
		
		return this;
	}
	
	/**
	 * Gets the input without resolving sources
	 *
	 * @param	aName	String	The name of the input.
	 *
	 * @return	*	The raw value of the input
	 */
	getRawInput(aName) {
		if(this._values[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		return this._values[aName];
	}
	
	/**
	 * Checks if an input exists. The source can still resolve to nothing.
	 *
	 * @param	aName	String	The name of the input.
	 *
	 * @return	Boolean	True if there is an input
	 */
	hasInput(aName) {
		return (this._values[aName] !== undefined);
	}
	
	/**
	 * Gets an input for this function.
	 *
	 * @param	aName				String			The name of the input.
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The value of the input
	 */
	getInput(aName, aProps, aManipulationObject) {
		if(this._values[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		
		return this.resolveSource(this._values[aName], aProps, aManipulationObject);
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		for(let objectName in this._values) {
			let currentValue = this._values[objectName];
			if(currentValue instanceof SourceData) {
				currentValue.removeUsedProps(aProps);
			}
		}
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
		//console.log(aData, aProps, aManipulationObject);
		
		if(aData instanceof SourceData) {
			
			if(aManipulationObject) {
				let changePropsAndStateObject = {"props": aProps, "state": aManipulationObject.state};
			
				return aManipulationObject.resolveSourcedDataInStateChange(aData, changePropsAndStateObject);
			}
			else {
				return aData.getSource(null);
			}
		}
		
		return aData;
	}
	
	static create() {
		let newInputDataHolder = new InputDataHolder();
		
		return newInputDataHolder;
	}
}