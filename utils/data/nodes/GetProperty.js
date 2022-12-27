import Wprr from "wprr/Wprr";
import BaseObject from "wprr/core/BaseObject";

// import GetProperty from "./GetProperty";
export default class GetProperty extends BaseObject {
	
	constructor() {
		super();
		
		this._itemChangedCommand = Wprr.commands.callFunction(this, this._itemChanged);
		
		this.createSource("propertyPath", null).addChangeCommand(this._itemChangedCommand);
		this.createSource("object", null).addChangeCommand(this._itemChangedCommand);
		this.createSource("value", null);
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
		//console.log("GetProperty::_itemChanged");
		//console.log(this);
		
		let propertyPath = this.propertyPath;
		if(propertyPath) {
			this.value = Wprr.objectPath(this.object, propertyPath);
		}
		
	}
	
	toJSON() {
		return "[GetProperty id=" + this._id + "]";
	}
	
	static connect(aObject = null, aPropertyPath = null) {
		let newGetProperty = new GetProperty();
		
		if(aObject) {
			newGetProperty.sources.get("object").input(aObject);
		}
		if(aPropertyPath) {
			newGetProperty.sources.get("propertyPath").input(aPropertyPath);
		}
		
		return newGetProperty;
	}
}