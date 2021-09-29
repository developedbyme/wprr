import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import ReplaceText from "./ReplaceText";
import LoadRange from "./LoadRange";

// import PartOfRange from "./PartOfRange";
export default class PartOfRange extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this.replaceText = new ReplaceText();
		this._updateFilterCommand = Wprr.commands.callFunction(this, this._updateFilter);
		this._addLoadedItemsCommand = Wprr.commands.callFunction(this, this._addLoadedItems);
		this._updateAdditionalLoadersCommand = Wprr.commands.callFunction(this, this._updateAdditionalLoaders);
		this._updateStatusCommand = Wprr.commands.callFunction(this, this._updateStatus);
	}
	
	setup() {
		
		this.item.setValue("loaded", false);
		this.item.getLinks("all").idsSource.addChangeCommand(this._updateFilterCommand);
		
		let items = this.item.group;
		
		let filteredListItem = items.createInternalItem();
		let filter = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filteredListItem);
		this.item.addSingleLink("filter", filteredListItem.id);
		this.item.getLinks("all").idsSource.connectSource(filteredListItem.getType("all").idsSource);
		
		let loadRangeItem = items.createInternalItem();
		let loadRange = Wprr.utils.data.nodes.LoadRange.create(loadRangeItem);
		this.item.addSingleLink("loadRange", loadRangeItem.id);
		this.replaceText.sources.get("replacedText").connectSource(loadRangeItem.getType("url"));
		
		loadRangeItem.getLinks("loadedItems").idsSource.addChangeCommand(this._addLoadedItemsCommand).addChangeCommand(this._updateStatusCommand);
		
		this.item.getLinks("filtered").idsSource.connectSource(filteredListItem.getType("filtered").idsSource);
		
		this.item.getLinks("additionalLoaders").idsSource.addChangeCommand(this._updateAdditionalLoadersCommand).addChangeCommand(this._updateStatusCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("partOfRangeController", this);
		this.setup();
		
		return this;
	}
	
	addAdditionalLoaderById(aId) {
		this.item.getLinks("additionalLoaders").addUniqueItem(aId);
		
		return this;
	}
	
	_updateAdditionalLoaders() {
		console.log("_updateAdditionalLoaders");
		
		let additionalLoaders = Wprr.objectPath(this.item.getLinks("additionalLoaders"), "items.(every).loader");
		let currentArray = additionalLoaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentAdditionalLoader = currentArray[i];
			currentAdditionalLoader.addCommand(this._updateFilterCommand, "loaded");
			currentAdditionalLoader.addCommand(this._updateStatusCommand, "loaded");
		}
	}
	
	_addLoadedItems() {
		console.log("_addLoadedItems");
		
		let ids = Wprr.objectPath(this.item, "loadRange.linkedItem").getLinks("loadedItems").ids;
		
		let additionalLoaders = Wprr.objectPath(this.item.getLinks("additionalLoaders"), "items.(every).loader");
		let currentArray = additionalLoaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentAdditionalLoader = currentArray[i];
			currentAdditionalLoader.loadItems(ids);
		}
		
		this.item.getLinks("all").addUniqueItems(ids);
	}
	
	_updateFilter() {
		console.log("_updateFilter");
		
		Wprr.objectPath(this.item, "filter.linkedItem.filteredListController").updateFilter();
		
		console.log(this.item.getLinks("all"), this.item.getLinks("filtered"));
	}
	
	_updateStatus() {
		console.log("_updateStatus");
		
		let loadRangeItem = Wprr.objectPath(this.item, "loadRange.linkedItem");
		let isLoaded = loadRangeItem.getValue("loaded");
		let ids = loadRangeItem.getLinks("loadedItems").ids;
		
		if(isLoaded) {
			let additionalLoaders = Wprr.objectPath(this.item.getLinks("additionalLoaders"), "items.(every).loader");
			let currentArray = additionalLoaders;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentAdditionalLoader = currentArray[i];
				if(!currentAdditionalLoader.hasLoadedItems(ids)) {
					isLoaded = false;
					break;
				}
			}
		}
		
		this.item.setValue("loaded", isLoaded);
		console.log(isLoaded);
	}
	
	toJSON() {
		return "[PartOfRange id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newPartOfRange = new PartOfRange();
		newPartOfRange.setupForItem(aItem);
		
		return newPartOfRange;
	}
}