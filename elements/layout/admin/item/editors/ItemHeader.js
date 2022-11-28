"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class ItemHeader extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput(Wprr.sourceReference("item"));
		//console.log(item);
		
		return React.createElement("div", {},
			React.createElement(Wprr.FlexRow, {"className": "small-item-spacing", "itemClasses": "flex-resize,flex-no-resize"},
				React.createElement("div", {},
					React.createElement("h1", {"className": "no-margins"},
						Wprr.text(Wprr.sourceReference("item", "title.value"))
					),
					React.createElement(Wprr.FlexRow, {"className": "small-item-spacing vertically-center-items"},
						React.createElement("div", {},
							Wprr.text(Wprr.sourceReference("item", "id"))
						),
						React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("item", "objectTypes.idsSource")},
							React.createElement("div", {"className": "standard-flag standard-flag-padding small-text"},
								Wprr.text(Wprr.sourceReference("item", "name.value")),
							),
							React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing"})
						)
					)
				),
				React.createElement("div", {},
					Wprr.text(Wprr.sourceReference("item", "postStatus.value"))
				)
			)
		);
	}
}