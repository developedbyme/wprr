import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import GetPostTerms from "wprr/manipulation/adjustfunctions/wp/GetPostTerms";
/**
 * Adjust function that gets terms from a post
 */
export default class GetPostTerms extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.postData = SourceData.create("reference", "wprr/postData");
		this.taxonomy = SourceData.create("prop", "taxonomy");
		this.outputName = "terms";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aPostData	PostData | SourceData	The post data to get the terms from.
	 * @param	aTaxonomy	String | SourceData		The content creator that will create the elements.
	 * @param	aOutputName	String					The name of the prop to set the data to.
	 *
	 * @return	GetPostTerms	self
	 */
	setup(aPostData = null, aTaxonomy = null, aOutputName = null) {
		
		if(aPostData !== null) {
			this.postData = aPostData;
		}
		if(aTaxonomy !== null) {
			this.taxonomy = aTaxonomy;
		}
		if(aOutputName !== null) {
			this.outputName = aOutputName;
		}
		
		return  this;
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["taxonomy"];
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
		//console.log("wprr/manipulation/adjustfunctions/wp/GetPostTerms::adjust");
		
		let postData = this.resolveSource(this.postData, aData, aManipulationObject);
		let taxonomy = this.resolveSource(this.taxonomy, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		if(!postData) {
			console.error("Post is not set.", this);
			
			aData[outputName] = null;
			return aData;
		}
		
		aData[outputName] = postData.getTerms(taxonomy);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPostData	PostData | SourceData	The post data to get the terms from.
	 * @param	aTaxonomy	String | SourceData		The content creator that will create the elements.
	 * @param	aOutputName	String					The name of the prop to set the data to.
	 *
	 * @return	GetPostTerms	The new instance.
	 */
	static create(aPostData = null, aTaxonomy = null, aOutputName = null) {
		let newGetPostTerms = new GetPostTerms();
		
		newGetPostTerms.setup(aPostData, aTaxonomy, aOutputName);
		
		return newGetPostTerms;
	}
}
