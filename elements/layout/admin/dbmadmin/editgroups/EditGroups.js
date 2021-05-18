import React from "react";
import Wprr from "wprr";

export default class EditGroups extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit groups"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		
		return <div>
			<Wprr.layout.items.batch.BatchEditItems title={title} projectName={Wprr.sourceReference("wprr/projectName")} dataType="group,named-item" fields={fields} cellTypes={areas} operationSections={operationSections} />
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=group",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>Settings</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}
