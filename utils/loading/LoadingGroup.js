import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

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
			currentLoader.removeSuccessCommand(this._updateCommand);
			currentLoader.removeErrorCommand(this._updateCommand);
		}
		
		currentArray.splice(0, currentArrayLength);
	}
	
	addLoaderByPath(aPath) {
		//console.log("wprr/utils/loading/LoadingGroup::addLoaderByPath");
		
		let loader = this._storeController.getLoader(aPath);
		loader.addSuccessCommand(this._updateCommand);
		loader.addErrorCommand(this._updateCommand);
		this._loaders.push(loader);
	}
	
	load() {
		//console.log("wprr/utils/loading/LoadingGroup::load");
		
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			currentLoader.load();
		}
	}
	
	getData(aPath) {
		let loader = this._storeController.getLoader(aPath);
		return loader.getData();
	}
	
	getStatus() {
		let status = 1;
		
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			let currentStatus = currentLoader.getStatus();
			if(currentStatus !== 1) {
				status = currentStatus;
				if(status === -1) {
					break;
				}
			}
		}
		
		return status;
	}
	
	updateStatus() {
		//console.log("wprr/utils/loading/LoadingGroup::updateStatus");
		
		let status = this.getStatus();
		
		if(status !== this._status) {
			this._status = status;
			
			let currentArray = this._statusCommands;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
				
				currentCommand.setEventData(this._status);
				currentCommand.perform();
			}
		}
	}
}