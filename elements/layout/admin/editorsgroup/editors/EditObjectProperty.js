import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class EditObjectProperty extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "none");
		this._elementTreeItem.setValue("loaded", false);
		
		let identifier = this.getFirstInput("identifier");
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		
	
		let loader = this._elementTreeItem.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
		this._elementTreeItem.getValueSource("loaded").input(loader.item.getValueSource("loaded"));
			
		let url = "range/?select=objectProperty,anyStatus&encode=id&fromIds=" + id + "&identifier=" + identifier + "&path=out:pointing-to:*";
		loader.item.setValue("url", this.getWprrUrl(url, "wprrData"));
		
		
	}
	
	_createItem() {
		console.log("_createItem");
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let name = this.getFirstInputWithDefault("name", "New item");
		let types = Wprr.utils.array.arrayOrSeparatedString(this.getFirstInput("types"));
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		let identifier = this.getFirstInput("identifier");
		
		let loader = project.getCreateLoader("dbm_data", null, "draft", name);
		let currentArray = types;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			loader.changeData.addTerm(currentArray[i], "dbm_type", "slugPath");
		}
		loader.changeData.createChange("dbm/setAsObjectProperty", {"value": id, "identifier": identifier});
		
		let status = this.getFirstInputWithDefault("status", "private");
		loader.changeData.setStatus(status);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.sourceEvent("data.id")]));
		
		this._elementTreeItem.setValue("mode", "creating");
		loader.load();
		
	}
	
	_itemCreated(aId) {
		console.log("_itemCreated");
		console.log(aId);
		
		this._elementTreeItem.getLinks("items").addItem(aId);
		this._elementTreeItem.setValue("mode", "created");
	}
	
	_getLayout(aSlots) {
		//console.log("_getLayout");
		
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		
		return React.createElement("div", null,
			React.createElement(Wprr.HasData, {check: id, checkType: "positiveValue"},
				React.createElement(Wprr.HasData, {check: this._elementTreeItem.getValueSource("loaded")},
					React.createElement(Wprr.HasData, {check: this._elementTreeItem.getLinks("items").idsSource, checkType: "notEmpty"},
						React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("items").idsSource},
							aSlots.default(React.createElement("div", null, Wprr.idText("No element set")))
						)
					),
					React.createElement(Wprr.HasData, {check: this._elementTreeItem.getLinks("items").idsSource, checkType: "invert/notEmpty"},
						React.createElement(Wprr.SelectSection, {"selectedSections": this._elementTreeItem.getValueSource("mode")},
							React.createElement("div", {"data-default-section": true, "data-section-name": "none"},
								React.createElement(Wprr.FlexRow, null,
									React.createElement(Wprr.layout.interaction.Button, {"className": "standard-button standard-button-padding cursor-pointer", commands: Wprr.commands.callFunction(this, this._createItem), text: aSlots.prop("buttonText", Wprr.sourceTranslation("Setup", "site.setup"))})
								)
							),
							React.createElement("div", {"data-section-name": "creating"},
								React.createElement(Wprr.FlexRow, null,
									React.createElement("div", {"className": "standard-button standard-button-padding inactive-during-process"}, Wprr.text(aSlots.prop("creatingText", Wprr.sourceTranslation("Setting up", "site.settingUp"))))
								)
							)
						)
					)
				)
			),
			React.createElement(Wprr.HasData, { check: id, checkType: "invert/positiveValue"},
				React.createElement("div", null, "No id set")
			)
		);
	}
}
