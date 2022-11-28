import Wprr from "wprr/Wprr";

import UrlResolver from "wprr/utils/UrlResolver";
import objectPath from "object-path";

// import SteppedPaths from "wprr/utils/navigation/SteppedPaths";
export default class SteppedPaths {
	
	constructor() {
		
		this._externalStorage = new Wprr.utils.DataStorage();
		this._pathParameter = "path";
		this._history = new Array();
		this._directions = new Object();
		
		this._urlResolver = new UrlResolver();
	}
	
	get externalStorage() {
		return this._externalStorage;
	}
	
	get currentPath() {
		return this._externalStorage.getValue(this._pathParameter);
	}
	
	setupExternalStorage(aExternalStorage = null, aPathParameter = null) {
		if(aExternalStorage) {
			this._externalStorage = aExternalStorage;
		}
		if(aPathParameter) {
			this._pathParameter = aPathParameter;
		}
		
		return this;
	}
	
	addDirection(aFrom, aTo, aType = "next") {
		
		if(!this._directions[aFrom]) {
			this._directions[aFrom] = new Object();
		}
		objectPath.set(this._directions[aFrom], aType, aTo);
		
		return this;
	}
	
	addDirections(aDirections, aType = "next") {
		let currentArray = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(aDirections);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentValue = currentItem["value"];
			if(typeof(currentValue) === "string") {
				this.addDirection(currentItem["key"], currentValue, aType);
			}
			else {
				let currentArray2 = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(currentValue);
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let currentTypeItem = currentArray2[j];
					this.addDirection(currentItem["key"], currentTypeItem["value"], currentTypeItem["key"]);
				}
			}
		}
		
		return this;
	}
	
	getStepFrom(aPath, aType) {
		//console.log(aPath, aType);
		
		let currentDirections = this._directions[aPath];
		let currentPath = objectPath.get(currentDirections, aType);
		if(currentPath) {
			return currentPath;
		}
		if(aPath === "") {
			//METODO: error message
			return null;
		}
		
		let tempArray = aPath.split("/");
		if(tempArray.length > 0) {
			tempArray.pop();
			return this.getStepFrom(tempArray.join("/"), aType);
		}
		
		return null;
	}
	
	getNextStepFrom(aPath) {
		return this.getStepFrom(aPath, "next");
	}
	
	getNextStep() {
		let nextStep = this.getNextStepFrom(this.currentPath);
		return nextStep;
	}
	
	nextStep() {
		let nextStep = this.getNextStep();
		this.changePath(nextStep);
		
		return this;
	}
	
	previousStep() {
		if(this._history.length > 1) {
			this._history.pop();
			
			let currentPath = this._history[this._history.length-1];
			this._performSetPath(currentPath);
		}
		
		return this;
	}
	
	changeStep(aType) {
		let nextStep = this.getStepFrom(this.currentPath, aType);
		if(nextStep) {
			this.changePath(nextStep);
		}
		else {
			console.error("No step named " + aType + " from " + this.currentPath, this);
		}
		
		return this;
	}
	
	getAbsolutePath(aPath) {
		this._urlResolver.setupBaseUrl("", this.currentPath);
		let fullPath = this._urlResolver.getAbsolutePath(aPath);
		
		//console.log(fullPath);
		
		return fullPath;
	}
	
	changePath(aPath) {
		
		let fullPath = this.getAbsolutePath(aPath);
		
		this.setPath(fullPath);
		
		return this;
	}
	
	_performSetPath(aPath) {
		this._externalStorage.updateValue(this._pathParameter, aPath);
		
		return this;
	}
	
	setPath(aPath) {
		this._history.push(aPath);
		this._performSetPath(aPath);
		
		return this;
	}
}