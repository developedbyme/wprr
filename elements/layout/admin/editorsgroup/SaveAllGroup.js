import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class SaveValueChanges extends Layout {
	
	_construct() {
		super._construct();
	}
	
	_getLayout(aSlots) {
		//console.log("SaveValueChanges::_getLayout");
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {"data": true, "as": "hasSaveAll"},
				aSlots.default(React.createElement("div", null, "No element set")),
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("hasSaveAll"), "checkType": "invert/default"},
				React.createElement("div", {className: "spacing standard"}),
				React.createElement(Wprr.FlexRow, {className: "justify-between"},
					React.createElement("div"),
					React.createElement(Wprr.layout.admin.editorsgroup.SaveAllChanges)
				)
			)
		);
	}
}
