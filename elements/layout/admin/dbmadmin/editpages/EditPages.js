import React from "react";
import Wprr from "wprr/Wprr";

export default class EditPages extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit items"));
		
		let fields = {
			"id": {"type": "select"},
			"title": {"type": "data"},
			"permalink": {"type": "data"},
			"pageSettings": {"type": "relations", "relationPath": "incoming.for.settings/page-settings"},
			"dataSources": {"type": "relations", "relationPath": "incoming.for.settings/data-source"},
			"options": {"type": "options"}
		};
		
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return <div>
			<Wprr.AddReference data="publish" as="publishStatus">
				<Wprr.layout.items.batch.BatchEditItems postType="page" dataType="post-type/page" searchFields="data.title,data.permalink,data.id" taxonomiesToLoad="dbm_relation" title={title} fields={fields} cellTypes={areas} operationSections={operationSections} />
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/page/drafts,privates/status,default,fields,editObjectRelations",
				"replacements": {}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<Wprr.layout.form.FieldWithLabel valueName="title" label="Title" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")} />
		</Wprr.layout.admin.WpBlockEditor>
	}
}
