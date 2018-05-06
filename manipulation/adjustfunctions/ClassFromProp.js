import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import ClassFromProp from "wprr/manipulation/adjustfunctions/ClassFromProp";
/**
 * Adjust function that sets a class based on a prop
 */
export default class ClassFromProp extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this._propName = SourceData.create("prop", "notSet");
		this._options = new Array();
	}
	
	/**
	 * Sets the name for the prop to get values from.
	 *
	 * @param	aPropName	String	The name of the prop to get values from.
	 *
	 * @return	ClassFromProp	self
	 */
	setProp(aPropName) {
		this._propName = SourceData.create("prop", aPropName);
		
		return this;
	}
	
	/**
	 * Sets the the source to get values from.
	 *
	 * @param	aSource	SourceData	The source to get the value from.
	 *
	 * @return	ClassFromProp	self
	 */
	setPropSource(aSource) {
		this._propName = aSource;
		
		return this;
	}
	
	/**
	 * Sets the options for this switch
	 *
	 * @param	aOptions	Array	The array of options
	 *
	 * @return	ClassFromProp	self
	 */
	setOptions(aOptions) {
		this._options = aOptions;
	}
	
	/**
	 * Sets the class based on the prop.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/ClassFromProp::adjust");
		
		let currentData = aManipulationObject.resolveSourcedData(this._propName);
		
		delete aData[this._propName];
		
		let isFound = false;
		
		let currentArray = this._options;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i];
			if(currentOption.key === currentData) {
				if(aData["className"]) {
					aData["className"] += " " + aManipulationObject.resolveSourcedData(currentOption.value);
				}
				else {
					aData["className"] = aManipulationObject.resolveSourcedData(currentOption.value);
				}
				isFound = true;
				break;
			}
		}
		
		if(!isFound) {
			console.warn("No option for value " + currentData + ". No classes added.", this);
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPropName	String	The name of the prop to get values from.
	 * @param	aOptions	Array	The array of options
	 *
	 * @return	ClassFromProp	The new instance.
	 */
	static create(aPropName, aOptions) {
		let newClassFromProp = new ClassFromProp();
		newClassFromProp.setProp(aPropName);
		newClassFromProp.setOptions(aOptions);
		
		return newClassFromProp;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aSource		SourceDAta	The source to the get the values from
	 * @param	aOptions	Array	The array of options
	 *
	 * @return	ClassFromProp	The new instance.
	 */
	static createWithSource(aSource, aOptions) {
		let newClassFromProp = new ClassFromProp();
		newClassFromProp.setPropSource(aSource);
		newClassFromProp.setOptions(aOptions);
		
		return newClassFromProp;
	}
}
