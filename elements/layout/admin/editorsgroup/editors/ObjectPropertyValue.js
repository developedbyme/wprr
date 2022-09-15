import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class ObjectPropertyValue extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
	}
	
	_renderMainElement() {
		//console.log("ObjectPropertyValue::_renderMainElement");
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("editorsGroup"), "getItemEditor", [Wprr.sourceReference("item", "id")])} as="itemEditor">
				<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:object-property/linked-object-property" checkType="invert/arrayContains">
					<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:value-item" checkType="arrayContains">
						<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"])} as="valueEditor">
							<Wprr.JsonEditor className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
							<Wprr.layout.admin.editorsgroup.SaveValueChanges />
						</Wprr.AddReference>
					</Wprr.HasData>
					<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:file-value-item" checkType="arrayContains">
						<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"])} as="valueEditor">
							<div>File</div>
						</Wprr.AddReference>
					</Wprr.HasData>
				</Wprr.HasData>
				<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:object-property/linked-object-property" checkType="arrayContains">
					<div>
						<Wprr.layout.admin.editorsgroup.editors.SelectAnyRelation direction="outgoing" relationType="pointing-to" />
					</div>
				</Wprr.HasData>
			</Wprr.AddReference>
		);
	}
}
