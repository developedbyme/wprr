import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import FilterProps from "wprr/manipulation/adjustfunctions/FilterProps";
/**
 * Adjust function that filters out props
 */
export default class FilterProps extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this._propNames = null;
	}
	
	/**
	 * Sets the names for the prop to copy.
	 *
	 * @param	aNames	Array|String	The name of the props to copy.
	 *
	 * @return	FilterProps	self
	 */
	setNames(aNames) {
		this._propNames = aNames;
		
		return this;
	}
	
	/**
	 * Filters the props.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/FilterProps::adjust");
		
		let returnObject = new Object();
		
		let currentArray;
		if(this._propNames) {
			if(this._propNames instanceof Array) {
				currentArray = this._propNames;
			}
			else {
				currentArray = this._propNames.split(",");
			}
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				if(aData[currentName] !== undefined) {
					returnObject[currentName] = aData[currentName];
				}
			}
		}
		
		return returnObject;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aNames	Array|String	The name of the props to copy.
	 *
	 * @return	FilterProps	The new instance.
	 */
	static create(aNames = null) {
		let newFilterProps = new FilterProps();
		newFilterProps.setNames(aNames);
		
		return newFilterProps;
	}
}
