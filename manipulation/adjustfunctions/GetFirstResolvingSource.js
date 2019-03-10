import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import GetFirstResolvingSource from "wprr/manipulation/adjustfunctions/GetFirstResolvingSource";
/**
 * Adjust function that gets the first resolving source
 */
export default class GetFirstResolvingSource extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("sources", new Array());
		this.setInput("element", SourceData.create("commandElement", "raw"));
		this.setInput("outputName", "output");
		
	}
	
	/**
	 * Gets the first resolved source.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/GetFirstResolvingSource::adjust");
		
		let returnObject = aData;
		
		let sources = this.getInput("sources", aData, aManipulationObject);
		let element = this.getInput("element", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		returnObject[outputName] = element.getFirstValidSourceInArray(sources);
		
		return returnObject;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aSources	Array|SourceData			The array of sources to test.
	 * @param	aElement	WprrBaseObject|SourceData	The element to test the sources from.
	 * @param	aOutputName	String|SourceData			The prop name to set the result to.
	 *
	 * @return	GetFirstResolvingSource	The new instance.
	 */
	static create(aSources = null, aElement = null, aOutputName = null) {
		let newGetFirstResolvingSource = new GetFirstResolvingSource();
		newGetFirstResolvingSource.setInputWithoutNull("sources", aSources);
		newGetFirstResolvingSource.setInputWithoutNull("element", aElement);
		newGetFirstResolvingSource.setInputWithoutNull("outputName", aOutputName);
		
		return newGetFirstResolvingSource;
	}
}
