import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import LoadRange from "./LoadRange";

// import LoadAdditionalItems from "./LoadAdditionalItems";
export default class LoadAdditionalItems extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._idsUpdatedCommand = Wprr.commands.callFunction(this, this._idsUpdated);
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.requireValue("url", null);
		
		this.item.requireValue("loaded", false);
		this.item.requireValue("status", 0);
		this.item.getValueSource("status").addChangeCommand(Wprr.commands.callFunction(this, this._statusChanged));
		this.item.requireValue("numberOfItemsToLoad", 200);
		
		this.item.getLinks("ids").idsSource.addChangeCommand(this._idsUpdatedCommand);
		this.item.getLinks("loadedIds");
		this.item.getLinks("loaders");
		
		return this;
	}
	
	addId(aId) {
		this.item.getLinks("ids").addUniqueItem(aId);
		
		return this;
	}
	
	addIds(aId) {
		this.item.getLinks("ids").addUniqueItems(aIds);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("controller", this);
		this.setup();
		
		return this;
	}
	
	_statusChanged() {
		this.item.setValue("loaded", this.item.getValue("status") === 1);
	}
	
	_idsUpdated() {
		//console.log("LoadAdditionalItems::_idsUpdated");
		
		if(this.item.getValue("status") === 0 || this.item.getValue("status") === 1) {
			this._loadNextBatch();
		}
	}
	
	_loadNextBatch() {
		//console.log("_loadNextBatch");
		
		let idsToLoad = this.item.getLinks("ids").ids;
		let loadedIds = this.item.getLinks("loadedIds").ids;
		
		let remainingIdsToLoad = Wprr.utils.array.removeValues(idsToLoad, loadedIds);
		
		if(remainingIdsToLoad.length > 0) {
			let numberOfItemsToLoad = this.item.getValue("numberOfItemsToLoad");
			if(remainingIdsToLoad.length > numberOfItemsToLoad) {
				remainingIdsToLoad = Wprr.utils.array.getPartOfArray(remainingIdsToLoad, 0, numberOfItemsToLoad);
			}
			
			let url = this.item.getValue("url").split("{ids}").join(remainingIdsToLoad.join(","));
			
			let loaderItem = this.item.group.createInternalItem();
			let loader = Wprr.utils.data.nodes.LoadDataRange.create(loaderItem);
			
			this.item.setValue("status", 2);
			loaderItem.getValueSource("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._partLoaded, [remainingIdsToLoad]));
			this.item.getLinks("loaders").addItem(loaderItem.id);
			
			loader.setUrl(url);
		}
		else {
			this.item.setValue("status", 1);
		}
	}
	
	_partLoaded(aIds) {
		//console.log("_partLoaded");
		//console.log(aIds);
		
		this.item.getLinks("loadedIds").addUniqueItems(aIds);
		
		this._loadNextBatch();
	}
	
	toJSON() {
		return "[LoadAdditionalItems id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newLoadAdditionalItems = new LoadAdditionalItems();
		newLoadAdditionalItems.setupForItem(aItem);
		
		return newLoadAdditionalItems;
	}
}