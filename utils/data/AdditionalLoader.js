import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";

// import AdditionalLoader from "wprr/utils/data/AdditionalLoader";
export default class AdditionalLoader extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._items = null;
		this._queuedItems = new Array();
		this._maxNumberOfItems = 50;
		
		this._commandGroups = new Object();
		
		this._dataTypeName = "data";
		this._fieldToCheckFor = "data";
		this._url = "wprr/v1/range/any/privates,draftsIfAllowed,idSelection/default,fields,status,editObjectRelations,privateTitle?ids={ids}";
		
		this._isLoading = Wprr.sourceValue(false);
		this._startQueueBound = this._startQueue.bind(this);
	}
	
	get items() {
		return this._items;
	}
	
	get isLoading() {
		return this._isLoading.value;
	}
	
	get isLoadingSource() {
		return this._isLoading;
	}
	
	setFieldToCheckFor(aFieldName) {
		this._fieldToCheckFor = aFieldName;
		
		return this;
	}
	
	setItems(aItems) {
		this._items = aItems;
		
		return this;
	}
	
	addCommand(aCommand, aGroup) {
		if(!this._commandGroups[aGroup]) {
			this._commandGroups[aGroup] = new Array();
		}
		this._commandGroups[aGroup].push(aCommand);
		
		return this;
	}
	
	removeCommand(aCommand, aGroup) {
		let currentArray = this._commandGroups[aGroup];
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
				if(currentCommand === aCommand) {
					currentArray.splice(i, 1);
					i--;
					currentArrayLength--;
				}
			}
		}
		
		return this;
	}
	
	setUrl(aUrl) {
		this._url = aUrl;
		
		return this;
	}
	
	runCommandGroup(aGroup, aData) {
		if(this._commandGroups[aGroup]) {
			let currentArray = [].concat(this._commandGroups[aGroup]);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
			
				currentCommand.setEventData(aData);
				currentCommand.perform();
			}
		}
	}
	
	loadItem(aId) {
		this._queuedItems.push(aId);
		
		this._queueNextLoad();
	}
	
	loadItems(aIds) {
		//console.log("AdditionalLoader::loadItems");
		//console.log(aIds);
		
		if(!aIds) {
			console.error("No items added", aIds, this);
			return;
		}
		
		let oldIds = this._queuedItems;
		this._queuedItems = Wprr.utils.array.removeDuplicates(oldIds.concat(aIds));
		
		let newIds = Wprr.utils.array.removeValues(this._queuedItems, oldIds);
		{
			let currentArray = newIds;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let item = this._items.getItem(currentArray[i]);
				this.runCommandGroup("prepare", {"item": item});
			}
		}
		
		this._queueNextLoad();
	}
	
	_queueNextLoad() {
		//console.log("AdditionalLoader::_queueNextLoad");
		
		if(!this._isLoading.value && this._queuedItems.length > 0) {
			this._isLoading.value = true;
			window.requestAnimationFrame(this._startQueueBound);
		}
	}
	
	_startQueue() {
		//console.log("AdditionalLoader::_startQueue");
		
		let ids = this._queuedItems;
		this._queuedItems = new Array();
		
		ids = this._items.getIdsWithMissingType(ids, this._fieldToCheckFor);
		let numberOfIds = ids.length;
		
		if(numberOfIds === 0) {
			this._isLoading.value = false;
			return;
		}
		
		if(numberOfIds > this._maxNumberOfItems && this._maxNumberOfItems > 0) {
			this._queuedItems = ids.splice(this._maxNumberOfItems, numberOfIds-this._maxNumberOfItems);
			console.log(ids.length, this._queuedItems.join(","));
		}
		
		let url = this._url.split("{ids}").join(ids.join(","));
		
		let loader = this.project.getSharedLoader(url);
		let status = loader.getStatus();
		
		if(loader.getStatus() === 1) {
			//MENOTE: add support for other API formats
			this._updateData(loader.getData()["data"])
		}
		else {
			if(loader.getStatus() === -1 || loader.getStatus() === 3) {
				//MENOTE: do nothing
			}
			else {
				loader.addSuccessCommand(Wprr.commands.callFunction(this, this._updateData, [Wprr.source("event", "raw", "data")]));
				if(loader.getStatus() === 0) {
					loader.load();
				}
			}
		}
	}
	
	_setupItem(aData) {
		//console.log("AdditionalLoader::_setupItem");
		
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		if(this._dataTypeName) {
			if(!item.hasType(this._dataTypeName)) {
				item.addType(this._dataTypeName, aData);
			}
		}
		
		this.runCommandGroup("setup", {"item": item, "data": aData});
		
		return this;
	}
	
	_setupItems(aData) {
		//console.log("AdditionalLoader::_setupItems");
		let currentArray = aData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._setupItem(currentArray[i]);
		}
		
		return this;
	}
	
	_updateData(aData) {
		//console.log("AdditionalLoader::_updateData");
		this._setupItems(aData);
		
		this._isLoading.value = false;
		
		this.runCommandGroup("loaded", null);
		this._queueNextLoad();
		
		return this;
	}
}