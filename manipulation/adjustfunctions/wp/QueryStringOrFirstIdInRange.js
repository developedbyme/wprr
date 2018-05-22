import objectPath from "object-path";
import queryString from "query-string";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import QueryStringOrFirstIdInRange from "wprr/manipulation/adjustfunctions/wp/QueryStringOrFirstIdInRange";
/**
 * Adjust function that selects a value from a query string or the first id in a range
 */
export default class QueryStringOrFirstIdInRange extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("parameter", SourceData.create("prop", "parameter"));
		this.setInput("range", SourceData.create("prop", "range"));
		this.setInput("outputName", "output");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["parameter"];
		delete aProps["range"];
	}
	
	/**
	 * Selects the value from querystring or the first in range
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/QueryStringOrFirstIdInRange::adjust");
		
		let parameter = this.getInput("parameter", aData, aManipulationObject);
		let range = this.getInput("range", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let parsedQueryString = queryString.parse(location.search);
		let returnValue = parsedQueryString[parameter];
		
		if(!returnValue) {
			if(range && range.length > 0) {
				returnValue = range[0]["id"];
			}
		}
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aParameter		SourceData|String	The name of the query string parameter
	 * @param	aSortFunction	SourceData|Array	The range to pick the first id fro if not set in query string
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	QueryStringOrFirstIdInRange	The new instance.
	 */
	static create(aParameter = null, aRange = null, aOutputName = null) {
		let newQueryStringOrFirstIdInRange = new QueryStringOrFirstIdInRange();
		
		newQueryStringOrFirstIdInRange.setInputWithoutNull("parameter", aParameter);
		newQueryStringOrFirstIdInRange.setInputWithoutNull("range", aRange);
		newQueryStringOrFirstIdInRange.setInputWithoutNull("outputName", aOutputName);
		
		return newQueryStringOrFirstIdInRange;
	}
}
