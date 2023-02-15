"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditItemProperties from "./EditItemProperties";
export default class EditItemProperties extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditItemProperties::constructor");
		
		super._construct();
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
	}
	
	_renderMainElement() {
		//console.log("EditItemProperties::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: (this)._elementTreeItem,
  as: "editorItem"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: editorsGroup,
  as: "editorsGroup"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceStatic((this)._elementTreeItem, "table.linkedItem"),
  as: "table"
}, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations&ids=", itemId),
  as: "itemLoader"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [itemId]),
  as: "itemEditor"
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.editors.ObjectProperties, null)), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
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
}, /*#__PURE__*/React.createElement("div", null, "No changes to save"))))))))))));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null))
	}
}