import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Switch from "./Switch";
export default class Switch extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.cases = new Wprr.utils.KeyValueGenerator();
		
		this.createSource("input", null).addChangeCommand(this._updateCommand);
		
		//MENOTE: it would be better to have cases as links on an item instead
		this.createSource("defaultValue", null).addChangeCommand(this._updateCommand);
		
		this.createSource("output", null);
	}
	
	_addCase(aInput, aOutput) {
		this.cases.addKeyValue(aInput, aOutput);
	}
	
	addCase(aInput, aOutput) {
		
		this._addCase(aInput, aOutput);
		this._update();
		
		return this;
	}
	
	_update() {
		
		let returnArray = new Array();
		
		let input = this.input;
		let isFound = false;
		
		let currentArray = this.cases.getKeys();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			if(currentName === input) {
				isFound = true;
				
				this.output = this.cases.getValueForKeyIfExists(currentName);
				
				break;
			}
		}
		
		if(!isFound) {
			this.output = this.defaultValue;
		}
		
		return this;
	}
	
	static create() {
		let newSwitch = new Switch();
		
		return newSwitch;
	}
}