import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class ObjectPropertiesOfType extends Layout {
	
	_construct() {
		super._construct();
		
		let relationEditor = this.getRelationEditor();
		
		let mappedList = this._elementTreeItem.addNode("mappedList", new Wprr.utils.data.multitypeitems.controllers.list.MappedList()).setItems(this._elementTreeItem.getLinks("activeRelations"));
		
		mappedList.setupCommands.addCommands.push(Wprr.commands.callFunction(this, this._rowAdded, [Wprr.sourceEvent()]));
		mappedList.setupCommands.removeCommands.push(Wprr.commands.callFunction(this, this._rowRemoved, [Wprr.sourceEvent()]));
		
		this._elementTreeItem.getLinks("rows").input(mappedList.item.getLinks("mappedItems"));
		
		let identifier = this.getFirstInput("identifier");
		
		let filter = this._elementTreeItem.addNode("filter", new Wprr.utils.data.multitypeitems.controllers.list.FilteredList());
		filter.addFieldCompare("loaded.value", true);
		filter.addFieldCompare("item.linkedItem.fields.identifier.value.value", identifier);
		
		filter.item.getLinks("all").input(this._elementTreeItem.getLinks("rows"));
		
		this._elementTreeItem.getLinks("filteredRows").input(filter.item.getLinks("filtered"));
		
		let detailsLoader = this._elementTreeItem.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,fields,relations,objectTypes&ids={ids}", "wprrData"));
		
		this._elementTreeItem.getLinks("activeRelations").input(relationEditor.item.getLinks("activeRelations").idsSource);
		
	}
	
	_rowAdded(aId) {
		//console.log("_rowAdded");
		//console.log(aId);
		
		let row = this._elementTreeItem.group.getItem(aId);
		
		let item = Wprr.objectPath(row, "forItem.linkedItem.from.linkedItem");
		
		let detailsLoader = Wprr.objectPath(this._elementTreeItem, "detailsLoader.linkedItem.controller");
		let filter = Wprr.objectPath(this._elementTreeItem, "filter.linkedItem.controller");
		
		row.addSingleLink("item", item.id);
		row.requireValue("loaded", false);
		row.getValueSource("loaded").addChangeCommand(Wprr.commands.callFunction(filter, filter.updateFilter));
		
		let inArrayCondition = Wprr.utils.data.nodes.InArrayCondition.connect(detailsLoader.item.getLinks("loadedIds").idsSource, row.getValueSource("loaded"), item.id);
		row.addType("inArrayCondition", inArrayCondition);
		
		detailsLoader.addId(item.id);
	}
	
	_rowRemoved(aId) {
		//console.log("_rowRemoved");
		//console.log(aId);
		
		//METODO: remove change command and inArrayCondition
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		return itemEditor.getRelationEditor("incoming", "for", "object-property");
	}
	
	_getLayout(aSlots) {
		//console.log("ObjectPropertiesOfType::_getLayout");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let relationName = "from.linkedItem";
		
		return React.createElement("div", null,
			<Wprr.AddReference data={this.getRelationEditor()} as="relationsEditor">
				<Wprr.HasData check={this._elementTreeItem.getLinks("filteredRows").idsSource} checkType="notEmpty">
					<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("filteredRows").idsSource} as="row">
						<Wprr.RelatedItem id="forItem.linkedItem" from={Wprr.sourceReference("row")} as="relation">
							<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
								{aSlots.default(<div>{Wprr.text(Wprr.sourceReference("item", "title"))}</div>)}
							</Wprr.RelatedItem>
						</Wprr.RelatedItem>
					</Wprr.layout.ItemList>
				</Wprr.HasData>
				<Wprr.HasData check={this._elementTreeItem.getLinks("filteredRows").idsSource} checkType="invert/notEmpty">
					{aSlots.slot("noRelations", <div />)}
				</Wprr.HasData>
			</Wprr.AddReference>
		);
	}
}
