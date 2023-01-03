import Wprr from "wprr/Wprr";
import BaseObject from "wprr/core/BaseObject";

import objectPath from "object-path";

// import ObjectProperty from "./ObjectProperty";
export default class ObjectProperty extends BaseObject {
	
	constructor() {
		super();
		
		this._itemChangedCommand = Wprr.commands.callFunction(this, this._itemChanged);
		this._valueChangedCommand = Wprr.commands.callFunction(this, this._valueChanged);
		
		this.createSource("propertyPath", null).addChangeCommand(this._itemChangedCommand);
		this.createSource("object", null).addChangeCommand(this._itemChangedCommand);
		this.createSource("value", null).addChangeCommand(this._valueChangedCommand);
	}
	
	setObject(aValue) {
		this.object = aValue;
		
		return this;
	}
	
	setPropertyPath(aValue) {
		
		this.propertyPath = aValue;
		
		return this;
	}
	
	_itemChanged() {
		//console.log("ObjectProperty::_itemChanged");
		//console.log(this);
		
		let propertyPath = this.propertyPath;
		if(propertyPath) {
			this.value = Wprr.objectPath(this.object, propertyPath);
		}
		
	}
	
	_valueChanged() {
		//console.log("_valueChanged");
		
		let propertyPath = this.propertyPath;
		if(this.object && propertyPath) {
			let currentValue = Wprr.objectPath(this.object, propertyPath);
			if(this.value !== currentValue) {
				let currentObject = Wprr.utils.object.copyViaJson(this.object);
				objectPath.set(currentObject, propertyPath, this.value);
				this.object = currentObject;
			}
		}
	}
	
	toJSON() {
		return "[ObjectProperty id=" + this._id + "]";
	}
	
	static connect(aObject = null, aPropertyPath = null, aValue = null) {
		let newObjectProperty = new ObjectProperty();
		
		if(aValue) {
			newObjectProperty.sources.get("value").input(aValue);
		}
		if(aObject) {
			newObjectProperty.sources.get("object").input(aObject);
		}
		if(aPropertyPath) {
			newObjectProperty.sources.get("propertyPath").input(aPropertyPath);
		}
		
		return newObjectProperty;
	}
}