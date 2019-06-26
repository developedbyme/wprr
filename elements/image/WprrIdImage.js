import React from 'react';
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";
import WprrLazyImage from "wprr/elements/image/WprrLazyImage";

//import WprrIdImage from "wprr/elements/image/WprrIdImage";
export default class WprrIdImage extends ManipulationBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getChildrenToClone() {
		
		let id = this.getSourcedProp("id");
		
		let children = super._getChildrenToClone()
		
		return [React.createElement(Wprr.DataLoader, {
			"loadData": {
				"image": this.getWprrUrl(Wprr.utils.wprrUrl.getRangeItemUrl("attachment", "attachmentStatus,idSelection", "attachment", {"ids": id})),
			},
			"nonBlocking": true
		},
			React.createElement(Wprr.HasData, {"check": Wprr.sourceProp("image")},
				React.createElement(WprrLazyImage, {"data": Wprr.sourceProp("image")}, children)
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceProp("image"), "checkType": "invert/default"},
				React.createElement("div", {}, children)
			),
		)];
	}
}
