import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemsTableColumn extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	get table() {
		return this.item.getType("table").linkedItem.getType("table");
	}
	
	setTableId(aId) {
		this.item.addSingleLink("table", aId);
		
		return this;
	}
	
	setup(aColumnId, aType, aSettings = null) {
		this.item.addType("columnId", aColumnId);
		this.item.addType("type", aType);
		this.item.addType("settings", aSettings);
		this.item.addType("active", true);
		
		return this;
	}
	
	activate() {
		this.table._internalLink_activateColumn(this);
		this._internalLink_activate();
		
		return this;
	}
	
	_internalLink_activate() {
		this.item.addType("active", true);
		//METODO: this should be an update to not have warnings
	}
	
	createElement(aCellTypes, aDefaultType = "standard") {
		
		let columnId = this.item.getType("columnId");
		let type = this.item.getType("type");
		
		let cellElement;
		if(aCellTypes[type]) {
			cellElement = React.createElement(aCellTypes[type], {"className": "field-" + columnId + " wanted-field-type-" + type});
		}
		else if(aCellTypes[aDefaultType]) {
			cellElement = React.createElement(aCellTypes[aDefaultType], {"className": "field-" + columnId + " wanted-field-type-" + type});
		}
		else {
			console.error("No field type named " + type + " and no default type " + aDefaultType);
			cellElement = React.createElement("div", {"className": "field-" + columnId + "field-not-found wanted-field-type-" + type});
		}
		
		let element = React.createElement(Wprr.SelectItem, {"key": this.item.getType("columnId"), "id": this.item.id, "as": "column"},
			React.createElement(Wprr.ReferenceInjection, {"injectData": {"cellId": Wprr.sourceReference("column", "columnId"), "cellSettings": Wprr.sourceReference("column", "settings")}},
				cellElement
			)
		);
		
		this.item.addType("element", element);
		
		return this;
	}
	
	setElement(aElement) {
		let columnId = this.item.getType("columnId");
		
		let element = React.createElement(Wprr.SelectItem, {"key": this.item.getType("columnId"), "id": this.item.id, "as": "column"},
			React.createElement(Wprr.ReferenceInjection, {"injectData": {"cellId": Wprr.sourceReference("column", "columnId"), "cellSettings": Wprr.sourceReference("column", "settings")}},
				aElement
			)
		);

		this.item.addType("element", element);
		
		return this;
	}
	
	toJSON() {
		return "[ItemsTableColumn id=" + this._id + "]";
	}
}