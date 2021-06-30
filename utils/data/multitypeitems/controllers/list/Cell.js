import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class Cell extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.setValue("name", "");
		this.item.setValue("visible", true);
		this.item.setValue("className", "field");
		
		{
			let elementItem = this.item.group.createInternalItem();
			Wprr.utils.data.multitypeitems.controllers.element.ElementController.create(elementItem, null);
			this.item.addSingleLink("contentElement", elementItem.id);
			elementItem.addSingleLink("cell", this.item.id);
		}
		
		{
			let elementItem = this.item.group.createInternalItem();
			Wprr.utils.data.multitypeitems.controllers.element.ElementController.create(elementItem, React.createElement("div", {"className": "label-text-small"}, Wprr.text(Wprr.sourceStatic(this.item, "name"))));
			this.item.addSingleLink("titleElement", elementItem.id);
			elementItem.addSingleLink("cell", this.item.id);
		}
		
		{
			let element = React.createElement(Wprr.BaseObject, {"className": Wprr.sourceStatic(this.item, "className")},
				React.createElement(Wprr.HasData, {"check": Wprr.sourceStatic(this.item, "grid.linkedItem.showCellTitles"), "checkType": "equal", "compareValue": "line"},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceStatic(this.item, "titleElement.linkedItem.insertElement")}),
					React.createElement("div", {"className": "spacing micro"}),
				),
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceStatic(this.item, "contentElement.linkedItem.insertElement")})
			);
			
			let elementItem = this.item.group.createInternalItem();
			Wprr.utils.data.multitypeitems.controllers.element.ElementController.create(elementItem, element);
			this.item.addSingleLink("cellElement", elementItem.id);
			elementItem.addSingleLink("cell", this.item.id);
		}
		
		{
			let element = React.createElement(Wprr.BaseObject, {"className": Wprr.sourceStatic(this.item, "className")},
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceStatic(this.item, "titleElement.linkedItem.insertElement")})
			);
			let elementItem = this.item.group.createInternalItem();
			Wprr.utils.data.multitypeitems.controllers.element.ElementController.create(elementItem, element);
			this.item.addSingleLink("headerElement", elementItem.id);
			elementItem.addSingleLink("cell", this.item.id);
		}
		
		return this;
	}
	
	setupContent(aName, aElement, aVisible = true) {
		this.item.setValue("name", aName);
		this.item.setValue("visible", aVisible);
		
		this.item.getType("contentElement").linkedItem.setValue("element", aElement);
		
		return this;
	}
	
	removeTitle() {
		this.item.getType("titleElement").linkedItem.setValue("element", React.createElement(React.Fragment));
	}
	
	setupForItem(aItem) {
		aItem.addType("gridContoller", this);
		this.setup();
		
		return this;
	}
	
	toJSON() {
		return "[Cell id=" + this._id + "]";
	}
	
	static create(aItem, aName, aElement, aVisible = true) {
		let newCell = new Cell();
		newCell.setupForItem(aItem);
		newCell.setupContent(aName, aElement, aVisible);
		
		return newCell;
	}
}