import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import TextArea from "wprr/elements/form/TextArea";
export default class TextArea extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "textarea";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		console.log("wprr/elements/form/TextArea::_callback_change");
		console.log(aEvent);
		console.log(aEvent.target.value);
		
		this.getReferences().getObject("value/" + this.props.valueName).updateValue(this.props.valueName, aEvent.target.value);
	}
	
	_getMainElementProps() {
		var returnObject = super._getMainElementProps();
		
		returnObject["id"] = this.props.id;
		returnObject["name"] = this.props.name;
		
		returnObject["placeholder"] = this.getSourcedProp("placeholder");
		
		returnObject["onChange"] = this._callback_changeBound;
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/TextArea::_renderMainElement");
		
		return <wrapper>{this.props.value}</wrapper>;
	}

}
