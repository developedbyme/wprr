import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SingleUserRelation extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-single-user-relation");
	}
	
	_renderMainElement() {
		//console.log("SingleUserRelation::_renderMainElement");
		
		let fieldId = this.getFirstInput("fieldId", Wprr.sourceReference("column", "columnId"));
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		let editorSource = Wprr.sourceReference("editor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let editorPath = this.getFirstInput(Wprr.sourceCombine("relationEditors.userRelations.", Wprr.sourceReference("column", "settings.value.relationName")));
		
		return React.createElement("div", null,
			React.createElement("div", {className: "label-text-small"},
				React.createElement(Wprr.TranslationOrId, {id: fieldId, prefix: "site.messageGroupFields"})
			),
			React.createElement("div", {className: "spacing micro"}),
			React.createElement(Wprr.ScrollActivatedItem, {},
				React.createElement("div", {className: "content-text-small"},
					React.createElement(Wprr.RelatedItem, {id: editorPath, as: "editor"},
						React.createElement(Wprr.layout.relation.SelectSingleUserRelation, {})
					)
				)
			)
		);
	}
}