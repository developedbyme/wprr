"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";


// import Triggers from "./Triggers";
export default class Triggers extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("Triggers::constructor");
		
		super._construct();
		
	}
	
	_renderMainElement() {
		//console.log("Triggers::_renderMainElement");
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		return React.createElement("div", {
		  className: "centered-content-text"
		}, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations&ids=", itemId),
		  as: "itemLoader"
		}, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.editors.EditorsGroup, null, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveAllGroup, null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceReference("editorsGroup", "itemEditor." + itemId),
		  as: "itemEditor"
		}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
		  label: "Triggers"
		}, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectRelation, {
		  direction: "incoming",
		  relationType: "for",
		  objectType: "trigger",
		  allowCreation: false
		}))))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
		  dataSettings: dataSettings
		}, /*#__PURE__*/React.createElement("div", null));
	}
}