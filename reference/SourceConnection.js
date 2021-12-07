"use strict";
import Wprr from "wprr/Wprr";


import BaseObject from "wprr/core/BaseObject";

// import SourceConnection from "wprr/reference/SourceConnection";
export default class SourceConnection extends BaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/SourceConnection::constructor");
		
		super();
		
		this._isUpdating = false;
		
		this._valueSources = new Array();
		this._externalStorageVariables = new Array();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._updateSources, [Wprr.sourceEvent()]);
	}
	
	_updateSources(aValue) {
		//console.log("_updateSources");
		//console.log(aValue);
		//console.log(this);
		
		if(this._isUpdating) {
			return;
		}
		
		this._isUpdating = true;
		
		{
			let currentArray = this._valueSources;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentSource = currentArray[i];
				if(!Wprr.utils.object.isEqual(aValue, currentSource.value)) {
					try {
						currentSource.value = Wprr.utils.object.tryCopyViaJson(aValue);
					}
					catch(theError) {
						console.error("Error while updating source", currentSource, this, theError);
					}
				}
			}
		}
		
		{
			let currentArray = this._externalStorageVariables;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentLink = currentArray[i];
				let currentValue = currentLink["externalStorage"].getValue(currentLink["path"]);
				if(!Wprr.utils.object.isEqual(aValue, currentValue)) {
					try {
						currentLink["externalStorage"].updateValue(currentLink["path"], aValue);
					}
					catch(theError) {
						console.error("Error while updating external storage", currentSource, this, theError);
					}
				}
			}
		}
		
		this._isUpdating = false;
		
		return this;
	}
	
	addValueSource(aSource) {
		
		aSource.addChangeCommand(this._updateCommand);
		this._valueSources.push(aSource);
		
		aSource._linkRegistration_addConnection(this);
		
		return this;
	}
	
	removeValueSource(aSource) {
		let currentArray = this._valueSources;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSource = currentArray[i];
			if(currentSource === aSource) {
				currentSource.removeChangeCommand(this._updateCommand);
				currentSource._linkRegistration_removeConnection(this);
				
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		return this;
	}
	
	hasSource(aSource) {
		let currentArray = this._valueSources;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(currentArray[i] === aSource) {
				return true;
			}
		}
		
		return false;
	}
	
	addExternalStorageVariable(aExternalStorage, aPath) {
		
		let updateCommand = Wprr.commands.callFunction(this, this._updateSources, [Wprr.sourceEvent(Wprr.sourceFunction(aExternalStorage, "getFullName", [aPath]))]);
		
		let commandGroup = aExternalStorage.createChangeCommands(aPath, null, updateCommand);
		
		let linkObject = {"externalStorage": aExternalStorage, "path": aPath, "commandGroup": commandGroup};
		this._externalStorageVariables.push(linkObject);
		
		return this;
	}
}