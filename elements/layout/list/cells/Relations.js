import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Relations extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-relations");
	}
	
	_renderMainElement() {
		
		let fieldId = this.getFirstInput("fieldId", Wprr.sourceReference("column", "columnId"));
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		let dataType = this.getFirstInputWithDefault("dataType", Wprr.sourceReference("column", "settings.value.dataType"), "dbm_data");
		
		let editorSource = Wprr.sourceReference("editor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let editorPath = this.getFirstInput(Wprr.sourceCombine("relationEditors.", Wprr.sourceReference("column", "settings.value.relationPath")));
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {"data": dataType, "as": "addRelation/slots/dataType"}, 
				React.createElement("div", {className: "label-text-small"},
					React.createElement(Wprr.TranslationOrId, {id: fieldId, prefix: "site.messageGroupFields"})
				),
				React.createElement("div", {className: "spacing micro"}),
				React.createElement(Wprr.ScrollActivatedItem, {},
					React.createElement("div", {className: "content-text-small"},
						React.createElement(Wprr.RelatedItem, {id: editorPath, as: "editor"},
							React.createElement(Wprr.ExternalStorageProps, {props: activatePathSource, externalStorage: externalStorageSource},
								React.createElement(Wprr.layout.relation.SelectMultipleRelations, null)
							)
						)
					)
				)
			)
		);
	}
}