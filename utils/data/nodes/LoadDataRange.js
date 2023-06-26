import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import LoadRange from "./LoadRange";

// import LoadDataRange from "./LoadDataRange";
export default class LoadDataRange extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._urlUpdatedCommand = Wprr.commands.callFunction(this, this._urlUpdated);
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.requireValue("url", null);
		this.item.getType("url").addChangeCommand(this._urlUpdatedCommand);
		
		this.item.requireSingleLink("loader");
		
		this.item.requireValue("loaded", false);
		
		this.item.requireSingleLink("singleItem");
		this.item.getLinks("items");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("loadDataRangeController", this);
		this.setup();
		
		return this;
	}
	
	setUrl(aUrl) {
		this.item.getType("url").input(aUrl);
		
		return this;
	}
	
	_urlUpdated() {
		//console.log("LoadDataRange::_urlUpdated");
		
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
				//loaderItem.getType("loader").load();
				if(this.item.hasType("loadingSequence") && this.item.getType("loadingSequence")) {
					let loadingSequence = this.item.getType("loadingSequence");
					loadingSequence.addUniqueLoader(loaderItem.getType("loader"));
				}
				else {
					let sharedLoadingSequence = Wprr.objectPath(this.item.group, "project.sharedLoadingSequence");
					sharedLoadingSequence.addUniqueLoader(loaderItem.getType("loader"));
				}
				
			}
		}
	}
	
	_itemLoaded(aItem) {
		//console.log("LoadDataRange::_itemLoaded");
		//console.log(aItem, this.item.getType("loader").linkedUrlItem, this.item);
		
		if(aItem === this.item.getType("loader").linkedUrlItem) {
			this._setupRange(aItem);
		}
	}
	
	_setupRange(aItem) {
		//console.log("LoadDataRange::_setupRange");
		//console.log(aItem.getLinks("range"));
		
		let ids = aItem.getLinks("range").ids;
		this.item.getLinks("items").setItems(ids);
		
		let singleId = 0;
		if(ids.length > 0) {
			singleId = ids[0];
		}
		
		this.item.addSingleLink("singleItem", singleId);
		
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