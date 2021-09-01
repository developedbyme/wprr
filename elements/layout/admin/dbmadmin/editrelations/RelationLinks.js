"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

export default class EditRelation extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput(Wprr.sourceReference("item"));
		let groupedOutgoing = Wprr.utils.array.groupArray(Wprr.objectPath(item, "relations.outgoing"), "connectionType");
		let groupedIncoming = Wprr.utils.array.groupArray(Wprr.objectPath(item, "relations.incoming"), "connectionType");
		
		console.log(item, groupedOutgoing, Wprr.objectPath(item, "relations.outgoing"));
		
		return React.createElement("div", {
  className: "centered-site"
}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "title"))), /*#__PURE__*/React.createElement("div", null, "Outgoing"), /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: groupedOutgoing
}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "key")), " ", Wprr.text(Wprr.sourceReference("item", "id")), " ..."), /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("loop/item", "value")
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing"
}, /*#__PURE__*/React.createElement("div", null, React.createElement(Wprr.Link, {
  "href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("loop/item", "toId"))
}, Wprr.text(Wprr.sourceReference("loop/item", "toId")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("loop/item", "toTypes")
}, /*#__PURE__*/React.createElement("span", null, Wprr.text(Wprr.sourceReference("loop/item"))), /*#__PURE__*/React.createElement("span", {
  "data-slot": "spacing"
}, ", "))), /*#__PURE__*/React.createElement("div", null, React.createElement(Wprr.Link, {
  "href": Wprr.sourceCombine(this.getWprrUrl("admin/items/relation", "site"), "?id=", Wprr.sourceReference("loop/item", "id"))
}, "Relation ", Wprr.text(Wprr.sourceReference("loop/item", "id")))), /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "startAt"))), /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "endAt")))))), /*#__PURE__*/React.createElement("div", null, "Incoming"), /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: groupedIncoming
}, /*#__PURE__*/React.createElement("div", null, "... ", Wprr.text(Wprr.sourceReference("loop/item", "key")), " ", Wprr.text(Wprr.sourceReference("item", "id"))), /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("loop/item", "value")
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing"
}, /*#__PURE__*/React.createElement("div", null, React.createElement(Wprr.Link, {
  "href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("loop/item", "fromId"))
}, Wprr.text(Wprr.sourceReference("loop/item", "fromId")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceReference("loop/item", "fromTypes")
}, /*#__PURE__*/React.createElement("span", null, Wprr.text(Wprr.sourceReference("loop/item"))), /*#__PURE__*/React.createElement("span", {
  "data-slot": "spacing"
}, ", "))), /*#__PURE__*/React.createElement("div", null, React.createElement(Wprr.Link, {
  "href": Wprr.sourceCombine(this.getWprrUrl("admin/items/relation", "site"), "?id=", Wprr.sourceReference("loop/item", "id"))
}, "Relation ", Wprr.text(Wprr.sourceReference("loop/item", "id")))), /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "startAt"))), /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "endAt")))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"item": {
				"value": "wprr/v1/range-item/any/drafts,privates,idSelection/default,status,editObjectRelations?ids={id}",
				"replacements": {
					"{id}": {
						"type": "queryString",
						"path": "id",
					}
				}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}