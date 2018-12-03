import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import RenameProp from "wprr/manipulation/adjustfunctions/RenameProp";
/**
 * Adjust function that renames a prop.
 */
export default class RenameProp extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("fromName", "output");
		this.setInput("toName", "input");
	}
	
	/**
	 * Sets the names for the prop to rename.
	 *
	 * @param	aFromName	String	The name of the original prop.
	 * @param	aToName		String	The name that the prop should get.
	 *
	 * @return	RenameProp	self
	 */
	setNames(aFromName, aToName) {
		
		this.setInputWithoutNull("fromName", aFromName);
		this.setInputWithoutNull("toName", aToName);
		
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
		//console.log("wprr/manipulation/adjustfunctions/RenameProp::adjust");
		
		let fromName = this.getInput("fromName", aData, aManipulationObject);
		let toName = this.getInput("toName", aData, aManipulationObject);
		
		let currentData = aData[fromName];
		delete aData[fromName];
		aData[toName] = currentData;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aFromName	String	The name of the original prop.
	 * @param	aToName		String	The name that the prop should get.
	 *
	 * @return	RenameProp	The new instance.
	 */
	static create(aFromName, aToName) {
		let newRenameProp = new RenameProp();
		newRenameProp.setNames(aFromName, aToName);
		
		return newRenameProp;
	}
}
