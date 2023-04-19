import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class AddRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		this._elementTreeItem.getValueSource("search").addChangeCommand(Wprr.commands.callFunction(this, this._performSearch));
		
		let singleResultLoader = this._elementTreeItem.addNode("singleResultLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		this._elementTreeItem.getLinks("singleResults").input(singleResultLoader.item.getLinks("items"));
		this._performSearch();
	}
	
	_performSearch() {
		//console.log("_performSearch");
		
		let search = this._elementTreeItem.getValue("search");
		
		let singleResultLoader = Wprr.objectPath(this._elementTreeItem, "singleResultLoader.linkedItem.controller");
		//console.log(singleResultLoader, this._elementTreeItem);
		
		let objectType = this.getFirstInputWithDefault("objectType", "*");
		
		if(search === "") {
			if(objectType !== "*") {
				singleResultLoader.setUrl(this.getWprrUrl("range/?select=relation,anyStatus&encode=postTitle,postStatus,objectTypes&type=" + objectType, "wprrData"));
			}
		}
		else {
			let numericSearch = 1*search;
		
			if(isNaN(numericSearch) || numericSearch != search) {
				if(objectType !== "*") {
					singleResultLoader.setUrl(this.getWprrUrl("range/?select=search,anyStatus,relation&encode=postTitle,postStatus,objectTypes&search=" + encodeURIComponent(search) + "&type=" + objectType, "wprrData"));
				}
				else {
					singleResultLoader.setUrl(this.getWprrUrl("range/?select=search,anyStatus&encode=postTitle,postStatus,objectTypes&search=" + encodeURIComponent(search), "wprrData"));
				}
			}
			else {
				if(objectType !== "*") {
					singleResultLoader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus,relation&encode=postTitle,postStatus,objectTypes&ids=" + numericSearch + "&type=" + objectType, "wprrData"));
				}
				else {
					singleResultLoader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,objectTypes&ids=" + numericSearch, "wprrData"));
				}
			}
		}
		
		
	}
	
	_renderMainElement() {
		//console.log("AddRelation::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "outgoing");
		let relationType = this.getFirstInputWithDefault("relationType", "pointing-to");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		let objectType = this.getFirstInputWithDefault("objectType", "*");
		
		
		
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, objectType]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement("div", null, Wprr.DropdownSelection.createSelfContained(React.createElement("div", {
		  className: "button edit-button edit-button-padding add-button cursor-pointer"
		}, Wprr.idText("Add", "site.add")), React.createElement("div", {
		  className: "custom-selection-menu custom-selection-menu-padding"
		}, /*#__PURE__*/React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, /*#__PURE__*/React.createElement(Wprr.FormField, {
		  autoFocus: true,
		  value: this._elementTreeItem.getValueSource("search"),
		  className: "integrated-field full-size"
		})), /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: this._elementTreeItem.getLinks("singleResults").idsSource
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: [Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "createRelation", [Wprr.sourceReference("item", "id")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]
		}, /*#__PURE__*/React.createElement("div", {
		  className: "hover-row cursor-pointer standard-row-padding"
		}, Wprr.text(Wprr.sourceReference("item", "title")), " ", /*#__PURE__*/React.createElement("span", {
		  className: "post-id-description"
		}, "(", Wprr.text(Wprr.sourceReference("item", "id")), ")"))))), {
		  "className": "custom-dropdown"
		})))
		);
	}
}
