import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import SourceInput from "./SourceInput";

// import GetItemProperty from "./GetItemProperty";
export default class GetItemProperty extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._itemChangedCommand = Wprr.commands.callFunction(this, this._itemChanged);
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.getValueSource("propertyPath").addChangeCommand(this._itemChangedCommand);
		this.item.requireSingleLink("fromItem");
		this.item.getType("fromItem").idSource.addChangeCommand(this._itemChangedCommand);
		this.item.requireValue("value");
		
		this._sourceInput = new SourceInput();
		this.item.getValueSource("value").input(this._sourceInput.sources.get("value"));
		
		return this;
	}
	
	
	
	setupForItem(aItem) {
		this.setItemConnection(aItem);
		this.setup();
		
		return this;
	}
	
	setFromItem(aItem) {
		this.item.addSingleLink("fromItem", aItem);
		
		return this;
	}
	
	setPropertyPath(aValue) {
		
		this.item.setValue("propertyPath", aValue);
		
		return this;
	}
	
	_itemChanged() {
		//console.log("GetItemProperty::_itemChanged");
		//console.log(this);
		
		let item = Wprr.objectPath(this.item, "fromItem.linkedItem");
		let propertyPath = this.item.getValue("propertyPath");
		if(propertyPath) {
			let property = Wprr.objectPath(item, propertyPath);
			this._sourceInput.setValue(property);
		}
		
	}
	
	toJSON() {
		return "[GetItemProperty id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newGetItemProperty = new GetItemProperty();
		newGetItemProperty.setupForItem(aItem);
		
		return newGetItemProperty;
	}
}