import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class OptionsFromItems extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updatedCommand = Wprr.commands.callFunction(this, this._itemsUpdated, [Wprr.sourceEvent()]);
		
	}
	
	setItems(aItems) {
		this.item.getLinks("items").input(aItems);
		
		return this;
	}
	
	setup() {
		
		this.item.getLinks("items").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._itemsUpdated, [Wprr.sourceEvent()]));
		this.item.requireValue("valueField", "id");
		this.item.requireValue("labelField", "name");
		this.item.requireValue("descriptionField", null);
		this.item.requireValue("sort", false);
		this.item.requireValue("options", []);
		this.item.addType("controller", this);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("controller", this);
		this.setup();
		
		return this;
	}
	
	_itemsUpdated() {
		console.log("_itemsUpdated");
		
		let items = this.item.getLinks("items").items;
		
		let options = Wprr.utils.KeyValueGenerator.convertArrayToOptions(items, this.item.getValue("valueField"), this.item.getValue("labelField"), this.item.getValue("descriptionField"), this.item.getValue("sort"));
		
		this.item.setValue("options", options);
	}
	
	toJSON() {
		return "[OptionsFromItems id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newOptionsFromItems = new OptionsFromItems();
		newOptionsFromItems.setupForItem(aItem);
		
		return newOptionsFromItems;
	}
}