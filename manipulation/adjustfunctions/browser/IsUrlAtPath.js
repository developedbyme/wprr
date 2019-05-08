import Wprr from "wprr/Wprr";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import IsUrlAtPath from "wprr/manipulation/adjustfunctions/browser/IsUrlAtPath";
/**
 * Adjust function that checks if a url is at a path
 */
export default class IsUrlAtPath extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("url", null);
		this.setInput("path", "");
		this.setInput("options", {"not": "not", "at": "at", "in": "in"});
		this.setInput("outputName", "output");
	}
	
	/**
	 * Checks if the url is at path
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/browser/IsUrlAtPath::adjust");
		
		let url = this.getInput("url", aData, aManipulationObject);
		if(!url) {
			url = document.location.href;
		}
		let path = this.getInput("path", aData, aManipulationObject);
		let options = this.getInput("options", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		let result = "not";
		
		url = Wprr.utils.url.getCleanUrl(url);
		path = Wprr.utils.url.getCleanUrl(path);
		
		if(url === path) {
			result = "at";
		}
		else if(url.substring(0, path.length) === path) {
			result = "in";
		}
		
		aData[outputName] = options[result];
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPath				String | SourceData		The path to check if the url matches
	 * @param	aUrl				String | SourceData		The url that we are currently at.
	 * @param	aOptions			Object | SourceData		The values to set set the output to.
	 * @param	aOutputName			String					The name of the prop to set the data to.
	 *
	 * @return	IsUrlAtPath	The new instance.
	 */
	static create(aPath = null, aUrl = null, aOptions = null, aOutputName = null) {
		let newIsUrlAtPath = new IsUrlAtPath();
		
		newIsUrlAtPath.setInputWithoutNull("url", aUrl);
		newIsUrlAtPath.setInputWithoutNull("path", aPath);
		newIsUrlAtPath.setInputWithoutNull("options", aOptions);
		newIsUrlAtPath.setInputWithoutNull("outputName", aOutputName);
		
		return newIsUrlAtPath;
	}
}
