import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import ResolveSources from "wprr/manipulation/adjustfunctions/ResolveSources";
/**
 * Adjust function that renames a prop.
 */
export default class ResolveSources extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this._propNames = [];
	}
	
	/**
	 * Add names of props to resolve
	 *
	 * @param	aPropNames	Array of String	The name of the props to resolve.
	 *
	 * @return	ResolveSources	self
	 */
	addPropNames(aPropNames) {
		this._propNames = aPropNames;
		
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
		//console.log("wprr/manipulation/adjustfunctions/ResolveSources::adjust");
		
		let currentArray = this._propNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			let currentData = this.resolveSource(aData[currentName], aData, aManipulationObject);
			aData[currentName] = currentData;
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	...aPropNames	Array of String	The name of the prosp to resolve.
	 *
	 * @return	ResolveSources	The new instance.
	 */
	static create(...aPropNames) {
		let newResolveSources = new ResolveSources();
		newResolveSources.addPropNames(aPropNames);
		
		return newResolveSources;
	}
}
