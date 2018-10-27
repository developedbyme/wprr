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

//import InjectWpLostPasswordForm from "wprr/injections/wp/InjectWpLostPasswordForm";
export default function InjectWpLostPasswordForm(aProps) {
	
	let newProps = new Object();
	
	newProps["group"] = "wpLostPassword";
	
	for(let objectName in aProps) {
		if(objectName !== "children") {
			newProps[objectName] = aProps[objectName];
		}
	}
	
	let signInLink = React.createElement(WprrDataLoader, {"loadData": {"link": "wprr/v1/range-item/page/relation/default?relation=global-pages/sign-in"}},
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
		"elements/login/usernameField": React.createElement(EditableProps, {"editableProps": "user_login", "user_login": ""},
			React.createElement(FormField, {"valueName": "user_login", "name": "user_login", "type": "text"})
		),
		"elements/login/submitButton": React.createElement(FormField, {"type": "submit", "value": "Submit"}),
		"elements/login/signInLink": signInLink,
		"elements/login/signUpLink": signUpLink,
	};
	
	return React.createElement(RefGroup, newProps,
		React.createElement(ValidatingForm, {"action": SourceData.create("combine", [SourceData.create("reference", "wprr/paths/login"), "?action=lostpassword"]), "method": "POST"},
			React.createElement(ReferenceInjection, {"injectData": injectData},
				aProps.children
			)
		)
	);
}