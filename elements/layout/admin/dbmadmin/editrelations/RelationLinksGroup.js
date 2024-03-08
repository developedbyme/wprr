"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

export default class RelationLinksGroup extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
	}
	
	_renderMainElement() {
		
		let direction = this.getFirstInput("direction");
		
		let relationElement = React.createElement("div", {"className": "standard-row standard-row-padding"}, 
			React.createElement(Wprr.FlexRow, {"className": "small-item-spacing", "itemClasses": "flex-resize,flex-no-resize"},
				React.createElement("div", {},
					React.createElement("div", {},
						Wprr.text(Wprr.sourceReference("item", "title"))
					),
					React.createElement("div", {"className": "spacing small"}),
					React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
						React.createElement("div", {"className": "small-description"},
							React.createElement(Wprr.Link, {"href": Wprr.sourceReference("projectLinks", Wprr.sourceCombine("wp/site/admin/items/item/?id=", Wprr.sourceReference("item", "id")))}, 
								Wprr.text(Wprr.sourceReference("item", "id"))
							)
						),
						React.createElement("div", {"className": "small-description"},
							React.createElement(Wprr.Link, {"href": Wprr.sourceReference("projectLinks", Wprr.sourceCombine("wp/site/admin/items/realtion/?id=", Wprr.sourceReference("relation", "id")))}, 
								"Relation ",
								Wprr.text(Wprr.sourceReference("relation", "id"))
							)
						)
					)
				),
				React.createElement("div", {},
					React.createElement(Wprr.FlexRow, {"className": "micro-item-spacing"},
						React.createElement("div", {},
							React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("relation", "startAt"), "checkType": "positiveValue"},
								React.createElement(Wprr.DateDisplay, {"date": Wprr.sourceReference("relation", "startAt"), "format": "Y-MM-DD HH:mm:ss", "inputType": "php"})
							)
						),
						React.createElement("div", {}, ">"),
						React.createElement("div", {},
							React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("relation", "endAt"), "checkType": "positiveValue"},
								React.createElement(Wprr.DateDisplay, {"date": Wprr.sourceReference("relation", "endAt"), "format": "Y-MM-DD HH:mm:ss", "inputType": "php"})
							)
						)
					)
				)
			)
		);
		
		let relationGroupElement = React.createElement("div", {},
			React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.toggleValue(Wprr.sourceReference("relationGroup"), "open", Wprr.sourceReference("relationGroup", "open"), [true, false])},
				React.createElement("div", {"className": "standard-row-padding cursor-pointer"},
					React.createElement(Wprr.FlexRow, {"className": "small-item-spacing", "itemClasses": "flex-resize,flex-no-resize"},
						React.createElement(Wprr.FlexRow, {"className": "micro-item-spacing"},
							React.createElement(Wprr.BaseObject, {"style": Wprr.sourceReference("relationGroup", "arrowAnimation.linkedItem.style")},
								">"
							),
							Wprr.text(Wprr.sourceReference("relationGroup", "type.linkedItem.slug"))
						),
						Wprr.text(Wprr.sourceReference("relationGroup", "relations.ids.length"))
					)
				)
			),
			React.createElement(Wprr.OpenCloseExpandableArea, {"open": Wprr.sourceReference("relationGroup", "open")},
				React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("relationGroup", "relations.idsSource"), "as": "relation", "className": "standard-alternating-rows"},
					React.createElement(Wprr.SelectItem, {"id": Wprr.sourceReference("relation", Wprr.sourceCombine(Wprr.sourceReference("direction"), ".id"))},
						relationElement
					)
				)
			)
		);
		
		let groupElement = React.createElement("div", {},
			React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.toggleValue(Wprr.sourceReference("group"), "open", Wprr.sourceReference("group", "open"), [true, false])},
				React.createElement("div", {"className": "standard-row-padding cursor-pointer"},
					React.createElement(Wprr.FlexRow, {"className": "small-item-spacing", "itemClasses": "flex-resize,flex-no-resize"},
						React.createElement(Wprr.FlexRow, {"className": "micro-item-spacing"},
							React.createElement(Wprr.BaseObject, {"style": Wprr.sourceReference("group", "arrowAnimation.linkedItem.style")},
								">"
							),
							Wprr.text(Wprr.sourceReference("group", "name"))
						),
						Wprr.text(Wprr.sourceReference("group", "relations.ids.length"))
					)
				)
			),
			React.createElement(Wprr.OpenCloseExpandableArea, {"open": Wprr.sourceReference("group", "open")},
				React.createElement("div", {},
					React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("group", "relationGroups.idsSource"), "as": "relationGroup"},
						relationGroupElement
					)
				)
			)
		);
		
		return React.createElement("div", {},
			React.createElement(Wprr.AddReference, {"data": direction, "as": "direction"},
				groupElement
			)
		);
	}
}