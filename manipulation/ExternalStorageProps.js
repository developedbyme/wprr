import React from 'react';
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ExternalStorageProps from "wprr/manipulation/ExternalStorageProps";
export default class ExternalStorageProps extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._propsThatShouldNotCopy.push("props");
		this._propsThatShouldNotCopy.push("externalStorage");
	}
	
	externalDataChange() {
		//console.log("wprr/manipulation/ExternalStorageProps::externalDataChange");
		
		this._updateState();
	}
	
	_updateState() {
		//console.log("wprr/manipulation/ExternalStorageProps::_updateState");
		
		let externalStorage = this.getFirstInput("externalStorage", Wprr.sourceReference("externalStorage"));
		let currentArray = this._getPropNames();
		
		let newState = {};
		let hasChange = false;
		
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
			
				let currentValue = externalStorage.getValue(currentName);
				if(currentValue !== undefined) {
					if(this.state[currentName] !== currentValue) {
						newState[currentName] = currentValue;
						hasChange = true;
					}
					else if(JSON.stringify(this.state[currentName]) === JSON.stringify(currentValue)) {
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
		//console.log("wprr/manipulation/ExternalStorageProps::componentWillMount");
		
		//METODO: this function is depreciated by react
		
		let externalStorage = this.getSourcedProp("externalStorage");
		
		if(externalStorage) {
			externalStorage.addOwner(this);
			let currentArray = this._getPropNames();
			
			if(currentArray) {
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentName = currentArray[i];
				
					let currentValue = externalStorage.getValue(currentName);
					if(currentValue !== null && currentValue !== undefined) {
						this.state[currentName] = currentValue;
					}
				}
			}
		}
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/ExternalStorageProps::componentWillUnmount");
		
		let externalStorage = this.getSourcedProp("externalStorage");
		
		if(externalStorage) {
			externalStorage.removeOwner(this);
		}
	}
	
	_getPropNames() {
		let editableProps = this.getSourcedProp("props");
		
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
		
		this._addValuesToObject(this._getPropNames(), returnObject);
		
		return returnObject;
	}
	
	getValue(aName) {
		if(this.state[aName] !== undefined) {
			return this.state[aName];
		}
		else {
			return this.props[aName];
		}
	}
	
	_addValuesToObject(aValueNames, aReturnObject) {
		let currentArray = aValueNames;
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				aReturnObject[currentName] = this.getValue(currentName);
			}
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ExternalStorageProps::_manipulateProps");
		
		let propNames = this._getPropNames();
		
		if(propNames) {
			this._addValuesToObject(propNames, aReturnObject);
		}
		else {
			console.warn("No props are set as editable.");
		}
		
		return aReturnObject;
	}
}
