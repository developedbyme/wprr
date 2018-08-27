import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import SetDefaultProps from "wprr/manipulation/adjustfunctions/SetDefaultProps";
/**
 * Adjust function that adds props if they are not set.
 */
export default class SetDefaultProps extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this._props = new Object();
	}
	
	/**
	 * Add props that will be added
	 *
	 * @param	aPropNames	Object	The props to add.
	 *
	 * @return	SetDefaultProps	self
	 */
	addProps(aProps) {
		this._props = aProps;
		
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
		//console.log("wprr/manipulation/adjustfunctions/SetDefaultProps::adjust");
		
		for(let objectName in this._props) {
			if(!aData[objectName]) {
				aData[objectName] = this._props[objectName];
			}
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aProps	Object	The props to add.
	 *
	 * @return	SetDefaultProps	The new instance.
	 */
	static create(aProps) {
		let newSetDefaultProps = new SetDefaultProps();
		newSetDefaultProps.addProps(aProps);
		
		return newSetDefaultProps;
	}
}
