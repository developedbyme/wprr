import React from "react";

import RefGroup from "wprr/reference/RefGroup";
import ValidatingForm from "wprr/elements/form/ValidatingForm";

import SourceData from "wprr/reference/SourceData";
import ReferenceInjection from "wprr/reference/ReferenceInjection";
import EditableProps from "wprr/manipulation/EditableProps";
import FormField from "wprr/elements/form/FormField";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import SourcedText from "wprr/elements/text/SourcedText";
import Link from "wprr/elements/interaction/Link";
import DeepDistribution from "wprr/manipulation/distribution/DeepDistribution";
import DistributionTarget from "wprr/manipulation/distribution/DistributionTarget";

//import InjectWpLoginForm from "wprr/injections/wp/InjectWpLoginForm";
export default function InjectWpLoginForm(aProps) {
	
	let newProps = new Object();
	
	newProps["group"] = "wpLogin";
	
	for(let objectName in aProps) {
		if(objectName !== "children") {
			newProps[objectName] = aProps[objectName];
		}
	}
	
	let lostPasswordLink = React.createElement(WprrDataLoader, {"loadData": {"link": "wprr/v1/range-item/page/relation/default?relation=global-pages/lost-password"}},
		React.createElement(DeepDistribution, {}, 
			React.createElement(DistributionTarget, {}, 
				React.createElement(Link, {"href": SourceDataWithPath.create("prop", "link", "permalink")},
					React.createElement(DistributionTarget, {}, 
						React.createElement(SourcedText, {"text": SourceDataWithPath.create("prop", "link", "title")})
					)
				)
			)
		)
	);
	
	let signUpLink = React.createElement(WprrDataLoader, {"loadData": {"link": "wprr/v1/range-item/page/relation/default?relation=global-pages/sign-up"}},
		React.createElement(DeepDistribution, {}, 
			React.createElement(DistributionTarget, {}, 
				React.createElement(Link, {"href": SourceDataWithPath.create("prop", "link", "permalink")},
					React.createElement(DistributionTarget, {}, 
						React.createElement(SourcedText, {"text": SourceDataWithPath.create("prop", "link", "title")})
					)
				)
			)
		)
	);
	
	let injectData = {
		"elements/login/usernameField": React.createElement(EditableProps, {"editableProps": "log", "log": ""},
			React.createElement(FormField, {"valueName": "log", "name": "log", "type": "text"})
		),
		"elements/login/passwordField": React.createElement(EditableProps, {"editableProps": "pwd", "pwd": ""},
			React.createElement(FormField, {"valueName": "pwd", "name": "pwd", "type": "password"})
		),
		"elements/login/submitButton": React.createElement("input", {"type": "submit", "value": "Submit"}),
		"elements/login/lostPasswordLink": lostPasswordLink,
		"elements/login/signUpLink": signUpLink,
	};
	
	return React.createElement(RefGroup, newProps,
		React.createElement(ValidatingForm, {"action": SourceData.create("reference", "wprr/paths/login"), "method": "POST"},
			React.createElement(ReferenceInjection, {"injectData": injectData},
				aProps.children
			)
		)
	);
}