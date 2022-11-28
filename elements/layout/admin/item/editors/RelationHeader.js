"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class RelationHeader extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput(Wprr.sourceReference("item"));
		//console.log(item);
		
		return React.createElement("div", {},
			React.createElement(Wprr.FlexRow, {"className": "small-item-spacing vertically-center-items", "itemClasses": "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("div", {},
					React.createElement(Wprr.SelectItem, {"id": Wprr.sourceReference("item", "from.id")},
						React.createElement(Wprr.FlexRow, {"className": "justify-center"},
							React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("item", "id"))},
								Wprr.text(Wprr.sourceReference("item", "id"))
							)
						),
						React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("item", "objectTypes.idsSource")},
							React.createElement("div", {"className": "standard-flag standard-flag-padding small-text"},
								Wprr.text(Wprr.sourceReference("item", "name.value")),
							),
							React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing justify-center"})
						)
					)
				),
				React.createElement("div", {"className": "standard-flag standard-flag-padding small-text"},
					Wprr.text(Wprr.sourceReference("item", "type.linkedItem.name.value")),
				),
				React.createElement("div", {},
					React.createElement(Wprr.SelectItem, {"id": Wprr.sourceReference("item", "to.id")},
						React.createElement(Wprr.FlexRow, {"className": "justify-center"},
							React.createElement(Wprr.Link, {"href": Wprr.sourceCombine(this.getWprrUrl("admin/items/item", "site"), "?id=", Wprr.sourceReference("item", "id"))},
								Wprr.text(Wprr.sourceReference("item", "id"))
							)
						),
						React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("item", "objectTypes.idsSource")},
							React.createElement("div", {"className": "standard-flag standard-flag-padding small-text"},
								Wprr.text(Wprr.sourceReference("item", "name.value")),
							),
							React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing justify-center"})
						)
					)
				)
			)
		);
	}
}