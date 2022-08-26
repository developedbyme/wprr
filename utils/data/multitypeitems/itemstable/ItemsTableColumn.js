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
	
	setup(aColumnId, aName = null, aSettings = null) {
		this.item.setValue("columnId", aColumnId);
		this.item.setValue("name", aName);
		this.item.setValue("settings", aSettings);
		
		this.item.setValue("active", true);
		
		this.item.setValue("cellClasses", "standard-cell-width");
		
		this.item.requireValue("element", null);
		{
			let element = React.createElement(Wprr.BaseObject, {"className": Wprr.sourceCombine("cell", " ", "cell-in-column-", this.item.getValueSource("columnId"), " ", this.item.getValueSource("cellClasses")), "sourceUpdates": [this.item.getValueSource("columnId"), this.item.getValueSource("type"), this.item.getValueSource("cellClasses")]},
				React.createElement(Wprr.InsertElement, {"element": this.item.getValueSource("element")})
			);

			this.item.setValue("cellElement", element);
		}
		this.item.requireValue("headerElement", React.createElement("div", {"className": "standard-field-label"}, React.createElement(Wprr.SourcedText, {"text": Wprr.sourceReference("column", "name")})));
		{
			let element = React.createElement(Wprr.BaseObject, {"className": Wprr.sourceCombine("cell", " ", "cell-in-column-", this.item.getValueSource("columnId"), " ", this.item.getValueSource("cellClasses")), "sourceUpdates": [this.item.getValueSource("columnId"), this.item.getValueSource("type"), this.item.getValueSource("cellClasses")]},
				React.createElement(Wprr.InsertElement, {"element": this.item.getValueSource("headerElement")})
			);

			this.item.setValue("headerCellElement", element);
		}
		
		return this;
	}
	
	setCellClasses(aClasses) {
		this.item.setValue("cellClasses", aClasses);
		
		return this;
	}
	
	activate() {
		this.table.activateColumnById(this.item.getValue("columnId"));
		
		return this;
	}
	
	deactivate() {
		this.table.deactivateColumnById(this.item.getValue("columnId"));
		
		return this;
	}
	
	setElement(aElement) {
		
		this.item.setValue("element", aElement);
		
		return this;
	}
	
	setHeaderElement(aElement) {
		
		this.item.setValue("headerElement", aElement);
		
		return this;
	}
	
	toJSON() {
		return "[ItemsTableColumn id=" + this._id + "]";
	}
}