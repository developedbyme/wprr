import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import DbmContentFunctions from "wprr/wp/dbmcontent/DbmContentFunctions";

//import RelationTerms from "wprr/manipulation/adjustfunctions/wp/dbmcontent/RelationTerms";
/**
 * Adjust function that gets relation terms
 */
export default class RelationTerms extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("postData", SourceData.create("reference", "wprr/postData"));
		this.setInput("relation", "not-set");
		this.setInput("outputName", "options");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["postData"];
		delete aProps["relation"];
		delete aProps["outputName"];
	}
	
	/**
	 * Gets the terms for the relation
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/dbmcontent/RelationTerms::adjust");
		
		let postData = this.getInput("postData", aData, aManipulationObject);
		let relation = this.getInput("relation", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		aData[outputName] = DbmContentFunctions.getRelations(postData, relation);
		
		console.log(outputName, aData[outputName]);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPostData	PostData | SourceData	The post data to get ther terms from.
	 * @param	aRelation	String | SourceData		The name of the relation to get.
	 * @param	aOutputName	String					The name of the prop to set the data to.
	 *
	 * @return	RelationTerms	The new instance.
	 */
	static create(aPostData = null, aRelation = null, aOutputName = null) {
		let newRelationTerms = new RelationTerms();
		
		newRelationTerms.setInputWithoutNull("postData", aPostData);
		newRelationTerms.setInputWithoutNull("relation", aRelation);
		newRelationTerms.setInputWithoutNull("outputName", aOutputName);
		
		return newRelationTerms;
	}
}
