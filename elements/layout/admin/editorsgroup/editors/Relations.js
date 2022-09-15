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
		console.log("Relations::_getLayout");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		console.log(this.getRelationEditor());
		
		return React.createElement("div", null,
			<Wprr.AddReference data={this.getRelationEditor()} as="relationsEditor">
				<Wprr.HasData check={Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource")} checkType="notEmpty">
					<Wprr.layout.ItemList ids={Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource")} as="relation">
						<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
							<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,fields,relations,objectTypes&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
								{aSlots.default(<div>{Wprr.text(Wprr.sourceReference("item", "title"))}</div>)}
							</Wprr.layout.loader.DataRangeLoader>
						</Wprr.RelatedItem>
					</Wprr.layout.ItemList>
				</Wprr.HasData>
				<Wprr.HasData check={Wprr.sourceReference("relationsEditor", "item.activeRelations.idsSource")} checkType="invert/notEmpty">
					{aSlots.slot("noRelations", <div />)}
				</Wprr.HasData>
			</Wprr.AddReference>
		);
	}
}
