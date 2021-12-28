import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import ReplaceText from "./ReplaceText";
import LoadRange from "./LoadRange";

// import LoadDataRange from "./LoadDataRange";
export default class LoadDataRange extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._urlUpdatedCommand = Wprr.commands.callFunction(this, this._urlUpdated);
		
	}
	
	setup() {
		
		this.item.requireValue("url", null);
		this.item.getType("url").addChangeCommand(this._urlUpdatedCommand);
		
		this.item.requireSingleLink("loader");
		//this.item.getLinks("range");
		
		this.item.requireValue("loaded", false);
		
		this.item.getLinks("items");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("loadDataRangeController", this);
		this.setup();
		
		return this;
	}
	
	_urlUpdated() {
		console.log("LoadDataRange::_urlUpdated");
		
		let items = this.item.group;
		
		let url = this.item.getValue("url");
		if(url) {
			let loaderItem = items.getItem(url);
			
			items.prepareItem(loaderItem, "dataRangeLoader");
			this.item.addSingleLink("loader", loaderItem.id)
			
			let setupSource = loaderItem.getType("itemsSetup").addChangeCommand(Wprr.commands.callFunction(this, this._itemLoaded, [loaderItem]));
			if(setupSource.value) {
				this._itemLoaded(loaderItem);
			}
			else {
				this.item.setValue("loaded", false);
				loaderItem.getType("loader").load();
			}
		}
	}
	
	_itemLoaded(aItem) {
		console.log("LoadDataRange::_itemLoaded");
		console.log(aItem, this.item.getType("loader").linkedUrlItem, this.item);
		
		if(aItem === this.item.getType("loader").linkedUrlItem) {
			this._setupRange(aItem);
		}
	}
	
	_setupRange(aItem) {
		console.log("LoadDataRange::_setupRange");
		console.log(aItem.getLinks("range"));
		
		this.item.getLinks("items").setItems(aItem.getLinks("range").ids);
		
		this.item.setValue("loaded", true);
	}
	
	toJSON() {
		return "[LoadDataRange id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newLoadDataRange = new LoadDataRange();
		newLoadDataRange.setupForItem(aItem);
		
		return newLoadDataRange;
	}
}