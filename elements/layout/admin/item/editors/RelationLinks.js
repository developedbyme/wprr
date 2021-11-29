"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class EditRelation extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput(Wprr.sourceReference("item"));
		console.log(item);
		
		let groupedOutgoing = Wprr.utils.array.groupArray(Wprr.objectPath(item, "outgoingRelations.items"), "type.linkedItem.slug.value");
		let groupedIncoming = Wprr.utils.array.groupArray(Wprr.objectPath(item, "incomingRelations.items"), "type.linkedItem.slug.value");
		
		console.log(item, groupedOutgoing);
		
		return React.createElement("div", {},
			React.createElement("div", null, "Outgoing"),
				React.createElement(Wprr.layout.List, {items: groupedOutgoing},
					React.createElement("div", null,
						Wprr.text(Wprr.sourceReference("item", "id")),
						" ",
						Wprr.text(Wprr.sourceReference("loop/item", "key")),
						" ..."
					),
					React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("loop/item", "value")},
						React.createElement(Wprr.FlexRow, {className: "micro-item-spacing"},
							React.createElement("div", null,
								React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("loop/item", "to.id"))},
									Wprr.text(Wprr.sourceReference("loop/item", "to.id"))
								)
							),
							React.createElement("div", null,
								React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("loop/item", "to.linkedItem.objectTypes.items")},
									React.createElement("span", null, Wprr.text(Wprr.sourceReference("loop/item", "slug.value"))),
									React.createElement("span", {"data-slot": "spacing"}, ", ")
								)
							),
							React.createElement("div", null,
								React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/relation", "site"), "?id=", Wprr.sourceReference("loop/item", "id"))},
									"Relation ",
									Wprr.text(Wprr.sourceReference("loop/item", "id"))
								)
							),
							React.createElement("div", null,
								Wprr.text(Wprr.sourceReference("loop/item", "startAt"))
							),
							React.createElement("div", null,
								Wprr.text(Wprr.sourceReference("loop/item", "endAt"))
							)
						)
					)
				),
				React.createElement("div", null, "Incoming"),
				React.createElement(Wprr.layout.List, {items: groupedIncoming},
					React.createElement("div", null,
						"... ",
						Wprr.text(Wprr.sourceReference("loop/item", "key")),
						" ",
						Wprr.text(Wprr.sourceReference("item", "id"))
					),
					React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("loop/item", "value")},
						React.createElement(Wprr.FlexRow, {className: "micro-item-spacing"},
							React.createElement("div", null,
								React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("loop/item", "from.id"))},
									Wprr.text(Wprr.sourceReference("loop/item", "from.id"))
								)
							),
							React.createElement("div", null,
								React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("loop/item", "from.linkedItem.objectTypes.items")}, 
									React.createElement("span", null,
										Wprr.text(Wprr.sourceReference("loop/item", "slug"))
									),
									React.createElement("span", {"data-slot": "spacing"},
										", "
									)
								)
							),
							React.createElement("div", null,
							React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/relation", "site"), "?id=", Wprr.sourceReference("loop/item", "id"))},
								"Relation ",
								Wprr.text(Wprr.sourceReference("loop/item", "id"))
							)
						),
						React.createElement("div", null,
							Wprr.text(Wprr.sourceReference("loop/item", "startAt"))
						),
						React.createElement("div", null,
							Wprr.text(Wprr.sourceReference("loop/item", "endAt"))
						)
					)
				)
			)
		);
	}
}