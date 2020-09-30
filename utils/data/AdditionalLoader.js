import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";

// import AdditionalLoader from "wprr/utils/data/AdditionalLoader";
export default class AdditionalLoader extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._items = null;
		this._queuedItems = new Array();
		
		this._commandGroups = new Object();
		
		this._dataTypeName = "data";
		this._url = "wprr/v1/range/any/privates,drafts,idSelection/default,fields,status,editObjectRelations,privateTitle?ids={ids}";
		
		this._isLoading = false;
		this._startQueueBound = this._startQueue.bind(this);
	}
	
	
	get items() {
		return this._items;
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
	
	loadItems(aIds) {
		console.log("AdditionalLoader::loadItems");
		console.log(aIds);
		
		this._queuedItems = this._queuedItems.concat(aIds);
		this._queueNextLoad();
	}
	
	_queueNextLoad() {
		console.log("AdditionalLoader::_queueNextLoad");
		
		if(!this._isLoading && this._queuedItems.length > 0) {
			this._isLoading = true;
			window.requestAnimationFrame(this._startQueueBound);
		}
	}
	
	_startQueue() {
		console.log("AdditionalLoader::_startQueue");
		
		let ids = this._queuedItems;
		this._queuedItems = new Array();
		
		ids = this._items.getIdsWithMissingType(ids, "data");
		
		if(ids.length === 0) {
			this._isLoading = false;
			return;
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
		console.log("AdditionalLoader::_setupItem");
		
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		if(this._dataTypeName) {
			if(!item.hasType(this._dataTypeName)) {
				item.addType(this._dataTypeName, aData);
			}
		}
		console.log(item, aData);
		
		this.runCommandGroup("setup", {"item": item, "data": aData});
		
		if(this._setupCommands) {
			Wprr.utils.CommandPerformer.perform(this._setupCommands, {"item": item, "data": aData}, this);
		}
		
		return this;
	}
	
	_setupItems(aData) {
		//console.log("AdditionalLoader::_setupItems");
		let currentArray = aData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._setupItem(currentArray[i]);
		}
		
		console.log(this._items);
		
		return this;
	}
	
	_updateData(aData) {
		console.log("AdditionalLoader::_updateData");
		this._setupItems(aData);
		
		this._isLoading = false;
		
		console.log(">>>",  this);
		this.runCommandGroup("loaded", null);
		this._queueNextLoad();
		
		return this;
	}
}