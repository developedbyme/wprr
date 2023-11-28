import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

//import CheckPageRedirect from "wprr/elements/layout/CheckPageRedirect";
export default class CheckPageRedirect extends Layout {

	_construct() {
		
		super._construct();
		
		this._layoutName = "checkPageRedirect";
		
		this._elementTreeItem.setValue("allowed", true);
		
		let pageItem = this.getFirstInput(Wprr.sourceReference("wprr/pageItem"));
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		let userData = project.getUserData();
		
		//console.log(pageItem, userData);
	}
	
	_getLayout(aSlots) {
		//console.log("CheckPageRedirect::_getLayout");
		
		return React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("allowed")},
			aSlots.default(React.createElement("div", {}, "No child element"))
		);
	}
}