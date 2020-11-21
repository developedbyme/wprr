import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DropdownSelection from "wprr/elements/form/DropdownSelection";

import SourceData from "wprr/reference/SourceData";

// import CustomSelection from "wprr/elements/form/CustomSelection";
export default class CustomSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._selectedValue = Wprr.sourceValue(null);
	}
	
	_changed(aNewValue) {
		console.log("wprr/elements/form/CustomSelection::_changed");
		console.log(aNewValue);
		
		let valueName = this.getSourcedProp("valueName");
		
		this.updateProp("value", aNewValue);
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, aNewValue, null);
		}
		
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
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", this.getSourcedProp("valueName")));
		
		return value;
	}
	
	_prepareRender() {
		
		super._prepareRender();
		
		this._selectedValue.setValue(this.getValue());
	}

	_getChildrenToClone() {
		//console.log("CustomSelection::_createClonedElement");
		
		let options = this._normalizeOptions(this.getSourcedProp("options"));
		let valueName = this.getSourcedProp("valueName");
		let value = this.getValue();
		
		let children = super._getChildrenToClone();
		
		let defaultMarkup = DropdownSelection.DEFAULT_MARKUP;
		
		let markup = this.getFirstValidSource(
			Wprr.sourceProp("markup"),
			Wprr.sourceReferenceIfExists("customSelection/markup"),
			defaultMarkup
		);
		
		let buttonClasses = this.getFirstValidSource(
			Wprr.sourceProp("buttonClasses"),
			Wprr.sourceReferenceIfExists("customSelection/buttonClasses"),
			"custom-selection custom-selection-padding"
		);
		
		let button = this.getFirstValidSource(
			Wprr.sourceProp("buttonMarkup"),
			Wprr.sourceReference("customSelection/button"),
			React.createElement("div", {"className": buttonClasses},
				React.createElement(Wprr.Adjust, {"adjust": [Wprr.adjusts.labelFromOptions(Wprr.sourceReference("value"), Wprr.sourceReference("options"), "label")], "sourceUpdates": Wprr.sourceReference("value")},
					React.createElement(Wprr.HasData, {"check": Wprr.sourceProp("label")},
						Wprr.text(Wprr.sourceProp("label"))
					),
					React.createElement(Wprr.HasData, {"check": Wprr.sourceProp("label"), "checkType": "invert/default"},
						Wprr.text(Wprr.sourceFirst(Wprr.sourcePropFrom(this, "noSelectionLabel"), Wprr.sourceTranslation("Select")))
					)
				)
			)
		);
		
		let optionContentItem = this.getFirstValidSource(
			Wprr.sourceProp("optionContentMarkup"),
			Wprr.sourceReferenceIfExists("customSelection/optionContent"),
			React.createElement("div", {"className": "custom-selection-option custom-selection-option-padding cursor-pointer"}, Wprr.text(Wprr.sourceReference("loop/item", "label")))
		);
		
		let loopItemMarkup = React.createElement(Wprr.CommandButton, {
			"commands": [
				Wprr.commands.callFunction(this, this._changed, [Wprr.sourceReference("loop/item", "value")]),
				Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false),
			]
		}, optionContentItem);
		
		let defaultLoopItem = this.getFirstInput(
			Wprr.sourceProp("optionMarkup"),
			Wprr.sourceReferenceIfExists("customSelection/option"),
			loopItemMarkup
		);
		let defaultLoopItemSpacing = this.getFirstInput(
			Wprr.sourceProp("optionSpacingMarkup"),
			Wprr.sourceReferenceIfExists("customSelection/optionSpacing"),
			React.createElement(React.Fragment)
		);
		
		let selectionMenuClasses = this.getFirstInputWithDefault(
			Wprr.sourceProp("selectionMenuClasses"),
			Wprr.sourceReferenceIfExists("customSelection/selectionMenuClasses"),
			"custom-selection-menu custom-selection-menu-padding"
		);
		
		//"className": "custom-selection-menu-item custom-selection-menu-item-padding"
		
		let defaultLoop = React.createElement("div", {"className": selectionMenuClasses}, React.createElement(Wprr.Loop, {
			"loop": Wprr.adjusts.markupLoop(Wprr.sourceReference("options"), defaultLoopItem, defaultLoopItemSpacing)
		}));
		
		let loop = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.getFirstResolvingSource([Wprr.sourceProp("loop"), Wprr.sourceReferenceIfExists("customSelection/loop"), defaultLoop], this, "element")},
			React.createElement(Wprr.InsertElement, {})
		);
		
		let filter = this.getFirstInput(
			Wprr.sourceProp("filterOptions"),
			Wprr.sourceReferenceIfExists("customSelection/filterOptions")
		);
		
		let sort = this.getFirstInput(
			Wprr.sourceProp("sortOptions"),
			Wprr.sourceReferenceIfExists("customSelection/sortOptions")
		);
		
		if(filter || sort) {
			let adjustments = [];
			if(filter) {
				adjustments.push(Wprr.adjusts.applyFilterChain(Wprr.sourceProp("options"), filter, "options"))
			}
			if(sort) {
				adjustments.push(Wprr.adjusts.applySortChain(Wprr.sourceProp("options"), sort, "options"))
			}
			
			loop = React.createElement(Wprr.Adjust, {"adjust": adjustments, "options": Wprr.sourceReference("options")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": {"options": Wprr.sourceProp("options")}},
					loop
				)
			);
		}
		
		let loopPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "main"}, loop);
		let buttonPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "button"}, button);
		
		let returnObject = React.createElement(Wprr.ReferenceInjection, {"injectData": {
			"options": options,
			"valueName": valueName,
			"value": this._selectedValue,
			"customSelection/option": defaultLoopItem,
			"customSelection/optionSpacing": defaultLoopItemSpacing,
		}},
			React.createElement(Wprr.EditableProps, {"editableProps": "open", "open": false}, 
				React.createElement(DropdownSelection, {"markup": markup}, buttonPlacement, loopPlacement)
			)
		);
		
		return [returnObject];
	}
}
