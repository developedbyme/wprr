import React from "react";
import Wprr from "wprr/Wprr";

export default class EditContentTemplate extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName('centered-site');
	}
	
	_renderMainElement() {
		
		return <div>
			<Wprr.layout.items.EditItem item={Wprr.sourceReference("item")}>
				<Wprr.SelectField fieldName="name">
					<h2 className="no-margins extra-small-label extra-small-label-padding">
						<Wprr.layout.admin.im.FieldName />
					</h2>
					<Wprr.layout.admin.im.Field />
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="title">
					<h2 className="no-margins extra-small-label extra-small-label-padding">
						<Wprr.layout.admin.im.FieldName />
					</h2>
					<Wprr.layout.admin.im.Field />
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="content">
					<h2 className="no-margins extra-small-label extra-small-label-padding">
						<Wprr.layout.admin.im.FieldName />
					</h2>
					<Wprr.layout.admin.im.Field type="richText" />
				</Wprr.SelectField>
			</Wprr.layout.items.EditItem>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"item": {
				"value": "wprr/v1/range-item/dbm_data/drafts,privates,idSelection/status,fields,editObjectRelations?ids={id}",
				"replacements": {
					"{id}": {
						"type": "queryString",
						"path": "id",
					}
				}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>
				
			</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}
