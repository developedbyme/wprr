import React from 'react';

import PropTypes from 'prop-types';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceHolder from "wprr/reference/ReferenceHolder";

//import EditableProps from "wprr/manipulation/EditableProps";
export default class EditableProps extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._references = new ReferenceHolder();
		
		this._propsThatShouldNotCopy.push("editableProps");
	}
	
	getReferences() {
		return this._references;
	}
	
	getChildContext() {
		//console.log("wprr/manipulation/EditableProps::getReferences")
		return {"references": this._references};
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		//console.log("wprr/manipulation/EditableProps::updateValue");
		
		var stateObject = new Object();
		stateObject[aName] = aValue;
		
		this.setState(stateObject);
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
					
					this._references.addObject("value/" + currentName, this);
				}
			}
		}
		else {
			console.warn("No props are set as editable.");
		}
		
		
		//aReturnObject["references"] = this._references;
		
		return aReturnObject;
	}
	
	_prepareRender() {
		
		this._references.setParent(this.context.references);
		
		super._prepareRender();
	}
}

EditableProps.childContextTypes = {
	"references": PropTypes.object
};
