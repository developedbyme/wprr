import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class ObjectProperties extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		let table = this._elementTreeItem.addNode("table", new Wprr.utils.data.multitypeitems.itemstable.ItemsTable());
		
		this._elementTreeItem.getLinks("creatingRows");
		
		{
			let column = table.createColumn("identifier", "Identifier");
			column.setElement(<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["identifier"])} as="valueEditor">
				<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>);
		}
		
		{
			let column = table.createColumn("data", "Data");
			column.setElement(<div>
				<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:object-property/linked-object-property" checkType="invert/arrayContains">
					<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"])} as="valueEditor">
						<Wprr.JsonEditor className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
						<Wprr.layout.admin.editorsgroup.SaveValueChanges />
					</Wprr.AddReference>
				</Wprr.HasData>
				<Wprr.HasData check={Wprr.sourceReference("item", "terms.idsSource")} compareValue="dbm_type:object-property/linked-object-property" checkType="arrayContains">
					<div>
						<Wprr.layout.admin.editorsgroup.editors.SelectAnyRelation direction="outgoing" relationType="pointing-to" />
					</div>
				</Wprr.HasData>
			</div>);
		}
	}
	
	_addLinkedObjectProperty() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let itemId = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		creator.setTitle("Object property for " + itemId);
		
		creator.setDataType("object-property");
		creator.addType("object-property/linked-object-property");
		creator.addType("identifiable-item");
		
		creator.addOutgoingRelation(itemId, "for", false);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", "draft"));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdItem.id")]));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdRelations.relation0.id")]));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this._elementTreeItem.getLinks("creatingRows"), "removeItem", [creator.item.id]));
		this._elementTreeItem.getLinks("creatingRows").addItem(creator.item.id);
		
		creator.create();
	}
	
	_addValueObjectProperty() {
		console.log("_addValueObjectProperty");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let itemId = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		creator.setTitle("Object property for " + itemId);
		
		creator.setDataType("object-property");
		creator.addType("value-item");
		creator.addType("identifiable-item");
		
		creator.addOutgoingRelation(itemId, "for", false);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", "draft"));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdItem.id")]));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdRelations.relation0.id")]));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this._elementTreeItem.getLinks("creatingRows"), "removeItem", [creator.item.id]));
		this._elementTreeItem.getLinks("creatingRows").addItem(creator.item.id);
		
		creator.create();
	}
	
	_makePrivate(aId) {
		console.log("_makePrivate");
		
		//newItem.setValue("postStatus", "draft");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		editorsGroup.getItemEditor(aId).getPostStatusEditor().item.setValue("value", "private");
	}
	
	_renderMainElement() {
		//console.log("ObjectProperties::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceStatic(this._elementTreeItem, "table.linkedItem")} as="table">
				<Wprr.AddReference data={Wprr.sourceFunction(itemEditor, "getRelationEditor", ["incoming", "for", "object-property"])} as="valueEditor">
					<div>
						<Wprr.InsertElement element={Wprr.sourceReference("table", "headerRowElement")} />
						<Wprr.layout.ItemList ids={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} as="relation">
							<Wprr.RelatedItem id="from.linkedItem" from={Wprr.sourceReference("relation")}>
								<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations,postTerms&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
									<Wprr.AddReference data={Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")])} as="itemEditor">
										<Wprr.InsertElement element={Wprr.sourceReference("table", "rowElement")} />
									</Wprr.AddReference>
								</Wprr.layout.loader.DataRangeLoader>
							</Wprr.RelatedItem>
							<div className="spacing micro" data-slot="spacing" />
						</Wprr.layout.ItemList>
						<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("creatingRows").idsSource} as="loader">
							<Wprr.layout.loader.LoaderDisplay text={Wprr.sourceTranslation("Creating...", "site.creating")} />
						</Wprr.layout.ItemList>
						<Wprr.layout.admin.editorsgroup.SaveValueChanges />
						<div className="spacing small" />
						<Wprr.FlexRow>
							<Wprr.layout.interaction.Button text={Wprr.sourceTranslation("Add value", "site.addValueObjectProperty")} commands={Wprr.commands.callFunction(this, this._addValueObjectProperty)} className="add-button add-button-padding  cursor-pointer" />
							<Wprr.layout.interaction.Button text={Wprr.sourceTranslation("Add link", "site.addLinkedObjectProperty")} commands={Wprr.commands.callFunction(this, this._addLinkedObjectProperty)} className="add-button add-button-padding  cursor-pointer" />
						</Wprr.FlexRow>
					</div>
				</Wprr.AddReference>
			</Wprr.AddReference>
		);
	}
}
