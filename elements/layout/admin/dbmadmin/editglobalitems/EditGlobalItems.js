import React from "react";
import Wprr from "wprr";

export default class EditGlobalItems extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit global items"));
		
		let fields = {
			"id": {"type": "select"},
			"identifier": {"type": "field"},
			"pointingTo": {"type": "relationOfAnyType", "relationPath": "outgoing.pointing-to.any"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return <div>
			<Wprr.layout.items.batch.BatchEditItems title={title} projectName={Wprr.sourceReference("wprr/projectName")} dataType="global-item" fields={fields} cellTypes={areas} />
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=global-item",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>Settings</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}
