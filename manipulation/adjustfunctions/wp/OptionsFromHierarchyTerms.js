import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import OptionsFromHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/OptionsFromHierarchyTerms";
/**
 * Adjust function that creates options from hierarcy terms
 */
export default class OptionsFromHierarchyTerms extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("terms", SourceData.create("prop", "input"));
		this.setInput("prefix", "- ");
		this.setInput("outputName", "options");
		this.setInput("translationPath", null);
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["terms"];
		delete aProps["prefix"];
		delete aProps["outputName"];
	}
	
	_getOptionsForTerms(aTerms, aCurrentPrefix, aRecursivePrefix, aParentSlugPath, aTranslationPath, aTextManager, aReturnArray) {
		let currentArray = aTerms;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentHierarchTerm = currentArray[i];
			
			let currentName = currentHierarchTerm.term["name"];
			if(aTranslationPath) {
				let translatedName = aTextManager.getText(aTranslationPath + "." + currentHierarchTerm.term["slug"]);
				if(translatedName) {
					currentName = translatedName;
				}
			}
			
			aReturnArray.push({"value": currentHierarchTerm.term["id"], "label": aCurrentPrefix + currentName, "slugPath": aParentSlugPath + currentHierarchTerm.term["slug"]});
			this._getOptionsForTerms(currentHierarchTerm.children, aCurrentPrefix+aRecursivePrefix, aRecursivePrefix, aParentSlugPath + currentHierarchTerm.term["slug"] + "/", aTranslationPath, aTextManager, aReturnArray)
		}
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
		//console.log("wprr/manipulation/adjustfunctions/wp/OptionsFromHierarchyTerms::adjust");
		
		let terms = this.getInput("terms", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		let prefix = this.getInput("prefix", aData, aManipulationObject);
		let translationPath = this.getInput("translationPath", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let textManager = null;
		if(translationPath) {
			textManager = aManipulationObject.getReferenceIfExists("wprr/textManager")
		}
		
		this._getOptionsForTerms(terms, "", prefix, "", translationPath, textManager, returnArray);
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTerms		Array | SourceData	The hierarchy terms that are used to get the options for.
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	OptionsFromHierarchyTerms	The new instance.
	 */
	static create(aTerms = null, aOutputName = null, aTranslationPath = null) {
		let newOptionsFromHierarchyTerms = new OptionsFromHierarchyTerms();
		
		newOptionsFromHierarchyTerms.setInputWithoutNull("terms", aTerms);
		newOptionsFromHierarchyTerms.setInputWithoutNull("outputName", aOutputName);
		newOptionsFromHierarchyTerms.setInputWithoutNull("translationPath", aTranslationPath);
		
		return newOptionsFromHierarchyTerms;
	}
}
