import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import RemoveProps from "wprr/manipulation/adjustfunctions/RemoveProps";
/**
 * Adjust function that removes props.
 */
export default class RemoveProps extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("propNames", new Array());
	}
	
	/**
	 * Sets the names for the prop to copy.
	 *
	 * @param	aNames	Array|String	The name of the props to copy.
	 *
	 * @return	RemoveProps	self
	 */
	setNames(aNames) {
		this.setInput("propNames", aNames);
		
		return this;
	}
	
	/**
	 * Removes the props.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/RemoveProps::adjust");
		
		let returnObject = aData;
		
		let currentArray;
		let propNames = this.getInput("propNames", aData, aManipulationObject);
		if(propNames) {
			if(propNames instanceof Array) {
				currentArray = propNames;
			}
			else {
				currentArray = propNames.split(",");
			}
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				delete returnObject[currentName];
			}
		}
		
		return returnObject;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aNames	Array|String	The name of the props to copy.
	 *
	 * @return	RemoveProps	The new instance.
	 */
	static create(aNames = null) {
		let newRemoveProps = new RemoveProps();
		newRemoveProps.setNames(aNames);
		
		return newRemoveProps;
	}
}
