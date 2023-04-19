import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class Relations extends Layout {
	
	_construct() {
		super._construct();
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("Relations::_getLayout");
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {data: this.getRelationEditor(), as: "relationsEditor"},
				React.createElement(Wprr.HasData, {check: Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource"), checkType: "notEmpty"},
					React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource"), as: "relation", "className": aSlots.prop("listClasses", "")},
						React.createElement(Wprr.RelatedItem, {id: relationName, from: Wprr.sourceReference("relation")},
							React.createElement(Wprr.layout.loader.DataRangeLoader, {path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,fields,relations,objectTypes&ids=", Wprr.sourceReference("item", "id")), as: "itemLoader"},
								aSlots.default(React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "title"))))
							)
						)
					)
				),
				React.createElement(Wprr.HasData, {check: Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource"), checkType: "invert/notEmpty"},
					aSlots.slot("noRelations", React.createElement("div", null))
				)
			)
		);
	}
}
