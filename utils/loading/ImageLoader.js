import Wprr from "wprr/Wprr";

// import ImageLoader from "wprr/utils/loading/ImageLoader";
/**
 * Loader that loads an image
 */
export default class ImageLoader {
	
	/**
	 * Contructor
	 */
	constructor() {
		
		this._image = null;
		
		this._loadedAt = -1;
		this._status = Wprr.sourceValue(ImageLoader.STATUS_NOT_STARTED);
		this._data = Wprr.sourceValue(null);
		
		this._commandGroups = {
			"status": [],
			"success": [],
			"error": [],
		}
		
		this._callback_loadedBound = this._callback_loaded.bind(this);
		this._callback_errorBound = this._callback_error.bind(this);
	}
	
	setUrl(aUrl) {
		this._url = aUrl;
		
		return this._url;
	}
	
	getUrl() {
		return this._url;
	}
	
	getStatus() {
		return this._status.value;
	}
	
	hasCompleted() {
		let status = this.getStatus();
		return (status === ImageLoader.LOADED || status === ImageLoader.ERROR_LOADING);
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
		console.log("wprr/utils/loading/ImageLoader::setData");
		console.log(aData);
		
		this._loadedAt = (new Date()).valueOf();
		this._data.value = aData;
		
		console.log(this);
	}
	
	getData() {
		return this._data.value;
	}
	
	getDataSource() {
		return this._data;
	}
	
	setStatus(aStatus) {
		//console.log("wprr/utils/loading/ImageLoader::setStatus");
		//console.log(aStatus);
		
		this._status.value = aStatus;
		
		if(aStatus === ImageLoader.LOADED) {
			this.runCommandGroup("success", this._data);
		}
		else if(aStatus === ImageLoader.ERROR_LOADING) {
			this.runCommandGroup("error", this._data);
		}
		
		this.runCommandGroup("status", this.getData());
		
		return this;
	}
	
	load() {
		
		let status = this._status.value;
		if(status === ImageLoader.STATUS_NOT_STARTED) {
			this.setStatus(ImageLoader.LOADING);
		}
		else if(status === ImageLoader.INVALID) {
			this.setStatus(ImageLoader.LOADING_FROM_INVALID);
		}
		else {
			return this;
		}
		
		this._image = new Image();
		this._image.addEventListener("load", this._callback_loadedBound);
		this._image.addEventListener("error", this._callback_errorBound);
		
		this._image.src = this._url;
		
		return this;
	}
	
	_callback_loaded(aEvent) {
		console.log("_callback_loaded");
		
		this.setData(this._image);
		this.setStatus(ImageLoader.LOADED);
	}
	
	_callback_error(aEvent) {
		console.log("_callback_error");
		
		this.setStatus(ImageLoader.ERROR_LOADING);
	}
	
	invalidate() {
		//console.log("wprr/utils/loading/ImageLoader::invalidate");
		
		let status = this.getStatus();
		if(status !== ImageLoader.LOADED && status !== ImageLoader.ERROR_LOADING) {
			return this;
		}
		
		this.setStatus(ImageLoader.INVALID);
		
		if(ImageLoader.RELOAD_ON_INVALID) {
			this.load();
		}
	}
}

ImageLoader.STATUS_NOT_STARTED = 0;
ImageLoader.LOADED = 1;
ImageLoader.LOADING = 2;
ImageLoader.ERROR_LOADING = -1;
ImageLoader.INVALID = 3;
ImageLoader.LOADING_FROM_INVALID = 4;

ImageLoader.RELOAD_ON_INVALID = false;