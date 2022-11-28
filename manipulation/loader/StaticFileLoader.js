import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import StaticFileLoader from "wprr/manipulation/loader/StaticFileLoader";
export default class StaticFileLoader extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		this.state["status"] = 0;
		this.state["loadedData"] = null;
		
		this._response = null;
		
		this._loadPromise = null;
		
		this._promise_loadResponseBound = this._promise_loadResponse.bind(this);
		this._promise_dataEncodedBound = this._promise_dataEncoded.bind(this);
		this._promise_loadingErrorBound = this._promise_loadingError.bind(this);
	}
	
	componentDidMount() {
		//console.log("wprr/manipulation/loader/StaticFileLoader::componentDidMount");
		
		//METODO: this function is depreciated by react
		
		let url = this.getSourcedProp("url");
		
		this.setState({"status": 2});
		
		this._loadPromise = fetch(url, {
			"method": "GET"
		})
		.then(this._promise_loadResponseBound)
		.then(this._promise_dataEncodedBound)
		.catch(this._promise_loadingErrorBound);
	}
	
	_promise_loadResponse(aResponse) {
		//console.log("wprr/manipulation/loader/StaticFileLoader::_promise_loadResponse");
		
		this._response = aResponse;
		
		return aResponse.text();
	}
	
	_promise_dataEncoded(aDataString) {
		//console.log("wprr/manipulation/loader/StaticFileLoader::_promise_dataEncoded");
		//console.log(aDataString);
		
		if(!this._response.ok) {
			throw Error(this._response.statusText + "\n" + aDataString);
		}
		
		let data = null;
		let responseType = this.getSourcedProp("fileType");
		switch(responseType) {
			case "json":
				try {
					data = JSON.parse(aDataString);
				}
				catch(theError) {
					throw Error("Could not parse data. \n" + aDataString);
				}
				break;
			default:
				console.warn("Unknown response type " + responseType + ". Using text instead.");
			case "text":
				data = aDataString;
				break;
		}
		
		this.setState({"loadedData": data, "status": 1});
	}
	
	_promise_loadingError(aError) {
		//console.log("wprr/manipulation/loader/StaticFileLoader::_promise_loadingError");
		console.error(aError);
		
		this.setState({"status": -1});
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/loader/StaticFileLoader::_manipulateProps");
		
		let outputName = this.getSourcedPropWithDefault("output", "fileData");
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		//METODO: source cleanup
		delete returnObject["output"];
		delete returnObject["url"];
		delete returnObject["nonBlocking"];
		
		returnObject[outputName] = this.state["loadedData"];
		
		return returnObject;
	}
	
	_getChildrenToClone() {
		
		let nonBlocking = this.getSourcedPropWithDefault("nonBlocking", false);
		
		if(this.state["status"] === 1 || this.props.nonBlocking) {
			return super._getChildrenToClone();
		}
		else if(this.state["status"] === 2 || this.state["status"] === 0) {
			let markup = this.getSourcedPropWithDefault("loadingMarkup", null);
			if(markup) {
				return [markup];
			}
		}
		else if(this.state["status"] === -1) {
			let markup = this.getSourcedPropWithDefault("errorMarkup", null);
			if(markup) {
				return [markup];
			}
		}
		
		return [];
	}
}
