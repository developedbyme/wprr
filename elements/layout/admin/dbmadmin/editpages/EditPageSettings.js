import React from "react";
import Wprr from "wprr/Wprr";

export default class EditPageSettings extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit items"));
		
		let fields = {
			"id": {"type": "select"},
			"identifier": {"type": "field"},
			"name": {"type": "field"},
			"headerType": {"type": "singleRelation", "relationPath": "incoming.for.type/header-type"},
			"heroType": {"type": "singleRelation", "relationPath": "incoming.for.type/hero-type"},
			"footerType": {"type": "singleRelation", "relationPath": "incoming.for.type/footer-type"},
			"data": {"type": "field"},
			"options": {"type": "options"}
		};
		
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return <div>
			<Wprr.AddReference data="publish" as="publishStatus">
				<Wprr.layout.items.batch.BatchEditItems dataType="settings/page-settings,settings,named-item,identifiable-item" searchFields="fieldByName.name.field.value" taxonomiesToLoad="dbm_relation" title={title} fields={fields} cellTypes={areas} operationSections={operationSections} />
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=settings/page-settings",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<Wprr.layout.form.FieldWithLabel valueName="title" label="Title" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")} />
		</Wprr.layout.admin.WpBlockEditor>
	}
}
