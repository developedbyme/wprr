import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DropdownSelection from "wprr/elements/form/DropdownSelection";

// import CustomMultipleSelection from "wprr/elements/form/CustomMultipleSelection";
export default class CustomMultipleSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.sourceProp(this.getSourcedProp("valueName")));
		
		if(Array.isArray(value)) {
			return [].concat(value);
		}
		
		return [];
	}
	
	_changed(aNewValue) {
		console.log("wprr/elements/form/CustomMultipleSelection::_changed");
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
		//console.log("CustomMultipleSelection::_removeUsedProps");
		
		delete aReturnObject["changeCommands"];
		
		return aReturnObject;
	}

	_getChildrenToClone() {
		//console.log("CustomMultipleSelection::_createClonedElement");
		
		let options = this._normalizeOptions(this.getSourcedProp("options"));
		let valueName = this.getSourcedProp("valueName");
		let externalStorage = this.getSourcedProp("externalStorage");
		
		let value = this.getSourcedPropWithDefault("value", Wprr.sourceProp(this.getSourcedProp("valueName")));
		
		let children = super._getChildrenToClone();
		
		let defaultMarkup = DropdownSelection.DEFAULT_MARKUP;
		
		let markup = this.getFirstInput(
			Wprr.sourceProp("markup"),
			Wprr.sourceReferenceIfExists("multipleSelection/markup"),
			defaultMarkup
		);
		
		let noSelectionLabel = this.getFirstInput(Wprr.sourceProp("noSelectionLabel"), Wprr.sourceTranslation("Choose"));
		let selectedItemLoopItem = React.createElement("span", {},
			React.createElement(Wprr.Adjust, {"adjust": [Wprr.adjusts.labelFromOptions(Wprr.sourceReference("loop/item"), Wprr.sourceReference("options"))]},
				Wprr.text(null)
			)
		);
		
		let button = this.getFirstInput(
			Wprr.sourceProp("buttonMarkup"),
			Wprr.sourceReferenceIfExists("multipleSelection/button"),
			React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.getFirstResolvingSource(
				[
					Wprr.sourceProp("buttonClasses"),
					Wprr.sourceReference("multipleSelection/buttonClasses"),
					"custom-selection custom-selection-padding"
				],
				this,
				"className"
			)},
				React.createElement("div", {},
					React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("value"), "checkType": "notEmpty"},
						React.createElement(Wprr.Adjust, {"adjust": [
							Wprr.adjusts.selectItemsInArray(options, Wprr.sourceReference("value"), "value", "selectedOptions"),
							Wprr.adjusts.mapPropertyInArray(Wprr.sourceProp("selectedOptions"), "label", "selectedLabels"),
							Wprr.adjusts.startOfArrayAsText(Wprr.sourceProp("selectedLabels"), 3)
						]},
							Wprr.text(null)
						)
					),
					React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("value"), "checkType": "invert/notEmpty"},
						Wprr.text(noSelectionLabel)
					)
				)
			)
		);
		
		let optionContentItem = this.getFirstInput(
			Wprr.sourceProp("optionContentMarkup"),
			Wprr.sourceReferenceIfExists("multipleSelection/optionContent"),
			React.createElement("div", {"className": "custom-selection-option custom-selection-option-padding cursor-pointer"}, Wprr.text(Wprr.sourceReference("loop/item", "label")))
		);
		
		let loopItemMarkup = React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"}, 
			React.createElement(Wprr.MultipleSelectionValue, {"externalStorage": Wprr.sourceReference("externalStorage"), "fieldName": Wprr.sourceReference("externalStorage/fieldName"), "value": Wprr.sourceReference("loop/item", "value")},
				React.createElement(Wprr.Checkbox, {"valueName": "selected"})
			),
			React.createElement(Wprr.MultipleSelectionValue, {"externalStorage": Wprr.sourceReference("externalStorage"), "fieldName": Wprr.sourceReference("externalStorage/fieldName"), "value": Wprr.sourceReference("loop/item", "value")},
				React.createElement(Wprr.CommandButton, {
					"commands": [
						Wprr.commands.setValue(Wprr.sourceReference("value/selected"), "selected", true),
						Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false),
					]
				}, optionContentItem)
			),
		);
		
		let loopItem = this.getFirstInput(
			Wprr.sourceProp("optionMarkup"),
			Wprr.sourceReferenceIfExists("multipleSelection/option"),
			loopItemMarkup
		);
		let loopItemSpacing = this.getFirstInput(
			Wprr.sourceProp("optionSpacingMarkup"),
			Wprr.sourceReferenceIfExists("multipleSelection/optionSpacing"),
			React.createElement(React.Fragment)
		);
		
		let selectionMenuClasses = this.getFirstInputWithDefault(
			Wprr.sourceProp("selectionMenuClasses"),
			Wprr.sourceReferenceIfExists("multipleSelection/selectionMenuClasses"),
			"custom-selection-menu custom-selection-menu-padding"
		);
		
		let defaultLoop = React.createElement("div", {"className": selectionMenuClasses},
			React.createElement(Wprr.InsertElement, {"element": this.getFirstInput(Wprr.sourceProp("beforeLoopElement"), Wprr.sourceReferenceIfExists("multipleSelection/beforeLoopElement")), "canBeEmpty": true}),
			React.createElement(Wprr.Loop, {
				"loop": Wprr.adjusts.markupLoop(Wprr.sourceReference("options"), React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReferenceIfExists("selectionElements/loopItem")}), loopItemSpacing),
				"className": "custom-selection-menu-item custom-selection-menu-item-padding"
			}),
			React.createElement(Wprr.InsertElement, {"element": this.getFirstInput(Wprr.sourceProp("afterLoopElement"), Wprr.sourceReferenceIfExists("multipleSelection/afterLoopElement")), "canBeEmpty": true})
		);
		
		let filter = this.getFirstInput(
			Wprr.sourceProp("filterOptions"),
			Wprr.sourceReferenceIfExists("multipleSelection/filterOptions")
		);
		
		if(filter) {
			defaultLoop = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.applyFilterChain(Wprr.sourceReference("options"), filter, "options")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": {"options": Wprr.sourceProp("options")}},
					defaultLoop
				)
			);
		}
		
		let loop = this.getFirstValidSource(Wprr.sourceProp("loop"), Wprr.sourceReferenceIfExists("multipleSelection/loop"), defaultLoop);
		
		let loopPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "main"},
			React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("selectionElements/optionsLoop")})
		);
		let buttonPlacement = React.createElement(Wprr.MarkupPlacement, {"placement": "button"}, button);
		
		let injectData = {
			"options": options,
			"value": Wprr.source("propWithDots", valueName),
			"valueName": valueName,
			"selectionElements/optionsLoop": loop,
			"selectionElements/loopItem": loopItem,
			"externalStorage": externalStorage,
			"externalStorage/fieldName": valueName,
		};
		
		let returnObject = React.createElement(Wprr.MultipleSelection, {"externalStorage": externalStorage, "fieldName": valueName, "valueName": valueName},
			React.createElement(Wprr.ReferenceInjection, {"injectData": injectData},
				React.createElement(Wprr.EditableProps, {"editableProps": "open", "open": false}, 
					React.createElement(DropdownSelection, {"markup": markup}, buttonPlacement, loopPlacement)
				)
			)
		);
		
		return [returnObject];
	}
}
