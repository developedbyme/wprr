import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReduxDataStorage from "wprr/utils/ReduxDataStorage";

//import ReduxGlobalVariables from "wprr/manipulation/ReduxGlobalVariables";
export default class ReduxGlobalVariables extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._propsThatShouldNotCopy.push("variables");
		this._propsThatShouldNotCopy.push("pathPrefix");
		
		this._externalStorage = new ReduxDataStorage();
	}
	
	externalDataChange() {
		this._updateState();
	}
	
	_updateState() {
		let currentArray = this._getVariableNames();
		
		let newState = {};
		let hasChange = false;
		
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
			
				let currentValue = this._externalStorage.getValue(currentName);
				if(currentValue !== null && currentValue !== undefined) {
					if(this.state[currentName] !== currentValue) {
						newState[currentName] = currentValue;
						hasChange = true;
					}
				}
			}
		}
		
		if(hasChange) {
			this.setState(newState);
		}
	}
	
	componentWillMount() {
		//console.log("wprr/manipulation/ReduxGlobalVariables::componentWillMount");
		
		//METODO: this function is depreciated by react
		
		this._externalStorage.setStoreController(this.getReference("redux/store/wprrController"));
		this._externalStorage.addOwner(this);
		
		let pathPrefix = this.getSourcedProp("pathPrefix");
		if(pathPrefix) {
			this._externalStorage.setPathPrefix(pathPrefix);
		}
		
		this._prepareRender();
		
		let currentArray = this._getVariableNames();
	
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
			
				let currentValue = this._externalStorage.getValue(currentName);
				if(currentValue !== null && currentValue !== undefined) {
					this.state[currentName] = currentValue;
				}
			}
		}
	}
	
	_getVariableNames() {
		let editableProps = this.getSourcedProp("variables");
		
		if(editableProps) {
			let currentArray;
			if(typeof(editableProps) === "string") {
				currentArray = editableProps.split(","); //METODO: remove whitespace
			}
			else if(editableProps instanceof Array) {
				currentArray = editableProps;
			}
			return currentArray;
		}
		return [];
	}
	
	getData() {
		let returnObject = new Object();
		
		let currentArray = this._getVariableNames();
		
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				returnObject[currentName] = this.state[currentName];
			}
		}
		
		return returnObject;
	}
	
	getValue(aName) {
		return this.state[aName];
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ReduxGlobalVariables::_manipulateProps");
		
		let currentArray = this._getVariableNames();
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				aReturnObject[currentName] = this.state[currentName];
			}
		}
		
		return aReturnObject;
	}
}
