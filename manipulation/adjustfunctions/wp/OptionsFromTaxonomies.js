import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import OptionsFromTaxonomies from "wprr/manipulation/adjustfunctions/wp/OptionsFromTaxonomies";
/**
 * Adjust function that creates options from terms
 */
export default class OptionsFromTaxonomies extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("taxonomies", SourceData.create("prop", "input"));
		this.setInput("outputName", "options");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input"];
	}
	
	/**
	 * Creates the options from the terms.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/OptionsFromTaxonomies::adjust");
		
		let taxonomies = this.getInput("taxonomies", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		if(taxonomies) {
			let currentArray = taxonomies;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				returnArray.push({"value": objectPath.get(currentItem, "name"), "label": objectPath.get(currentItem, "label"), "additionalData": currentItem});
			}
		}
		else {
			console.error("Taxonomies are not set.", taxonomies, this);
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTaxonomies		Array | SourceData	The taxonomies that are used to get the options for.
	 * @param	aOutputName	String					The name of the prop to set the data to.
	 *
	 * @return	OptionsFromTaxonomies	The new instance.
	 */
	static create(aTaxonomies = null, aOutputName = null) {
		let newOptionsFromTaxonomies = new OptionsFromTaxonomies();
		
		newOptionsFromTaxonomies.setInputWithoutNull("taxonomies", aTaxonomies);
		newOptionsFromTaxonomies.setInputWithoutNull("outputName", aOutputName);
		
		return newOptionsFromTaxonomies;
	}
}
