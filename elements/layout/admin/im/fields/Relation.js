import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Relation extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let cellSettings = this.getFirstInput(Wprr.sourceReference("column", "settings"));
		let valueField = cellSettings["useSlug"] ? "slug" : "id";
		
		return React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
			React.createElement(Wprr.TermSelection, {
				valueName: "value",
				className: "standard-field standard-field-padding full-width",
				taxonomy: "dbm_relation",
				valueField: valueField,
				subtree: Wprr.sourceReference("field", "data.subtree")
			})
		);
	}
}