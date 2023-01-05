import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class HierarchyOrderedRelations extends Layout {
	
	_construct() {
		super._construct();
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let orderEditor = itemEditor.getHierarchyOrderEditor(orderName);
		
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
		//console.log("HierarchyOrderedRelations::_getLayout");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		let orderEditor = itemEditor.getHierarchyOrderEditor(orderName);
		
		let removeButton = <Wprr.CommandButton commands={[Wprr.commands.callFunction(this.getRelationEditor(), "endRelation", [Wprr.sourceReference("relation", "id")])]}>
			<div className="cursor-pointer">
				{React.createElement(Wprr.Image, {"className": "field-icon background-contain", "src": "icons/remove-circle.svg"})}
			</div>
		</Wprr.CommandButton>;
		
		return React.createElement("div", null,
			<Wprr.AddReference data={orderEditor} as="valueEditor">
		{React.createElement(Wprr.DraggableHierarchyOrder, {"order": Wprr.sourceReference("valueEditor", "valueSource"), "sourceUpdates": [Wprr.sourceReference("valueEditor", "valueSource")]},
				<div>
					<Wprr.AddReference data={Wprr.sourceReference("item")} as="relation">
						<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
							<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-resize,flex-no-resize">
								{aSlots.default(Wprr.text(Wprr.sourceReference("item", "id")))}
								<div>{removeButton}</div>
							</Wprr.FlexRow>
						</Wprr.RelatedItem>
					</Wprr.AddReference>
				</div>
		)}
		
			</Wprr.AddReference>
		);
	}
}
