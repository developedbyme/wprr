import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import WpTermFunctions from "wprr/wp/WpTermFunctions";

//import CreateHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/CreateHierarchyTerms";
/**
 * Adjust function that creates hierarchy terms
 */
export default class CreateHierarchyTerms extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("terms", SourceData.create("prop", "input"));
		this.setInput("outputName", "options");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["terms"];
		delete aProps["outputName"];
	}
	
	/**
	 * Creates the hierarchy for the terms
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/CreateHierarchyTerms::adjust");
		
		let terms = this.getInput("terms", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		aData[outputName] = WpTermFunctions.getHierarchTerms(terms);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTerms		Array | SourceData	The terms that are used to get the hierarchy from.
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	CreateHierarchyTerms	The new instance.
	 */
	static create(aTerms = null, aOutputName = null) {
		let newCreateHierarchyTerms = new CreateHierarchyTerms();
		
		newCreateHierarchyTerms.setInputWithoutNull("terms", aTerms);
		newCreateHierarchyTerms.setInputWithoutNull("outputName", aOutputName);
		
		return newCreateHierarchyTerms;
	}
}
