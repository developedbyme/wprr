import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

// import Form from "wprr/elements/form/Form";
export default class Form extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._callback_submitBound = this._callback_submit.bind(this);
	}
	
	_handleSubmit() {
		
		let submitCommands = this.getSourcedProp("submitCommands");
		if(submitCommands) {
			CommandPerformer.perform(submitCommands, this.getFormData(), this);
			return true;
		}
		
		return false;
	}
	
	_callback_submit(aEvent) {
		console.log("wprr/elements/form/Form::_callback_submit");
		//console.log(aEvent);
		
		let handleResult = this._handleSubmit();
		if(handleResult) {
			aEvent.preventDefault();
		}
	}
	
	submit() {
		//console.log("wprr/elements/form/Form::submit");
		
		this._trigger_submit();
		
	}
	
	getFormData() {
		//console.log("wprr/elements/form/Form::getFormData");
		
		return new FormData(this.getMainElement());
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/form/Form::_renderMainElement");
		
		let action = this.getFirstInput("action");
		let method = this.getFirstInput("method");
		
		return React.createElement("form", {"onSubmit": this._callback_submitBound, "action": action, "method": method}, 
			React.createElement(React.Fragment, {}, this.props.children),
			React.createElement(Wprr.FormField, {"className": "display-none", "type":"submit"})
		);
	}

}
