import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import GroupArray from "wprr/manipulation/adjustfunctions/logic/GroupArray";
/**
 * Adjust function that combines values
 */
export default class GroupArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("groupBy", SourceData.create("prop", "groupBy"));
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
		delete aProps["groupBy"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/GroupArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let groupBy = this.getInput("groupBy", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let groupNames = new Array();
		let groups = new Object();
		
		{
			let currentArray = input;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				let currentGroup = objectPath.get(currentItem, groupBy);
				if(!groups[currentGroup]) {
					groups[currentGroup] = new Array();
					groupNames.push(currentGroup);
				}
				groups[currentGroup].push(currentItem);
			}
		}
		
		let returnArray = new Array();
		
		{
			let currentArray = groupNames;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let groupName = currentArray[i];
				let returnItem = new Object()
				returnItem["key"] = groupName;
				returnItem["value"] = groups[groupName];
				
				returnArray.push(returnItem);
			}
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput		SourceData|Array	The data to group.
	 * @param	aGroupBy	SourceData|String	The path to the property to group on.
	 * @param	aOutputName	SourceData|String	The output name to stroe the data in
	 *
	 * @return	GroupArray	The new instance.
	 */
	static create(aInput = null, aGroupBy = null, aOutputName = null) {
		let newGroupArray = new GroupArray();
		
		newGroupArray.setInputWithoutNull("input", aInput);
		newGroupArray.setInputWithoutNull("groupBy", aGroupBy);
		newGroupArray.setInputWithoutNull("outputName", aOutputName);
		
		return newGroupArray;
	}
}
