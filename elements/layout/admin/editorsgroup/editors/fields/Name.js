import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "name");
		
		let nameEditor = this.getFirstInput(Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName]));
		
		this._elementTreeItem.getValueSource("name").input(nameEditor.valueSource);
		
		let nameSplit = this._elementTreeItem.addNode("nameSplit", new Wprr.utils.data.nodes.SetObjectProperties());
		
		this._elementTreeItem.requireValue("firstName", Wprr.objectPath(nameEditor, "value.firstName"));
		this._elementTreeItem.requireValue("lastName", Wprr.objectPath(nameEditor, "value.lastName"));
		
		nameSplit.addPropertySource("firstName", this._elementTreeItem.getValueSource("firstName"));
		nameSplit.addPropertySource("lastName", this._elementTreeItem.getValueSource("lastName"));
		nameSplit.sources.get("object").input(this._elementTreeItem.getValueSource("name"));
	}
	
	
	
	_renderMainElement() {
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "name");
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing flex-no-wrap"
		}, /*#__PURE__*/React.createElement(Wprr.FormField, {
		  className: "standard-field standard-field-padding full-width",
		  value: this._elementTreeItem.getValueSource("firstName")
		}), /*#__PURE__*/React.createElement(Wprr.FormField, {
		  className: "standard-field standard-field-padding full-width",
		  value: this._elementTreeItem.getValueSource("lastName")
		})), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))
		);
	}
}
