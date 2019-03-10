// import JsonLoader from "wprr/utils/loading/JsonLoader";
/**
 * Loader that loads json data
 */
export default class JsonLoader {
	
	/**
	 * Contructor
	 */
	constructor() {
		this._url = null;
		this._method = "GET";
		this._credentials = "same-origin";
		this._headers = {
			"Accept": "application/json"
		};
		
		this._loadedAt = -1;
		this._status = JsonLoader.STATUS_NOT_STARTED;
		this._data = null;
		this._body = null;
		
		this.onLoad = null;
		
		this._commandGroups = {
			"status": [],
			"success": [],
			"error": [],
		}
	}
	
	getStatus() {
		return this._status;
	}
	
	hasCompleted() {
		return (this._status === JsonLoader.LOADED || this._status === JsonLoader.ERROR_LOADING);
	}
	
	setMethod(aMethod) {
		this._method = aMethod;
		
		return this;
	}
	
	setUrl(aUrl) {
		this._url = aUrl;
		
		return this;
	}
	
	setupPost(aUrl, aBody) {
		this._url = aUrl;
		this._method = "POST";
		this._body = aBody;
		
		return this;
	}
	
	setupJsonPost(aUrl, aBody) {
		this._url = aUrl;
		
		return this.setJsonPostBody(aBody);
	}
	
	setJsonPostBody(aBody) {
		this._method = "POST";
		this._body = JSON.stringify(aBody);
		
		this.addHeader("Content-Type", "application/json");
		
		return this;
	}
	
	addHeader(aName, aValue) {
		this._headers[aName] = aValue;
		
		return this;
	}
	
	setBody(aBody) {
		this._body = (aBody instanceof String) ? aBody : JSON.stringify(aBody);
		
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
		//console.log("wprr/utils/loading/JsonLoader::setData");
		//console.log(aData);
		
		this._loadedAt = (new Date()).valueOf();
		this._data = aData;
	}
	
	getData() {
		return this._data;
	}
	
	setStatus(aStatus) {
		//console.log("wprr/utils/loading/JsonLoader::setStatus");
		//console.log(aStatus);
		
		this._status = aStatus;
		
		if(this._status === JsonLoader.LOADED) {
			
			if(this.onLoad) { //METODO: remove the callback and just use the command
				this.onLoad(this._data);
			}
			
			this.runCommandGroup("success", this._data);
		}
		else if(this._status === JsonLoader.ERROR_LOADING) {
			this.runCommandGroup("error", this._data);
		}
		
		this.runCommandGroup("status", this._data);
		
		return this;
	}
	
	load() {
		
		if(this._status === JsonLoader.STATUS_NOT_STARTED) {
			this.setStatus(JsonLoader.LOADING);
		}
		else if(this._status === JsonLoader.INVALID) {
			this.setStatus(JsonLoader.LOADING_FROM_INVALID);
		}
		else {
			return this;
		}
		
		let sendParameters =  {"credentials": this._credentials, "method": this._method, headers: this._headers};
		if(this._method !== "GET" && this._method !== "HEAD") {
			sendParameters["body"] = this._body;
		}
		
		fetch(this._url, sendParameters)
		.then( (response) => {
			return response.json();
		})
		.then( (data) => {
			this.setData(data);
			this.setStatus(JsonLoader.LOADED);
		})
		.catch( (error) => {
			console.error("Error submitting");
			console.log(error);
			
			this.setStatus(JsonLoader.ERROR_LOADING);
		});
		
		return this;
	}
	
	invalidate() {
		//console.log("wprr/utils/loading/JsonLoader::invalidate");
		if(this._status !== JsonLoader.LOADED && this._status !== JsonLoader.ERROR_LOADING) {
			return this;
		}
		
		this.setStatus(JsonLoader.INVALID);
		
		if(JsonLoader.RELOAD_ON_INVALID) {
			this.load();
		}
	}
}

JsonLoader.STATUS_NOT_STARTED = 0;
JsonLoader.LOADED = 1;
JsonLoader.LOADING = 2;
JsonLoader.ERROR_LOADING = -1;
JsonLoader.INVALID = 3;
JsonLoader.LOADING_FROM_INVALID = 4;

JsonLoader.RELOAD_ON_INVALID = false;