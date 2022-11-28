import React from "react";
import Wprr from "wprr/Wprr";

export default class EditItems extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._editorItem = null;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let items = this.getFirstInput(Wprr.sourceReference("wprr/project", "items"));
		
		this._editorItem = items.createInternalItem();
		
		this._editorItem.getLinks("allItems");
		
		let rowsMapItem = items.createInternalItem();
		let rowsMap = new Wprr.utils.data.multitypeitems.controllers.list.MappedList.create(rowsMapItem);
		//console.log("rowsMap>>>>>>>>", rowsMap);
		this._editorItem.getLinks("allItems").idsSource.connectSource(rowsMapItem.getLinks("items").idsSource);
		
		rowsMapItem.getLinks("mappedItems").idsSource.connectSource(this._editorItem.getLinks("allRows").idsSource);
		
		let filterItem = items.createInternalItem();
		let filter = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filterItem);
		this._editorItem.addSingleLink("filter", filterItem.id);
		
		this._editorItem.getLinks("filters");
		
		let searchFields = "fromItem.linkedItem.name.value";
		//METODO: set dynamically
		
		let searchFilterPartItem = filter.addFieldSearch(searchFields);
		
		this._editorItem.addSingleLink("search", searchFilterPartItem.id);
		
		let sortItem = items.createInternalItem();
		let sort = Wprr.utils.data.multitypeitems.controllers.list.SortedList.create(sortItem);
		this._editorItem.addSingleLink("sort", sortItem.id);
		
		filterItem.getLinks("all").idsSource.connectSource(this._editorItem.getLinks("allRows").idsSource);
		sortItem.getLinks("all").idsSource.connectSource(filterItem.getLinks("filtered").idsSource);
		this._editorItem.getLinks("filteredRows").idsSource.connectSource(sortItem.getLinks("sorted").idsSource);
		
		let batchEditItem = items.createInternalItem();
		batchEditItem.addSingleLink("operation", null);
		batchEditItem.getLinks("selectedItems");
		batchEditItem.getLinks("allItems");
		batchEditItem.getLinks("allItems").idsSource.connectSource(this._editorItem.getLinks("allItems").idsSource);
		batchEditItem.getLinks("visibleItems");
		batchEditItem.getLinks("visibleItems").idsSource.connectSource(this._editorItem.getLinks("filteredItems").idsSource);
		
		this._editorItem.addSingleLink("batchEdit", batchEditItem.id);
		
		this._editorItem.requireSingleLink("settings");
	}
	
	_prepareRender() {
		super._prepareRender();
	}
	
	_setItems(aIds) {
		//console.log("_setItems");
		//console.log(aIds);
		
		//MEDEBUG
		
		this._editorItem.getLinks("allItems").addUniqueItems(aIds);
	}
	
	_renderMainElement() {
		//console.log("EditItems::_renderMainElement");
		
		
		//let editItems = this.getFirstInput("editItems", Wprr.sourceReference("editItems"));
		
		let url = this.getFirstInput(Wprr.sourceCombine("range/?select=relation,postRelation&encode=supplier,supplierImplementations,messagesInGroup&type=supplier&postRelation=event-group:", Wprr.sourceQueryString("id")));
		
		let calculations = {};
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {"data": this._editorItem.group, "as": "items"},
				React.createElement(Wprr.AddReference, {"data": this._editorItem, "as": "editor"},
		React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: url,
		  as: "editItems",
		  calculations: calculations
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  className: "supplier-list",
		  ids: Wprr.sourceReference("editor", "filteredRows.idsSource"),
		  as: "row",
		  prepareRenderCommands: Wprr.commands.callFunction(this, this._setItems, [Wprr.sourceReference("editItems", "range.ids")])
		}, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
		  id: "forItem.linkedItem",
		  from: Wprr.sourceReference("row"),
		  as: "item"
		}, /*#__PURE__*/React.createElement("div", null, "METODO"))))
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}
