import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SelectAnyRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		//console.log("SelectAnyRelation::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "outgoing");
		let type = this.getFirstInputWithDefault("relationType", "pointing-to");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, type, "*"])} as="valueEditor">
				<div>
					{Wprr.text(Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"))}
					Select
					<Wprr.layout.admin.editorsgroup.SaveValueChanges />
				</div>
			</Wprr.AddReference>
		);
	}
}
