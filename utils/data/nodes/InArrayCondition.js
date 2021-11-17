import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import InArrayCondition from "./InArrayCondition";
export default class InArrayCondition extends BaseObject {
	
	constructor() {
		super();
		
		this._arrayUpdatedCommand = Wprr.commands.callFunction(this, this._arrayUpdated);
		this._inArrayChangedCommand = Wprr.commands.callFunction(this, this._inArrayChanged);
		
		this.createSource("array", []).addChangeCommand(this._arrayUpdatedCommand);
		this.createSource("value", null).addChangeCommand(this._arrayUpdatedCommand);
		
		this.createSource("isInArray", false).addChangeCommand(this._inArrayChangedCommand);
	}
	
	_arrayUpdated() {
		//console.log("_arrayUpdated");
		
		let index = this.array.indexOf(this.value);
		this.isInArray = (index !== -1);
	}
	
	_inArrayChanged() {
		//console.log("_inArrayChanged");
		
		let index = this.array.indexOf(this.value);
		
		if(this.isInArray) {
			let array = [].concat(this.array);
			if(index === -1) {
				array.push(this.value);
				this.array = array;
			}
		}
		else {
			let array = [].concat(this.array);
			if(index !== -1) {
				array.splice(index, 1);
				this.array = array;
			}
		}
	}
	
	static connect(aArraySource, aInArraySource, aValue) {
		//console.log("InArrayCondition::connect");
		
		let newInArrayCondition = new InArrayCondition();
		
		newInArrayCondition.value = aValue;
		aArraySource.connectSource(newInArrayCondition.sources.get("array"));
		newInArrayCondition.sources.get("isInArray").connectSource(aInArraySource);
		
		//console.log(aValue, newInArrayCondition);
		
		return newInArrayCondition;
	}
	
	static connectInvert(aArraySource, aNotInArraySource, aValue) {
		let newInArrayCondition = new InArrayCondition();
		
		newInArrayCondition.value = aValue;
		aArraySource.connectSource(newInArrayCondition.sources.get("array"));
		
		let inArraySource = Wprr.sourceValue(false);
		
		newInArrayCondition.sources.get("isInArray").connectSource(inArraySource);
		let invertNode = Wprr.utils.data.nodes.Invert.connect(inArraySource, aNotInArraySource);
		
		newInArrayCondition.createSource("invertNode", invertNode);
		
		return newInArrayCondition;
	}
}