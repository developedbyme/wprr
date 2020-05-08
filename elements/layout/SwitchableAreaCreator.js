import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import SwitchableAreaCreator from "wprr/elements/layout/SwitchableAreaCreator";
export default class SwitchableAreaCreator  {

	constructor() {
		
		this._input = null;
		this._defaultTemplate = React.createElement("div");
		this._templates = new Array();
		
	}
	
	setInput(aInput) {
		this._input = aInput;
		
		return this;
	}
	
	setDefaultTemplate(aTemplate) {
		this._defaultTemplate = aTemplate;
		
		return this;
	}
	
	addTemplate(aNames, aTemplate) {
		
		let currentArray = Wprr.utils.array.arrayOrSeparatedString(aNames);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			this._templates.push({"key": currentName, "value": aTemplate});
		}
		
		return this;
	}
	
	addTemplates(aTemplates) {
		let currentArray = Wprr.utils.keyValueGenerator.normalizeArrayOrObject(aTemplates);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			this.addTemplate(currentItem["key"], currentItem["value"]);
		}
		
		return this;
	}
	
	getReactElements() {
		return React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.switchValue(this._input, this._templates, "element").setInput("defaultValue", this._defaultTemplate)}, React.createElement(Wprr.InsertElement));
	}
	
	static create(aInput, aDefaultTemplate = null, aTemplates = null) {
		let newSwitchableAreaCreator = new SwitchableAreaCreator();
		newSwitchableAreaCreator.setInput(aInput);
		
		if(aDefaultTemplate) {
			newSwitchableAreaCreator.setDefaultTemplate(aDefaultTemplate);
		}
		
		if(aTemplates) {
			newSwitchableAreaCreator.addTemplates(aTemplates);
		}
		
		return newSwitchableAreaCreator;
	}
}