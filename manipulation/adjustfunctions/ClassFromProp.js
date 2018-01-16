import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

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
		
		this._propName = "notSet";
		this._options = new Array();
	}
	
	/**
	 * Sets the names for the prop to rename.
	 *
	 * @param	aPropName	String	The name of the prop to get values from.
	 *
	 * @return	ClassFromProp	self
	 */
	setProp(aPropName) {
		this._propName = aPropName;
		
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
		
		let currentProp = aData[this._propName];
		let currentData = aManipulationObject.resolveSourcedData(currentProp);
		
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
}
