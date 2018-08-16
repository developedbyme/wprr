import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import WpTermFunctions from "wprr/wp/WpTermFunctions";

//import SelectTermsSubtree from "wprr/manipulation/adjustfunctions/wp/SelectTermsSubtree";
/**
 * Adjust function that selects a subtree of hierarchy terms
 */
export default class SelectTermsSubtree extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("terms", SourceData.create("prop", "input"));
		this.setInput("slugPath", SourceData.create("prop", "path"));
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
		delete aProps["slugPath"];
		delete aProps["outputName"];
	}
	
	/**
	 * Selects the subtree
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/SelectTermsSubtree::adjust");
		
		let terms = this.getInput("terms", aData, aManipulationObject);
		let slugPath = this.getInput("slugPath", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		aData[outputName] = WpTermFunctions.getSubtreeFromHierarchTerms(slugPath, terms);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTerms		Array | SourceData	The terms that are used to get the subtree from
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	SelectTermsSubtree	The new instance.
	 */
	static create(aTerms = null, aSlugPath = null, aOutputName = null) {
		let newSelectTermsSubtree = new SelectTermsSubtree();
		
		newSelectTermsSubtree.setInputWithoutNull("terms", aTerms);
		newSelectTermsSubtree.setInputWithoutNull("slugPath", aSlugPath);
		newSelectTermsSubtree.setInputWithoutNull("outputName", aOutputName);
		
		return newSelectTermsSubtree;
	}
}
