import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SetObjectProperties from "./SetObjectProperties";
export default class SetObjectProperties extends BaseObject {
	
	constructor() {
		super();
		
		this._updateObjectCommand = Wprr.commands.callFunction(this, this._updateObject);
		
		this.createSource("baseObject", {}).addChangeCommand(this._updateObjectCommand);
		this.createSource("propertyNames", []).addChangeCommand(this._updateObjectCommand);
		
		this.createSource("object", {});
		this.createSource("objectString", "");
	}
	
	addProperty(aName, aValue) {
		this.createSource(aName, aValue).addChangeCommand(this._updateObjectCommand);
		
		let propertyNames = [].concat(this.propertyNames);
		propertyNames.push(aName);
		this.propertyNames = propertyNames;
		
		return this;
	}
	
	addPropertySource(aName, aSource) {
		this.addProperty(aName, aSource.value);
		this.sources.get(aName).connectSource(aSource);
		
		return this;
	}
	
	_updateObject() {
		let object = this.baseObject;
		//METODO: add option to copy object
		
		let currentArray = this.propertyNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let propertyName = currentArray[i];
			let currentValue = this[propertyName];
			object[propertyName] = currentValue;
		}
		
		this.object = object;
		this.objectString = JSON.stringify(object);
		
		return this;
	}
}