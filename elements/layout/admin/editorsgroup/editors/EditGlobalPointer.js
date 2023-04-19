import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class EditGlobalPointer extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "none");
		this._elementTreeItem.setValue("loaded", false);
		
		let identifier = this.getFirstInput("identifier");
		
		
	
		let loader = this._elementTreeItem.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
		this._elementTreeItem.getValueSource("loaded").input(loader.item.getValueSource("loaded"));
			
		let url = "range/?select=globalPointer,includePrivate&encode=id&id=" + identifier;
		loader.item.setValue("url", this.getWprrUrl(url, "wprrData"));
		
		
	}
	
	_createItem() {
		let identifier = this.getFirstInput("identifier");
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader("dbm_data", "global-item", "draft", "Global item " + identifier);
		loader.changeData.setDataField("identifier", identifier);
		loader.changeData.setStatus("private");
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.sourceEvent("data.id")]));
		
		loader.load();
	}
	
	_itemCreated(aId) {
		console.log("_itemCreated");
		console.log(aId);
		
		this._elementTreeItem.getLinks("items").addItem(aId);
	}
	
	_getLayout(aSlots) {
		//console.log("_getLayout");
		
		return React.createElement("div", null, 
			React.createElement(Wprr.HasData, {check: this._elementTreeItem.getValueSource("loaded")},
				React.createElement(Wprr.HasData, {check: this._elementTreeItem.getLinks("items").idsSource, checkType: "notEmpty"},
					React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("items").idsSource},
						aSlots.default( React.createElement("div", null, Wprr.idText("No element set")))
					)
				),
				React.createElement(Wprr.HasData, {check: this._elementTreeItem.getLinks("items").idsSource, checkType: "invert/notEmpty"},
					React.createElement(Wprr.FlexRow, null,
						React.createElement(Wprr.layout.interaction.Button, {commands: Wprr.commands.callFunction(this, this._createItem), text: Wprr.sourceTranslation("Setup", "site.setup")})
					)
				)
			)
		);
	}
}
