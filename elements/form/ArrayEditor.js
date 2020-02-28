import React from "react";
import Wprr from "wprr/Wprr"

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";
import EditableProps from "wprr/manipulation/EditableProps";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import ArrayEditor from "wprr/elements/form/ArrayEditor";
export default class ArrayEditor extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		
		let value = this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
		
		if(!value) {
			return [];
		}
		
		if(!Array.isArray(value)) {
			console.error("Value is not an array", this);
			return [];
		}
		
		return value;
	}
	
	_updateValue(aValue) {
		let additionalData = this.getSourcedProp("additionalData");
		let valueName = this.getSourcedProp("valueName");
		
		let newValue = aValue;
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, newValue, additionalData);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	addItem(aData) {
		console.log("wprr/elements/form/ArrayEditor::addItem");
		
		let currentArray = [].concat(this.getValue());
		
		currentArray.push(aData);
		this._updateValue(currentArray);
	}
	
	createItem() {
		console.log("wprr/elements/form/ArrayEditor::createItem");
		
		let newItemTemplate = this.getSourcedPropWithDefault("newItemTemplate", {});
		
		newItemTemplate = JSON.parse(JSON.stringify(newItemTemplate));
		
		this.addItem(newItemTemplate);
	}
	
	removeItem(aIndex) {
		console.log("wprr/elements/form/ArrayEditor::removeItem");
		console.log(aIndex);
		
		let currentArray = [].concat(this.getValue());
		
		currentArray.splice(aIndex, 1);
		
		this._updateValue(currentArray);
	}

	_renderClonedElement() {
		//console.log("wprr/elements/form/ArrayEditor::_renderMainElement");
		
		let value = this.getValue();
		
		let removeButtonSources = [
			Wprr.source("prop", "removeButtonMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/removeButtonMarkup"),
			React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(Wprr.sourceReference("trigger/removeItem"), "removeItem", [Wprr.sourceReference("loop/array/index")])},
				React.createElement("div", {"className": "button remove-button"}, "Remove")
			)
		];
		
		let createButtonSources = [
			Wprr.source("prop", "createButtonMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/createButtonMarkup"),
			React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(Wprr.sourceReference("trigger/createItem"), "createItem", [])},
				React.createElement("div", {"className": "button add-button"}, "Add")
			)
		];
		
		let editItemFormSources = [
			Wprr.source("prop", "editItemMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/editItemMarkup"),
			Wprr.text(Wprr.sourceReference("loop/array/item"))
		];
		
		let removeButton = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.getFirstResolvingSource(removeButtonSources, this, "element")},
			React.createElement(Wprr.InsertElement, {})
		);
		
		let minLength = this.getFirstInput("minLength", Wprr.sourceReferenceIfExists("arrayEditor/minLength"));
		if(minLength) {
			removeButton = React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("arrayEditor/numberOfItems"), "checkType": "greaterThan", "compareValue": minLength},
				removeButton
			);
		}
		
		let loopItemMarkup = this.getFirstValidSource(
			Wprr.source("prop", "loopItemMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/loopItemMarkup"),
			React.createElement(Wprr.FlexRow, {"className": "justify-between small-item-spacing", "itemClasses": ["flex-resize", "flex-no-resize"]},
				React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.getFirstResolvingSource(editItemFormSources, this, "element")},
					React.createElement(Wprr.InsertElement, {})
				),
				removeButton
			)
		);
		
		let loopItemSpacingMarkup = this.getFirstValidSource(
			Wprr.source("prop", "loopItemSpacingMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/loopItemSpacingMarkup"),
			null
		);
		
		let loopInjectionsMarkup = this.getFirstValidSource(
			Wprr.source("prop", "loopInjectionsMarkup"),
			Wprr.source("referenceIfExists", "arrayEditor/loopInjectionsMarkup"),
			React.createElement(Wprr.InjectChildren)
		);
		
		let loop = React.createElement(Wprr.Loop, {"loop": Wprr.adjusts.markupLoop(value, loopItemMarkup, loopItemSpacingMarkup), "loopName": "array"}, loopInjectionsMarkup);
		
		let markup = this.getFirstValidSource(
			Wprr.source("prop", "markup"),
			Wprr.source("referenceIfExists", "arrayEditor/markup"),
			React.createElement(Wprr.Markup, {"usedPlacements": "loop"},
				React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.dynamicKey("dynamicKey"), "dynamicKey": Wprr.source("combine", ["list-", Wprr.sourceReference("arrayEditor/numberOfItems")])},
					React.createElement(Wprr.MarkupChildren, {"placement": "loop"})
				),
				React.createElement(Wprr.MarkupChildren, {"placement": "rest"})
			)
		);
		
		let addButton = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.getFirstResolvingSource(createButtonSources, this, "element")},
			React.createElement(Wprr.InsertElement, {})
		)
		
		let injectData = {
			"trigger/addItem": this,
			"trigger/createItem": this,
			"trigger/removeItem": this,
			"arrayEditor/loop": loop,
			"arrayEditor/numberOfItems": value.length,
			"arrayEditor/addButton": addButton
		};
		
		let insertButton = React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("arrayEditor/addButton")});
		
		let maxLength = this.getFirstInput("maxLength", Wprr.sourceReferenceIfExists("arrayEditor/maxLength"));
		if(maxLength) {
			insertButton = React.createElement(Wprr.HasData, {"check": maxLength, "checkType": "greaterThan", "compareValue": Wprr.sourceReference("arrayEditor/numberOfItems")},
				insertButton
			);
		}
		
		let children = [
			React.createElement(Wprr.MarkupPlacement, {"placement": "loop"},
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("arrayEditor/loop")})
			),
			React.createElement(Wprr.MarkupPlacement, {"placement": "addButton"},
				insertButton	
			),
		];
		
		children = children.concat(this._getChildrenToClone());
		
		let returnElement = React.createElement(Wprr.ReferenceInjection, {"injectData": injectData},
			React.createElement(Wprr.UseMarkup, {"markup": markup},
				children
			)
		);
		
		return returnElement;
	}
	
	static makeSelfContained(aElement, aValue = "") {
		return React.createElement(EditableProps, {"editableProps": "value", "value": aValue, "valueName": "value"}, aElement);
	}
}
