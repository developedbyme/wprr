"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

export default class EditRelation extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement("div", {className: "centered-site"},
			React.createElement(Wprr.layout.items.EditItem, {item: Wprr.sourceReference("item")},
				React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items"},
					React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("item", "data.from.id"))},
						React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "data.from.title")))
	),
					React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "data.type.name"))),
					
						React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("item", "data.to.id"))},
							React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "data.to.title")))
						)
				),
				React.createElement("div", {className: "spacing standard"}),
				React.createElement(Wprr.FlexRow, {className: "small-item-spacing halfs"},
					React.createElement(Wprr.SelectField, {fieldName: "startAt"},
						React.createElement(Wprr.layout.form.LabelledArea, null,
							React.createElement(Wprr.layout.admin.im.FieldName, {"data-slot": "labelContent"}),
							React.createElement(Wprr.layout.admin.im.Field, null)
						)
					),
					React.createElement(Wprr.SelectField, {fieldName: "endAt"},
						React.createElement(Wprr.layout.form.LabelledArea, null,
							React.createElement(Wprr.layout.admin.im.FieldName, {"data-slot": "labelContent"}),
							React.createElement(Wprr.layout.admin.im.Field, null)
						)
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"item": {
				"value": "wprr/v1/range-item/dbm_object_relation/drafts,privates,idSelection/status,fields,relationLink,relationType?ids={id}",
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