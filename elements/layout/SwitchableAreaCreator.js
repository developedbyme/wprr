import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import objectPath from "object-path";

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
	
	createDefaultTemplateFromClass(aClass, aProps = {}) {
		this._defaultTemplate = React.createElement(aClass, aProps);
		
		return this;
	}
	
	getTemplate(aName) {
		let templateKey = Wprr.utils.array.getItemBy("key", aName, this._templates);
		
		return objectPath.get(templateKey, "value");
	}
	
	setDefaultTemplateByName(aName) {
		let template = this.getTemplate(aName);
		this.setDefaultTemplate(template);
		
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
		let currentArray = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(aTemplates);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			this.addTemplate(currentItem["key"], currentItem["value"]);
		}
		
		return this;
	}
	
	addTemplateFromClass(aNames, aClass, aProps = {}) {
		this.addTemplate(aNames, React.createElement(aClass, aProps));
		
		return this;
	}
	
	addTemplatesFromClasses(aClasses, aProps = {}) {
		let currentArray = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(aClasses);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			this.addTemplateFromClass(currentItem["key"], currentItem["value"], aProps);
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
	
	static createFromClasses(aInput, aClasses, aDefaultTemplateName) {
		let newSwitchableAreaCreator = new SwitchableAreaCreator();
		newSwitchableAreaCreator.setInput(aInput);
		
		newSwitchableAreaCreator.addTemplatesFromClasses(aClasses);
		newSwitchableAreaCreator.setDefaultTemplateByName(aDefaultTemplateName);
		
		return newSwitchableAreaCreator;
	}
	
	static getReactElementsForDynamicClasses(aInput, aClasses, aDefaultTemplateName) {
		return React.createElement(
			Wprr.Adjust,
			{"adjust": Wprr.adjusts.switchValue(aInput, Wprr.sourceFunction(Wprr.utils.KeyValueGenerator, "normalizeArrayOrObject", [aClasses]), "selectedClass").setInput("defaultValue", aDefaultTemplateName)},
			React.createElement(
				Wprr.InsertElement, {"element": Wprr.sourceFunction(React, React.createElement, [Wprr.sourceProp("selectedClass")])}
			)
		);
	}
}