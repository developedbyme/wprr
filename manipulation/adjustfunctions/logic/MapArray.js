import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import MapArray from "wprr/manipulation/adjustfunctions/logic/MapArray";
/**
 * Adjust function that runs a map on an array
 */
export default class MapArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("mapFunction", null);
		this.setInput("outputName", "output");
		
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
	 * Sets the class based on the prop.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/MapArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let mapFunction = this.getInput("mapFunction", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		if(mapFunction) {
			aData[outputName] = input.map(mapFunction);
		}
		else {
			console.error("No mapFucntion set.", this);
			aData[outputName] = new Array();
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aMapFunction	SourceData|Function	The function that maps the data.
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	MapArray	The new instance.
	 */
	static create(aInput = null, aMapFunction = null, aOutputName = null) {
		let newMapArray = new MapArray();
		
		newMapArray.setInputWithoutNull("input", aInput);
		newMapArray.setInputWithoutNull("mapFunction", aMapFunction);
		newMapArray.setInputWithoutNull("outputName", aOutputName);
		
		return newMapArray;
	}
}
