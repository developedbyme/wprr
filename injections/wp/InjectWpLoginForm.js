import React from "react";

import RefGroup from "wprr/reference/RefGroup";
import ValidatingForm from "wprr/elements/form/ValidatingForm";

import SourceData from "wprr/reference/SourceData";
import ReferenceInjection from "wprr/reference/ReferenceInjection";
import EditableProps from "wprr/manipulation/EditableProps";
import FormField from "wprr/elements/form/FormField";

//import InjectWpLoginForm from "wprr/injections/wp/InjectWpLoginForm";
export default function InjectWpLoginForm(aProps) {
	
	let newProps = new Object();
	
	newProps["group"] = "wpLogin";
	
	for(let objectName in aProps) {
		if(objectName !== "children") {
			newProps[objectName] = aProps[objectName];
		}
	}
	
	let injectData = {
		"elements/login/usernameField": React.createElement(EditableProps, {"editableProps": "log", "log": ""},
			React.createElement(FormField, {"valueName": "log", "name": "log", "type": "text"})
		),
		"elements/login/passwordField": React.createElement(EditableProps, {"editableProps": "pwd", "pwd": ""},
			React.createElement(FormField, {"valueName": "pwd", "name": "pwd", "type": "password"})
		),
		"elements/login/submitButton": React.createElement("input", {"type": "submit", "value": "Submit"})
	};
	
	return React.createElement(RefGroup, newProps,
		React.createElement(ValidatingForm, {"action": SourceData.create("reference", "wprr/paths/login"), "method": "POST"},
			React.createElement(ReferenceInjection, {"injectData": injectData},
				aProps.children
			)
		)
	);
}