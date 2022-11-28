"use strict";

import React from "react";
import Wprr from "wprr";

import DragAndDropList from '../draganddrop/DragAndDropList';

import ProcessPartStep from "./ProcessPartStep";

export default class EditProcess extends Wprr.MultipleRenderObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_addStep(aEditor) {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader("dbm_data");
		
		loader.changeData.setTerm("process-part", "dbm_type", "slugPath");
		loader.changeData.addTerm("value-item", "dbm_type", "slugPath");
		loader.changeData.setStatus("private");
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._stepCreated, [Wprr.sourceEvent("data.id"), aEditor]));
		
		loader.load();
	}
	
	_stepCreated(aId, aEditor) {
		//console.log("_stepCreated");
		//console.log(aId, aEditor);
		
		aEditor.add(aId);
	}
	
	_renderMainElement() {
		
		let items = this.getFirstInputWithDefault("items", []);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.items.EditItem, {
  item: Wprr.sourceReference("item")
}, /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "name"
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.FieldName, null), /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
  className: "standard-category-title standard-category-title-margin"
}, "Steps"), /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
  id: "relationEditors.incoming.in.process-part",
  as: "editor"
}, /*#__PURE__*/React.createElement(Wprr.layout.relation.OrderList, {
  orderId: "parts"
}, React.createElement(Wprr.RelatedItem, {
  id: Wprr.sourceCombine(Wprr.sourceReference("editor", "directionIdName"), ".linkedItem")
}, React.createElement(ProcessPartStep, null))), /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  text: Wprr.sourceTranslation("Add step", "addStep"),
  commands: Wprr.commands.callFunction(this, this._addStep, [Wprr.sourceReference("editor")]),
  className: "add-button add-button-padding"
}))))));

	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
	
		let dataSettings = {
			"item": {
				"value": "wprr/v1/range-item/dbm_data/drafts,privates,idSelection/status,fields,editObjectRelations?ids={id}",
				"replacements": {
					"{id}": {
						"type": "queryString",
						"path": "id",
					}
				}
			}
		};
	
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.form.FieldWithLabel, {
  valueName: "title",
  label: "Title",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
})));
	}
}
