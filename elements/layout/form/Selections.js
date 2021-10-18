import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import Selections from "./Selections";
export default class Selections extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("selections");
		
		
		this._layoutName = "selections";
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		
		this._elementTreeItem.getNamedLinks("isSelectedNodes");
	}
	
	getIsSelectedItemForValue(aValue) {
		//console.log("getIsSelectedItemForValue");
		let valueSource = this._elementTreeItem.getType("slot/value");
		
		let isSelectedNodesLinks = this._elementTreeItem.getNamedLinks("isSelectedNodes");
		
		if(!isSelectedNodesLinks.hasLinkByName(aValue)) {
			let item = this._elementTreeItem.group.createInternalItem();
			
			isSelectedNodesLinks.addItem(aValue, item.id);
			
			let isSelectedNode = new Wprr.utils.data.nodes.IsSelectedCondition();
			item.addType("node", isSelectedNode);
			
			item.requireValue("isSelected");
			
			valueSource.connectSource(isSelectedNode.sources.get("selectedValue"));
			isSelectedNode.value = aValue;
			isSelectedNode.sources.get("isSelected").connectSource(item.getType("isSelected"));
		}
		
		let item = isSelectedNodesLinks.getLinkByName(aValue);
		
		return item;
	}
	
	_getLayout(aSlots) {
		//console.log("Selections::_renderMainElement");
		
		let valueSource = aSlots.prop("value", null);
		let itemValueSource = Wprr.sourceReference("loop/item", "key");
		
		let defaultSelection = React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(this, this.getIsSelectedItemForValue, [itemValueSource]), as: "isSelectedItem"},
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing", itemClasses: "flex-no-resize,flex-resize"},
				React.createElement(Wprr.CustomCheckbox, {checked: Wprr.sourceReference("isSelectedItem", "isSelected")},
					React.createElement("div", {"data-section-name": "on", className: "custom-checkbox custom-checkbox-padding checked cursor-pointer"},
						React.createElement(Wprr.Image, {src: aSlots.prop("checkmarkImagePath", "icons/checkmark.svg"), location: "images", className: "full-size background-contain"})
					),
					React.createElement("div", {"data-section-name": "off", className: "custom-checkbox custom-checkbox-padding cursor-pointer"})
				),
				React.createElement("div", {},
					React.createElement("div", {className: "standard-field-label no-margins"},
						Wprr.text(Wprr.sourceReference("loop/item", "label"))
					),
					React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("loop/item", "description"), "checkType": "notEmpty"},
						React.createElement("div", {className: "spacing micro"}),
						React.createElement("div", {className: "small-description no-paragraph-margins-around"},
							Wprr.text(Wprr.sourceReference("loop/item", "description"), "html")
						)
					)
				)
			)
		);
		
		let loopItem = aSlots.slot("loopItem", aSlots.default(defaultSelection));
		let spacing = aSlots.slot("spacing", React.createElement("div", {"className": "spacing small"}));
		
		return React.createElement("div", {className: ""},
			Wprr.Loop.createMarkupLoop(aSlots.prop("options", []), loopItem, spacing)
		);
	}
}
