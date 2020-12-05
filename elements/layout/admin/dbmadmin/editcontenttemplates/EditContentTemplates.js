import React from "react";
import Wprr from "wprr/Wprr";

export default class EditContentTemplates extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit content templates"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"title": {"type": "field"},
			"content": {"type": "field", "fieldType": "richText"},
			"type": {"type": "field"},
			"availableAt": {"type": "relations", "relationPath": "outgoing.available-at.template-position"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return <div>
			<Wprr.AddReference data="private" as="publishStatus">
				<Wprr.layout.items.batch.BatchEditItems dataType="content-template" namesToLoad="template-position" taxonomiesToLoad="dbm_relation" title={title} fields={fields} cellTypes={areas} />
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=content-template",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<Wprr.layout.form.FieldWithLabel valueName="title" label="Title" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")} />
		</Wprr.layout.admin.WpBlockEditor>
	}
}
