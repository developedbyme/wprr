import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

import CommandPerformer from "wprr/commands/CommandPerformer";

// import LoadingGroup from "wprr/utils/loading/LoadingGroup";
/**
 * Loading group that checks the status of multiple loaders.
 */
export default class LoadingGroup {
	
	/**
	 * Contructor
	 */
	constructor() {
		
		this._storeController = null;
		
		this._status = 0;
		this._statusString = "";
		
		this._loaders = new Array();
		
		this._updateCommand = CallFunctionCommand.create(this, this.updateStatus);
		
		this._statusCommands = [];
	}
	
	addStatusCommand(aCommand) {
		this._statusCommands.push(aCommand);
		
		return this;
	}
	
	setStoreController(aStoreController) {
		this._storeController = aStoreController;
	}
	
	removeAllLoaders() {
		//console.log("wprr/utils/loading/LoadingGroup::removeAllLoaders");
		
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			currentLoader.removeCommand(this._updateCommand, "status");
		}
		
		currentArray.splice(0, currentArrayLength);
	}
	
	addLoaderByPath(aPath) {
		//console.log("wprr/utils/loading/LoadingGroup::addLoaderByPath");
		
		let loader = this._storeController.getLoader(aPath);
		this.addLoader(loader);
		
		return loader;
	}
	
	addLoader(aLoader) {
		aLoader.addCommand(this._updateCommand, "status");
		this._loaders.push(aLoader);
		
		return this;
	}
	
	load() {
		//console.log("wprr/utils/loading/LoadingGroup::load");
		
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			currentLoader.load();
		}
		
		this.updateStatus();
	}
	
	getData(aPath) {
		let loader = this._storeController.getLoader(aPath);
		return loader.getData();
	}
	
	_determineCompleteStatus(aStatuses) {
		if(aStatuses.indexOf(-1) !== -1) {
			return -1;
		}
		else if(aStatuses.indexOf(0) !== -1) {
			return 0;
		}
		else if(aStatuses.indexOf(2) !== -1) {
			return 2;
		}
		else if(aStatuses.indexOf(4) !== -1) {
			return 4;
		}
		else if(aStatuses.indexOf(3) !== -1) {
			return 3;
		}
		
		return 1;
	}
	
	getStatus() {
		let statuses = this.getStatuses();
		
		let status = this._determineCompleteStatus(statuses);
		
		return status;
	}
	
	getStatuses() {
		let returnArray = new Array();
		
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			let currentStatus = currentLoader.getStatus();
			returnArray.push(currentStatus);
		}
		
		return returnArray;
	}
	
	updateStatus() {
		//console.log("wprr/utils/loading/LoadingGroup::updateStatus");
		
		let statusString = this.getStatuses().join(",");
		
		if(statusString !== this._statusString) {
			this._statusString = statusString;
			this._status = this.getStatus();
			CommandPerformer.perform(this._statusCommands, this._status, null);
		}
	}
}