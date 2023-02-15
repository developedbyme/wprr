"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditContentTemplate from "./EditContentTemplate";
export default class EditContentTemplate extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditContentTemplate::constructor");
		
		super._construct();
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let id = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		this._elementTreeItem.requireSingleLink("item").idSource.input(loader.item.requireSingleLink("singleItem").idSource);
		loader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=fields,fields/translations,relations&ids=" + id, "wprrData"));
		
		let languageLoader = this._elementTreeItem.createNode("languageLoader", "loadDataRange");
		this._elementTreeItem.getLinks("languages").input(languageLoader.item.getLinks("items"));
		languageLoader.setUrl(this.getWprrUrl("range/?select=relation&encode=type&type=type/language", "wprrData"));
	}
	
	_renderMainElement() {
		//console.log("EditContentTemplate::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: (this)._elementTreeItem.requireSingleLink("item").idSource
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: (this)._elementTreeItem,
  as: "editorItem"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: editorsGroup,
  as: "editorsGroup"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.SelectItem, {
  id: (this)._elementTreeItem.requireSingleLink("item").idSource,
  as: "item"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")]),
  as: "itemEditor"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Name"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Title"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["title"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceReference("valueEditor", "translationsEditor"),
  as: "translationsEditor"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing",
  itemClasses: "flex-no-resize, flex-resize"
}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}))))), /*#__PURE__*/React.createElement("div", {
  "data-slot": "spacing",
  className: "spacing small"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, null, Wprr.DropdownSelection.createSelfContained(React.createElement("div", {
  className: "button edit-button edit-button-padding add-button cursor-pointer"
}, Wprr.idText("Add translation", "site.addTranslation")), /*#__PURE__*/React.createElement("div", {
  className: "custom-selection-menu custom-selection-menu-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: (this)._elementTreeItem.getLinks("languages").idsSource
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]
}, /*#__PURE__*/React.createElement("div", {
  className: "hover-row cursor-pointer standard-row-padding"
}, Wprr.text(Wprr.sourceReference("item", "name")))))), {
  "className": "custom-dropdown"
})))))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Content"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["content"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.RichTextEditor, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceReference("valueEditor", "translationsEditor"),
  as: "translationsEditor"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing",
  itemClasses: "flex-no-resize, flex-resize"
}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.RichTextEditor, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}))))), /*#__PURE__*/React.createElement("div", {
  "data-slot": "spacing",
  className: "spacing small"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, null, Wprr.DropdownSelection.createSelfContained(React.createElement("div", {
  className: "button edit-button edit-button-padding add-button cursor-pointer"
}, Wprr.idText("Add translation", "site.addTranslation")), /*#__PURE__*/React.createElement("div", {
  className: "custom-selection-menu custom-selection-menu-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: (this)._elementTreeItem.getLinks("languages").idsSource
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]
}, /*#__PURE__*/React.createElement("div", {
  className: "hover-row cursor-pointer standard-row-padding"
}, Wprr.text(Wprr.sourceReference("item", "name")))))), {
  "className": "custom-dropdown"
})))))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
})))), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceReference("editorsGroup", "item.changed")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save")
}, /*#__PURE__*/React.createElement("div", null, "Save all changes")))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceReference("editorsGroup", "item.changed"),
  checkType: "invert/default"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding inactive"
}, /*#__PURE__*/React.createElement("div", null, "No changes to save")))))))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null))
	}
}