import React from "react";
import queryString from "query-string";

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

//import InjectWpResetPasswordForm from "wprr/injections/wp/InjectWpResetPasswordForm";
export default function InjectWpResetPasswordForm(aProps) {
	
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
	
	let parsedQueryString = queryString.parse(location.search);
	
	let injectData = {
		"elements/login/accessFields": React.createElement(React.Fragment, {},
			React.createElement(FormField, {"type": "hidden", "name": "rp_login", "value": parsedQueryString["login"]}),
			React.createElement(FormField, {"type": "hidden", "name": "rp_key", "value": parsedQueryString["key"]})
		),
		"elements/login/passwordField": React.createElement(EditableProps, {"editableProps": "pass1", "pass1": ""},
			React.createElement(FormField, {"valueName": "pass1", "name": "pass1", "type": "password"})
		),
		"elements/login/submitButton": React.createElement(FormField, {"type": "submit", "value": "Submit"}),
		"elements/login/signInLink": signInLink,
		"elements/login/signUpLink": signUpLink,
		"elements/login/lostPasswordLink": lostPasswordLink,
	};
	
	return React.createElement(RefGroup, newProps,
		React.createElement(ValidatingForm, {"action": SourceData.create("combine", [SourceData.create("reference", "wprr/paths/login"), "?action=resetpass"]), "method": "POST"},
			React.createElement(ReferenceInjection, {"injectData": injectData},
				aProps.children
			)
		)
	);
}