import React from "react";
import Wprr from "wprr/Wprr";

export default class EditNumberSequences extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit items"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"prefix": {"type": "field"},
			"suffix": {"type": "field"},
			"padding": {"type": "field"},
			"currentSequenceNumber": {"type": "data"},
			"options": {"type": "options"}
		};
		
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return <div>
			<Wprr.AddReference data="private" as="publishStatus">
				<Wprr.layout.items.batch.BatchEditItems dataType="number-sequence,named-item" taxonomiesToLoad="dbm_relation" title={title} fields={fields} cellTypes={areas} operationSections={operationSections} />
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations,currentSequenceNumber?type=number-sequence",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<Wprr.layout.form.FieldWithLabel valueName="title" label="Title" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")} />
		</Wprr.layout.admin.WpBlockEditor>
	}
}
