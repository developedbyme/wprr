import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import objectPath from "object-path";

//import GroupedLists from "wprr/elements/layout/GroupedLists";
export default class GroupedLists extends Layout {

	constructor() {
		
		super();
		
		this._layoutName = "groupedLists";
		this.addExposedProps("groups");
	}
	
	_getLayout(aSlots) {
		
		let group = React.createElement("div", {}, 
			aSlots.slot("title",
				React.createElement("h2", {"className": ""}, aSlots.slot("titleTextElement",
					Wprr.text(Wprr.sourceReference("loop/item", "key"))
				))
			),
			aSlots.slot("titleSpacing", React.createElement("div", {"className": "spacing small"})),
			aSlots.slot("list",
				Wprr.Loop.createMarkupLoop(Wprr.sourceReference("loop/item", "value"), aSlots.slot("row",
					React.createElement("div", {"className": "row"}, aSlots.default(React.createElement("div")))
				))
			)
		);
		
		return Wprr.Loop.createMarkupLoop(aSlots.prop("groups", []), aSlots.slot("group", group), aSlots.slot("spacing", React.createElement("div", {"className": "spacing standard"})));
	}
}