import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class EditValueObjectProperty extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "none");
		this._elementTreeItem.setValue("loaded", false);
		
		let identifier = this.getFirstInput("identifier");
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		
	
		let loader = this._elementTreeItem.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
		this._elementTreeItem.getValueSource("loaded").input(loader.item.getValueSource("loaded"));
			
		let url = "range/?select=objectProperty,anyStatus&encode=id&fromIds=" + id + "&identifier=" + identifier;
		loader.item.setValue("url", this.getWprrUrl(url, "wprrData"));
		
		
	}
	
	_createItem() {
		console.log("_createItem");
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let identifier = this.getFirstInput("identifier");
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		let name = this.getFirstInputWithDefault("name", "Object property " + identifier + " for " + id );
		
		let types = Wprr.utils.array.arrayOrSeparatedString(this.getFirstInput("types"));
		
		let loader = project.getCreateLoader("dbm_data", "object-property", "draft", name);
		loader.changeData.addTerm('identifiable-item', "dbm_type", "slugPath");
		loader.changeData.addTerm('value-item', "dbm_type", "slugPath");
		loader.changeData.createChange("dbmtc/setField", {"field": "identifier", "value": identifier});
		loader.changeData.addOutgoingRelation(id, "for");
		
		let status = this.getFirstInputWithDefault("status", "private");
		loader.changeData.setStatus(status);
		
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
		
		let id = this.getFirstInput("id", Wprr.sourceReference("item", "id"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: id,
  checkType: "positiveValue"
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: this._elementTreeItem.getValueSource("loaded")
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: this._elementTreeItem.getLinks("items").idsSource,
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: this._elementTreeItem.getLinks("items").idsSource
}, aSlots.default( /*#__PURE__*/React.createElement("div", null, Wprr.idText("No element set"))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: this._elementTreeItem.getLinks("items").idsSource,
  checkType: "invert/notEmpty"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  commands: Wprr.commands.callFunction(this, this._createItem),
  text: Wprr.sourceTranslation("Setup", "site.setup")
}))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: id,
  checkType: "invert/positiveValue"
}, /*#__PURE__*/React.createElement("div", null, "No id set")));
	}
}
