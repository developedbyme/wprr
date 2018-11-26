import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import EditableProps from "wprr/manipulation/EditableProps";
export default class EditableProps extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._propsThatShouldNotCopy.push("editableProps");
		this._propsThatShouldNotCopy.push("externalStorage");
	}
	
	externalDataChange() {
		this._updateState();
	}
	
	
	_updateExternalStorage(aName, aValue) {
		//console.log("wprr/manipulation/EditableProps::_updateExternalStorage");
		
		let externalStorage = this.getSourcedProp("externalStorage");
		
		if(externalStorage) {
			externalStorage.updateValue(aName, aValue);
		}
	}
	
	_updateState() {
		let externalStorage = this.getSourcedProp("externalStorage");
		let currentArray = this._getEditablePropNames();
		
		let newState = {};
		let hasChange = false;
		
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
			
				let currentValue = externalStorage.getValue(currentName);
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
		//console.log("wprr/manipulation/EditableProps::componentWillMount");
		
		//METODO: this function is depreciated by react
		
		let externalStorage = this.getSourcedProp("externalStorage");
		
		if(externalStorage) {
			externalStorage.addOwner(this);
			let currentArray = this._getEditablePropNames();
		
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
	
	_getEditablePropNames() {
		let editableProps = this.getSourcedProp("editableProps");
		
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
		
		let currentArray = this._getEditablePropNames();
		
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				if(this.state[currentName] !== undefined) {
					returnObject[currentName] = this.state[currentName];
				}
				else {
					returnObject[currentName] = this.props[currentName];
				}
			}
		}
		
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
	
	updateValue(aName, aValue, aAdditionalData) {
		//console.log("wprr/manipulation/EditableProps::updateValue");
		//console.log(aName, aValue, aAdditionalData);
		
		let stateObject = new Object();
		stateObject[aName] = aValue;
		
		this.setState(stateObject);
		
		this._updateExternalStorage(aName, aValue);
		
		let triggerName = this.getSourcedPropWithDefault("triggerName", "propEdited") + "/" + aName;
		let triggerController = this.getReferenceIfExists("trigger/" + triggerName);
		
		if(triggerController) {
			triggerController.trigger(triggerName, aValue);
		}
	}
	
	updateValueWithoutTrigger(aName, aValue) {
		let stateObject = new Object();
		stateObject[aName] = aValue;
		
		this.setState(stateObject);
		
		this._updateExternalStorage(aName, aValue);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/EditableProps::_manipulateProps");
		
		var editableProps = this.getSourcedProp("editableProps");
		
		if(editableProps) {
			var currentArray;
			if(typeof(editableProps) === "string") {
				currentArray = editableProps.split(","); //METODO: remove whitespace
			}
			else if(editableProps instanceof Array) {
				currentArray = editableProps;
			}
			
			if(currentArray) {
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentName = currentArray[i];
					
					if(this.state[currentName] !== undefined) {
						aReturnObject[currentName] = this.state[currentName];
					}
				}
			}
		}
		else {
			console.warn("No props are set as editable.");
		}
		
		
		//aReturnObject["references"] = this._references;
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = {};
		
		var editableProps = this.getSourcedProp("editableProps");
		
		if(editableProps) {
			var currentArray;
			if(typeof(editableProps) === "string") {
				currentArray = editableProps.split(","); //METODO: remove whitespace
			}
			else if(editableProps instanceof Array) {
				currentArray = editableProps;
			}
			
			if(currentArray) {
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentName = currentArray[i];
					
					injectData["value/" + currentName] = this;
				}
			}
		}
		else {
			console.warn("No props are set as editable.");
		}
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}
