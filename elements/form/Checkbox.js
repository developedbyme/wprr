import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import Checkbox from "wprr/elements/form/Checkbox";
export default class Checkbox extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "input";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/form/Checkbox::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value, aEvent.target.checked);
		
		this.getReference("value/" + this.props.valueName).updateValue(this.props.valueName, aEvent.target.checked, {"value": this.getSourcedProp("value")});
	}
	
	_validate(aType) {
		var validation = this.getReference("validation/validate");
		if(validation) {
			validation.validate(aType);
		}
	}
	
	_getMainElementProps() {
		var returnObject = super._getMainElementProps();
		
		returnObject["id"] = this.getSourcedProp("id");
		returnObject["name"] = this.getSourcedProp("name");
		returnObject["type"] = "checkbox";
		
		returnObject["value"] = this.getSourcedProp("value");
		returnObject["checked"] = this.getSourcedProp("checked");
		returnObject["onChange"] = this._callback_changeBound;
		
		returnObject["disabled"] = this.getSourcedProp("disabled");
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/Checkbox::_renderMainElement");
		
		return <wrapper />;
	}

}
