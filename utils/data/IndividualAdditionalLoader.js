import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";

// import IndividualAdditionalLoader from "wprr/utils/data/IndividualAdditionalLoader";
export default class IndividualAdditionalLoader extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._items = null;
		this._queuedItems = new Array();
		this._loadingSequence = new Wprr.utils.LoadingSequence();
		this._loadingSequence.addCommand("loaded", Wprr.commands.callFunction(this, this._updateData, []));
		
		this._commandGroups = new Object();
		
		this._dataTypeName = "data";
		this._fieldToCheckFor = "data";
		this._url = "wprr/v1/range/any/privates,draftsIfAllowed,idSelection/default,fields,status,editObjectRelations,privateTitle?ids={id}";
		
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
		//console.log("IndividualAdditionalLoader::loadItems");
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
	
	hasLoadedItems(aIds) {
		let remainingIds = this._items.getIdsWithMissingType(aIds, this._fieldToCheckFor);
		
		return (remainingIds.length === 0);
	}
	
	_queueNextLoad() {
		//console.log("IndividualAdditionalLoader::_queueNextLoad");
		
		if(!this._isLoading.value && this._queuedItems.length > 0) {
			this._isLoading.value = true;
			window.requestAnimationFrame(this._startQueueBound);
		}
	}
	
	_startQueue() {
		//console.log("IndividualAdditionalLoader::_startQueue");
		
		let ids = this._queuedItems;
		this._queuedItems = new Array();
		
		ids = this._items.getIdsWithMissingType(ids, this._fieldToCheckFor);
		let numberOfIds = ids.length;
		
		if(numberOfIds === 0) {
			this._isLoading.value = false;
			return;
		}
		
		let currentArray = ids;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let id = currentArray[i];
			
			let url = this._url.split("{id}").join(id);
		
			let loader = this.project.getSharedLoader(url);
			let status = loader.getStatus();
			
			if(loader.getStatus() === 1) {
				//MENOTE: add support for other API formats
				//console.log("status1>>>>>>>", id, loader.getData());
				this._setupItem(id, loader.getData()["data"]);
			}
			else {
				if(loader.getStatus() === -1 || loader.getStatus() === 3) {
					//MENOTE: do nothing
				}
				else {
					loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setupItem, [id, Wprr.source("event", "raw", "data")]));
					this._loadingSequence.addLoader(loader);
				}
			}
		}
		
		
		this._loadingSequence.load();
	}
	
	_setupItem(aId, aData) {
		//console.log("IndividualAdditionalLoader::_setupItem");
		//console.log(aId, aData);
		
		let currentId = aId;
		let item = this._items.getItem(currentId);
		
		this.runCommandGroup("setup", {"item": item, "data": aData});
		
		return this;
	}
	
	_updateData() {
		//console.log("IndividualAdditionalLoader::_updateData");
		
		this._isLoading.value = false;
		
		this.runCommandGroup("loaded", null);
		this._queueNextLoad();
		
		return this;
	}
}