import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-select");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null,
			React.createElement("div", {className: "label-text-small"}),
			React.createElement(Wprr.ScrollActivatedItem, {},
				React.createElement("div", {className: "content-text-small"},
					React.createElement(Wprr.FlexRow, null,
						React.createElement(Wprr.MultipleSelectionValue, {value: Wprr.sourceReference("item", "id"), externalStorage: Wprr.sourceReference("externalStorage")},
							React.createElement(Wprr.Checkbox, {valueName: "selected"})
						),
						React.createElement("div", null,
							React.createElement("div", {className: "standard-flag standard-flag-padding id-flag"},
								Wprr.text(Wprr.sourceReference("item", "id"))
							),
							React.createElement(Wprr.HasData, {check: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "saved.status"), checkType: "equal", compareValue: "draft"},
								React.createElement("div", {className: "standard-flag standard-flag-padding status-flag draft"},
									Wprr.idText("Draft", "site.admin.draft")
								)
							)
						)
					)
				)
			)
		);
	}
}