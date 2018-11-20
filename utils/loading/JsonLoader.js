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
		this._status = 0;
		this._data = null;
		this._body = null;
		
		this.onLoad = null;
		
		this._successCommands = [];
		this._errorCommands = [];
	}
	
	getStatus() {
		return this._status;
	}
	
	hasCompleted() {
		return (this._status === 1 || this._status === -1);
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
	
	addSuccessCommand(aCommand) {
		this._successCommands.push(aCommand);
		
		return this;
	}
	
	addErrorCommand(aCommand) {
		this._errorCommands.push(aCommand);
		
		return this;
	}
	
	removeSuccessCommand(aCommand) {
		let currentArray = this._successCommands;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentCommand = currentArray[i];
			if(currentCommand === aCommand) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		return this;
	}
	
	removeErrorCommand(aCommand) {
		let currentArray = this._errorCommands;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentCommand = currentArray[i];
			if(currentCommand === aCommand) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		return this;
	}
	
	setData(aData) {
		this._loadedAt = (new Date()).valueOf();
		this._data = aData;
	}
	
	getData() {
		return this._data;
	}
	
	setStatus(aStatus) {
		this._status = aStatus;
		
		if(this._status === 1) {
			//METODO: use a better way for this
			if(this.onLoad) {
				this.onLoad(this._data);
			}
			
			let currentArray = [].concat(this._successCommands);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
				
				currentCommand.setEventData(this._data);
				currentCommand.perform();
			}
		}
		else if(this._status === -1) {
			let currentArray = [].concat(this._errorCommands);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCommand = currentArray[i];
				
				currentCommand.setEventData(this._data);
				currentCommand.perform();
			}
		}
	}
	
	load() {
		
		if(this._status !== 0) {
			return;
		}
		this.setStatus(2);
		
		fetch(this._url, {"credentials": this._credentials, "method": this._method, "body": this._body, headers: this._headers})
		.then( (response) => {
			return response.json();
		})
		.then( (data) => {
			this.setData(data);
			this.setStatus(1);
		})
		.catch( (error) => {
			console.error("Error submitting");
			console.log(error);
			
			this.setStatus(-1);
		});
	}
}