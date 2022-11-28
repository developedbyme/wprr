import objectPath from "object-path";
import queryString from "query-string";
import Wprr from "wprr/Wprr";

import DataStorage from "wprr/utils/DataStorage";

// import UrlDataStorage from "wprr/utils/UrlDataStorage";
export default class UrlDataStorage extends DataStorage {
	
	constructor() {
		super();
		
		this._parameters = new Array();
		this._autoAddParameters = true;
		
		this._callback_popStateBound = this._callback_popState.bind(this);
	}
	
	startListeners() {
		//console.log("wprr/utils/UrlDataStorage::startListeners");
		
		window.addEventListener("popstate", this._callback_popStateBound, false);
		
		return this;
	}
	
	setAutoAddParameters(aAutoAdd = true) {
		this._autoAddParameters = aAutoAdd;
		
		return this;
	}
	
	_callback_popState(aEvent) {
		this._updateValuesFromQueryString(document.location.search);
	}
	
	decodeValue(aValue, aFormat) {
		let decodedValue = decodeURIComponent(aValue);
		
		switch(aFormat) {
			case "json":
				if(!aValue) {
					return null;
				}
				return JSON.parse(decodedValue);
			case "array":
				//METODO
				console.error("METODO: implement array formatting");
				break;
		}
		return decodedValue;
	}
	
	encodeValue(aValue, aFormat) {
		let value = aValue;
		
		switch(aFormat) {
			case "json":
				value = JSON.stringify(value);
				break;
			case "array":
				//METODO
				console.error("METODO: implement array formatting");
				break;
		}
		return decodeURIComponent(value);
	}
	
	addParameter(aName, aFormat = "text") {
		this._parameters.push({"name": aName, "format": aFormat});
		
		let parsedQueryString = queryString.parse(location.search);
		if(parsedQueryString[aName]) {
			objectPath.set(this._data, aName, this.decodeValue(parsedQueryString[aName], aFormat));
			this._updateOwners();
		}
		
		return this;
	}
	
	_updateValuesFromQueryString(aQueryString) {
		let parsedQueryString = queryString.parse(aQueryString);
		let hasChange = false;
		
		let currentArray = this._parameters;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i]["name"];
			let format = currentArray[i]["format"];
			let currentValue = objectPath.get(this._data, currentName);
			let newValue = this.decodeValue(parsedQueryString[currentName], format);
			if(newValue !== currentValue) {
				objectPath.set(this._data, currentName, newValue);
				hasChange = true;
			}
		}
		
		if(hasChange) {
			this._updateOwners();
		}
		
		return this;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/UrlDataStorage::updateValue");
		super.updateValue(aName, aValue);
		
		let dotIndex = aName.indexOf(".");
		let topName = (dotIndex !== -1) ? aName.substring(0, dotIndex) : aName;
		
		this._changeUrlQueryString(topName);
		
		return this;
	}
	
	getFormat(aName) {
		let item = Wprr.utils.array.getItemBy("name", aName, this._parameters);
		if(item) {
			return item["format"];
		}
		return null;
	}
	
	_changeUrlQueryString(aName) {
		let parsedQueryString = queryString.parse(document.location.search);
		
		let format = this.getFormat(aName);
		if(format === null) {
			if(this._autoAddParameters) {
				format = "text";
				this._parameters.push({"name": aName, "format": format});
			}
			else {
				return this;
			}
		}
		
		parsedQueryString[aName] = this.encodeValue(objectPath.get(this._data, aName), this.getFormat(aName));
		
		let encodedQueryStrings = queryString.stringify(parsedQueryString);
		
		let newUrl = document.location.href;
		if(document.location.search.length > 0) {
			newUrl = newUrl.replace(document.location.search, "?" + encodedQueryStrings);
		}
		else {
			newUrl += "?" + encodedQueryStrings;
		}
		
		window.history.pushState({}, "", newUrl);
		
		return this;
	}
	
	static create() {
		let newUrlDataStorage = new UrlDataStorage();
		
		newUrlDataStorage.startListeners();
		
		return newUrlDataStorage;
	}
}