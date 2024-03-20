import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import GetItemBy from "./GetItemBy";
export default class GetItemBy extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._itemChangedCommand = Wprr.commands.callFunction(this, this._itemChanged);
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		
		this.item.requireValue("operation", "==");
		this.item.getValueSource("operation").addChangeCommand(this._itemChangedCommand);
		this.item.getValueSource("value").addChangeCommand(this._itemChangedCommand);
		this.item.getValueSource("propertyPath").addChangeCommand(this._itemChangedCommand);
		this.item.getLinks("items").idsSource.addChangeCommand(this._itemChangedCommand);
		this.item.requireSingleLink("item");
		
		return this;
	}
	
	
	
	setupForItem(aItem) {
		this.setItemConnection(aItem);
		this.setup();
		
		return this;
	}
	
	setPropertyPath(aValue) {
		
		this.item.setValue("propertyPath", aValue);
		
		return this;
	}
	
	_itemChanged() {
		//console.log("GetItemBy::_itemChanged");
		//console.log(this);
		
		let item = Wprr.utils.array.getItemBy(this.item.getValue("propertyPath"), this.item.getValue("value"), this.item.getLinks("items").items, this.item.getValue("operation"));
		
		if(item) {
			this.item.addSingleLink("item", item.id);
		}
		else {
			this.item.addSingleLink("item", 0);
		}
		
	}
	
	toJSON() {
		return "[GetItemBy id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newGetItemBy = new GetItemBy();
		newGetItemBy.setupForItem(aItem);
		
		return newGetItemBy;
	}
}