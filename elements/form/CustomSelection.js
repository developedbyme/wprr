import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DropdownSelection from "wprr/elements/form/DropdownSelection";

// import CustomSelection from "wprr/elements/form/CustomSelection";
export default class CustomSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_normalizeOptions(aOptions) {
		let returnArray = new Array();
		
		if(!aOptions) {
			console.error("Options not set.", this);
			
			return returnArray;
		}
		
		let options = aOptions;
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentObject = currentArray[i];
				
				if(currentObject === null || currentObject === undefined) {
					console.error("Option is null.", i, currentArray);
					continue;
				}
				else if(typeof(currentObject) === "object") {
					returnArray.push({"key": currentObject["value"], "value": currentObject["value"], "label": currentObject["label"]});
				}
				else {
					returnArray.push({"key": currentObject, "value": currentObject, "label": currentObject});
				}
			}
		}
		else {
			for(let objectName in options) {
				returnArray.push({"key": objectName, "value": objectName, "label": options[objectName]});
			}
		}
		
		return returnArray;
	}

	_getChildrenToClone() {
		//console.log("CustomSelection::_createClonedElement");
		
		let options = this._normalizeOptions(this.getSourcedProp("options"));
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.sourceProp(this.getSourcedProp("valueName")));
		
		let children = super._getChildrenToClone();
		
		let defaultMarkup = DropdownSelection.DEFAULT_MARKUP;
		
		let markup = this.getFirstValidSource(
			Wprr.sourceProp("markup"),
			Wprr.sourceReference("customSelection/markup"),
			defaultMarkup
		);
		
		let button = this.getFirstValidSource(
			Wprr.sourceProp("buttonMarkup"),
			Wprr.sourceReference("customSelection/button"),
			React.createElement("div", {"className": "custom-selection custom-selection-padding"},
				React.createElement(Wprr.Adjust, {"adjust": [Wprr.adjusts.labelFromOptions(Wprr.sourceReference("value"), Wprr.sourceReference("options"))]},
					Wprr.text(Wprr.sourceProp("text"))
				)
			)
		);
		
		let loopItemMarkup = React.createElement(Wprr.CommandButton, {
			"commands": [
				Wprr.commands.setValue(Wprr.sourceReference("value/" + valueName), valueName, Wprr.sourceReference("loop/item", "value")),
				Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false),
			]
		}, React.createElement("div", {"className": "custom-selection-option custom-selection-option-padding cursor-pointer"}, Wprr.text(Wprr.sourceReference("loop/item", "label"))));
		
		let defaultLoopItem = this.getFirstValidSource(
			Wprr.sourceProp("optionMarkup"),
			Wprr.sourceReference("customSelection/option"),
			loopItemMarkup
		);
		let defaultLoopItemSpacing = this.getFirstValidSource(
			Wprr.sourceProp("optionSpacingMarkup"),
			Wprr.sourceReference("customSelection/optionSpacing"),
			React.createElement(React.Fragment)
		);
		
		let defaultLoop = React.createElement("div", {"className": "custom-selection-menu custom-selection-menu-padding"}, React.createElement(Wprr.Loop, {
			"loop": Wprr.adjusts.markupLoop(Wprr.sourceReference("options"), defaultLoopItem, defaultLoopItemSpacing),
			"className": "custom-selection-menu-item custom-selection-menu-item-padding"
		}));
		
		let loop = this.getFirstValidSource(Wprr.sourceProp("loop"), Wprr.sourceReference("customSelection/loop"), defaultLoop);
		
		let loopPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "main"}, loop);
		let buttonPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "button"}, button);
		
		return [
			React.createElement(Wprr.ReferenceInjection, {"injectData": {"options": options, "valueName": valueName, "value": value}},
				React.createElement(Wprr.EditableProps, {"editableProps": "open", "open": false}, 
					React.createElement(DropdownSelection, {"markup": markup}, buttonPlacement, loopPlacement)
				)
			)
		]
	}
}
