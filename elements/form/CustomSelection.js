import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DropdownSelection from "wprr/elements/form/DropdownSelection";

// import CustomSelection from "wprr/elements/form/CustomSelection";
export default class CustomSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_changed(aNewValue) {
		console.log("wprr/elements/form/CustomSelection::_changed");
		console.log(aNewValue);
		
		let commands = this.getSourcedProp("changeCommands");
		if(commands) {
			let currentArray;
			if(Array.isArray(commands)) {
				currentArray = commands;
			}
			else {
				currentArray = [commands];
			}
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				//METODO: resolve command
				let currentCommand = currentArray[i];
				
				currentCommand.setTriggerElement(this);
				currentCommand.setEventData(aNewValue);
				
				currentCommand.perform();
			}
		}
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
					
					let encodedData = {"key": currentObject["value"], "value": currentObject["value"], "label": currentObject["label"]};
					if(currentObject["additionalData"]) {
						encodedData["additionalData"] = currentObject["additionalData"];
					}
					
					returnArray.push(encodedData);
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
	
	_removeUsedProps(aReturnObject) {
		//console.log("CustomSelection::_removeUsedProps");
		
		delete aReturnObject["changeCommands"];
		
		return aReturnObject;
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
		
		let buttonClasses = this.getFirstValidSource(
			Wprr.sourceProp("buttonClasses"),
			Wprr.sourceReference("customSelection/buttonClasses"),
			"custom-selection custom-selection-padding"
		);
		
		let button = this.getFirstValidSource(
			Wprr.sourceProp("buttonMarkup"),
			Wprr.sourceReference("customSelection/button"),
			React.createElement("div", {"className": buttonClasses},
				React.createElement(Wprr.Adjust, {"adjust": [Wprr.adjusts.labelFromOptions(Wprr.sourceReference("value"), Wprr.sourceReference("options"))]},
					Wprr.text(Wprr.sourceProp("text"))
				)
			)
		);
		
		let optionContentItem = this.getFirstValidSource(
			Wprr.sourceProp("optionContentMarkup"),
			Wprr.sourceReference("customSelection/optionContent"),
			React.createElement("div", {"className": "custom-selection-option custom-selection-option-padding cursor-pointer"}, Wprr.text(Wprr.sourceReference("loop/item", "label")))
		);
		
		let loopItemMarkup = React.createElement(Wprr.CommandButton, {
			"commands": [
				Wprr.commands.setValue(Wprr.sourceReference("value/" + valueName), valueName, Wprr.sourceReference("loop/item", "value")),
				Wprr.commands.callFunction(this, this._changed, [Wprr.sourceReference("loop/item", "value")]),
				Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false),
			]
		}, optionContentItem);
		
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
		
		let selectionMenuClasses = this.getFirstValidSource(
			Wprr.sourceProp("selectionMenuClasses"),
			Wprr.sourceReference("customSelection/selectionMenuClasses"),
			"custom-selection-menu custom-selection-menu-padding"
		);
		
		let defaultLoop = React.createElement("div", {"className": selectionMenuClasses}, React.createElement(Wprr.Loop, {
			"loop": Wprr.adjusts.markupLoop(Wprr.sourceReference("options"), defaultLoopItem, defaultLoopItemSpacing),
			"className": "custom-selection-menu-item custom-selection-menu-item-padding"
		}));
		
		let filter = this.getFirstValidSource(
			Wprr.sourceProp("filterOptions"),
			Wprr.sourceReference("customSelection/filterOptions")
		);
		
		if(filter) {
			defaultLoop = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.applyFilterChain(Wprr.sourceReference("options"), filter, "options")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": {"options": Wprr.sourceProp("options")}},
					defaultLoop
				)
			);
		}
		
		let loop = this.getFirstValidSource(Wprr.sourceProp("loop"), Wprr.sourceReference("customSelection/loop"), defaultLoop);
		
		let loopPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "main"}, loop);
		let buttonPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "button"}, button);
		
		let returnObject = React.createElement(Wprr.ReferenceInjection, {"injectData": {"options": options, "valueName": valueName, "value": value}},
			React.createElement(Wprr.EditableProps, {"editableProps": "open", "open": false}, 
				React.createElement(DropdownSelection, {"markup": markup}, buttonPlacement, loopPlacement)
			)
		);
		
		return [returnObject];
	}
}
