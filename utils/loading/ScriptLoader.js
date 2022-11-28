// import ScriptLoader from "wprr/utils/loading/ScriptLoader";
/**
 * Loader that loads a script into the dom
 */
export default class ScriptLoader {
	
	/**
	 * Contructor
	 */
	constructor() {
		this._url = null;
		
		this._loadedAt = -1;
		this._status = ScriptLoader.STATUS_NOT_STARTED;
		
		this._commandGroups = {
			"status": [],
			"success": [],
			"error": [],
		}
		
		this._callback_scriptLoadedBound = this._callback_scriptLoaded.bind(this);
	}
	
	getUrl() {
		return this._url;
	}
	
	getStatus() {
		return this._status;
	}
	
	hasCompleted() {
		return (this._status === ScriptLoader.LOADED || this._status === ScriptLoader.ERROR_LOADING);
	}
	
	setUrl(aUrl) {
		this._url = aUrl;
		
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
	
	addSuccessCommands(aCommands) {
		let currentArray = aCommands;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this.addSuccessCommand(currentArray[i]);
		}
		
		return this;
	}
	
	addErrorCommand(aCommand) {
		this.addCommand(aCommand, "error");
		
		return this;
	}
	
	addErrorCommands(aCommands) {
		let currentArray = aCommands;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this.addErrorCommand(currentArray[i]);
		}
		
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
	
	runCommandGroup(aGroup, aData = null) {
		//console.log("runCommandGroup");
		//console.log(aGroup, this._commandGroups[aGroup], this._commandGroups);
		if(this._commandGroups[aGroup]) {
			this.runCommands(this._commandGroups[aGroup], aData);
		}
	}
	
	runCommands(aCommands, aData = null) {
		//console.log("runCommands");
		if(aCommands) {
			let currentArray = [].concat(aCommands);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
				//console.log(currentCommand);
		
				currentCommand.setEventData(aData);
				currentCommand.perform();
			}
		}
	}
	
	setStatus(aStatus) {
		//console.log("wprr/utils/loading/ScriptLoader::setStatus");
		//console.log(aStatus);
		
		this._status = aStatus;
		
		if(this._status === ScriptLoader.LOADED) {
			this.runCommandGroup("success", null);
		}
		else if(this._status === ScriptLoader.ERROR_LOADING) {
			this.runCommandGroup("error", null);
		}
		
		this.runCommandGroup("status", null);
		
		return this;
	}
	
	_prepareLoad() {
		this.runCommandGroup("prepareLoad", null);
		
		return this;
	}
	
	_callback_scriptLoaded(aEvent) {
		//console.log("_callback_scriptLoaded");
		this._loadedAt = (new Date()).valueOf();
		this.setStatus(ScriptLoader.LOADED);
	}
	
	load() {
		
		if(this._status === ScriptLoader.STATUS_NOT_STARTED) {
			this.setStatus(ScriptLoader.LOADING);
		}
		else if(this._status === ScriptLoader.INVALID) {
			this.setStatus(ScriptLoader.LOADING_FROM_INVALID);
		}
		else {
			return this;
		}
		
		this._prepareLoad();
		
		let scriptElement = document.createElement("script");
		scriptElement.addEventListener("load", this._callback_scriptLoadedBound, false);
		
		scriptElement.src = this._url;
		document.querySelector("head").appendChild(scriptElement);
		
		return this;
	}
}

ScriptLoader.STATUS_NOT_STARTED = 0;
ScriptLoader.LOADED = 1;
ScriptLoader.LOADING = 2;
ScriptLoader.ERROR_LOADING = -1;
ScriptLoader.INVALID = 3;
ScriptLoader.LOADING_FROM_INVALID = 4;