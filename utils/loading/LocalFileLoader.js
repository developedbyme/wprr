// import LocalFileLoader from "wprr/utils/loading/LocalFileLoader";
/**
 * Loader that loads a local file reference
 */
export default class LocalFileLoader {
	
	/**
	 * Contructor
	 */
	constructor() {
		
		this._fileReference = null;
		this._fileReader = null;
		this._readMode = "binaryString";
		
		this._loadedAt = -1;
		this._status = LocalFileLoader.STATUS_NOT_STARTED;
		this._data = null;
		
		this._commandGroups = {
			"status": [],
			"success": [],
			"error": [],
		}
		
		this._callback_loadedBound = this._callback_loaded.bind(this);
		this._callback_errorBound = this._callback_error.bind(this);
	}
	
	getUrl() {
		return this._url;
	}
	
	getStatus() {
		return this._status;
	}
	
	hasCompleted() {
		return (this._status === LocalFileLoader.LOADED || this._status === LocalFileLoader.ERROR_LOADING);
	}
	
	setFileReference(aFileReference) {
		this._fileReference = aFileReference;
		
		return this;
	}
	
	setReadMode(aReadMode) {
		this._readMode = aReadMode;
		
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
	
	addSuccessCommand(aCommand) {
		this.addCommand(aCommand, "success");
		
		return this;
	}
	
	addErrorCommand(aCommand) {
		this.addCommand(aCommand, "error");
		
		return this;
	}
	
	removeSuccessCommand(aCommand) {
		this.removeCommand(aCommand, "success");
		
		return this;
	}
	
	removeErrorCommand(aCommand) {
		this.removeCommand(aCommand, "error");
		
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
	
	setData(aData) {
		//console.log("wprr/utils/loading/LocalFileLoader::setData");
		//console.log(aData);
		
		this._loadedAt = (new Date()).valueOf();
		this._data = aData;
	}
	
	getData() {
		return this._data;
	}
	
	setStatus(aStatus) {
		//console.log("wprr/utils/loading/LocalFileLoader::setStatus");
		//console.log(aStatus);
		
		this._status = aStatus;
		
		if(this._status === LocalFileLoader.LOADED) {
			
			if(this.onLoad) { //METODO: remove the callback and just use the command
				this.onLoad(this._data);
			}
			
			this.runCommandGroup("success", this._data);
		}
		else if(this._status === LocalFileLoader.ERROR_LOADING) {
			this.runCommandGroup("error", this._data);
		}
		
		this.runCommandGroup("status", this._data);
		
		return this;
	}
	
	load() {
		
		if(this._status === LocalFileLoader.STATUS_NOT_STARTED) {
			this.setStatus(LocalFileLoader.LOADING);
		}
		else if(this._status === LocalFileLoader.INVALID) {
			this.setStatus(LocalFileLoader.LOADING_FROM_INVALID);
		}
		else {
			return this;
		}
		
		this._fileReader = new FileReader();
		this._fileReader.addEventListener("load", this._callback_loadedBound);
		this._fileReader.addEventListener("error", this._callback_errorBound);
		
		switch(this._readMode) {
			case "binaryString":
				this._fileReader.readAsBinaryString(this._fileReference);
				break;
			case "dataUrl":
				this._fileReader.readAsDataURL(this._fileReference);
				break;
			case "arrayBuffer":
				this._fileReader.readAsArrayBuffer(this._fileReference);
				break;
			default:
				console.warn("Unknown read mode " + this._readMode + ", using binaryString.");
			case "binaryString":
				this._fileReader.readAsBinaryString(this._fileReference);
				break;
		}
		
		return this;
	}
	
	_callback_loaded(aEvent) {
		console.log("_callback_loaded");
		
		let data = aEvent.target.result;
		
		this.setData(data);
		this.setStatus(LocalFileLoader.LOADED);
	}
	
	_callback_error(aEvent) {
		console.log("_callback_error");
		
		this.setStatus(LocalFileLoader.ERROR_LOADING);
	}
	
	invalidate() {
		//console.log("wprr/utils/loading/LocalFileLoader::invalidate");
		if(this._status !== LocalFileLoader.LOADED && this._status !== LocalFileLoader.ERROR_LOADING) {
			return this;
		}
		
		this.setStatus(LocalFileLoader.INVALID);
		
		if(LocalFileLoader.RELOAD_ON_INVALID) {
			this.load();
		}
	}
}

LocalFileLoader.STATUS_NOT_STARTED = 0;
LocalFileLoader.LOADED = 1;
LocalFileLoader.LOADING = 2;
LocalFileLoader.ERROR_LOADING = -1;
LocalFileLoader.INVALID = 3;
LocalFileLoader.LOADING_FROM_INVALID = 4;

LocalFileLoader.RELOAD_ON_INVALID = false;