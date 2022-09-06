import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import EditableProps from "wprr/manipulation/EditableProps";

import Cookies from "js-cookie";

//import CookieData from "wprr/manipulation/CookieData";
export default class CookieData extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["cookieValue"] = null;
	}
	
	trigger(aName, aValue) {
		let cookieName = this.getSourcedProp("cookieName");
		let expires = this.getSourcedPropWithDefault("expires", 365);
		
		let fullCookieName = "cookie/" + cookieName;
		
		if(aName === "propEdited/" + fullCookieName) {
			//METODO: expiery length
			Cookies.set(cookieName, aValue, {"expires": expires});
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/CookieData::_manipulateProps");
		
		delete aReturnObject["cookieName"];
		delete aReturnObject["expires"];
		delete aReturnObject["defaultValue"];
		
		return  aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElementes = super._renderMainElement();
		let injectData = new Object();
		
		let cookieName = this.getSourcedProp("cookieName");
		let cookieValue = Cookies.get(cookieName);
		if(cookieValue === undefined || cookieValue === null) {
			cookieValue = this.getSourcedProp("defaultValue");
		}
		
		let fullCookieName = "cookie/" + cookieName;
		
		injectData[fullCookieName] = cookieValue;
		injectData["trigger/propEdited/" + fullCookieName] = this;
		
		let editablePropsProps = new Object();
		editablePropsProps["editableProps"] = fullCookieName;
		editablePropsProps[fullCookieName] = cookieValue;
		
		let callArray = [EditableProps, editablePropsProps].concat(clonedElementes);
		
		let editableElement = React.createElement.apply(React, callArray)
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, editableElement);
	}
}
