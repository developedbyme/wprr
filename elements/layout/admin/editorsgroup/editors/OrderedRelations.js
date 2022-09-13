import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class OrderedRelations extends Layout {
	
	_construct() {
		super._construct();
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let orderEditor = itemEditor.getOrderEditor(orderName);
		
		let activeIdsSource = this.getRelationEditor().item.getLinks("activeRelations").idsSource;
		orderEditor.updateForActiveRelations(activeIdsSource.value);
		activeIdsSource.addChangeCommand(Wprr.commands.callFunction(orderEditor, "updateForActiveRelations", [activeIdsSource]));
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("OrderedRelations::_getLayout");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		let orderEditor = itemEditor.getOrderEditor(orderName);
		
		let removeButton = <Wprr.CommandButton commands={Wprr.commands.callFunction(this.getRelationEditor(), "endRelation", [Wprr.sourceReference("relation", "id")])}>
			<div className="cursor-pointer">
				{React.createElement(Wprr.Image, {"className": "field-icon background-contain", "src": "icons/remove-circle.svg"})}
			</div>
		</Wprr.CommandButton>;
		
		return React.createElement("div", null,
			<Wprr.AddReference data={orderEditor} as="valueEditor">
				<Wprr.layout.ItemList ids={Wprr.sourceReference("valueEditor", "valueSource")} as="relation">
					{React.createElement(Wprr.DraggableOrder, {"data-slot": "insertElements", "order": Wprr.sourceReference("valueEditor", "valueSource"), "dragParent": false, "sourceUpdates": [Wprr.sourceReference("valueEditor", "valueSource")]})}
					{React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
						React.createElement("div", {"draggable": "true"},
							React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "icons/change-order.svg"})
						),
						<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
							<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
								{aSlots.default(<div>{Wprr.text(Wprr.sourceReference("item", "title"))}</div>)}
							</Wprr.layout.loader.DataRangeLoader>
						</Wprr.RelatedItem>,
						aSlots.slot("removeButton", removeButton)
					)}
				</Wprr.layout.ItemList>
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>
		);
	}
}
