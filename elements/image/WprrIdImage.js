import React from 'react';
import Wprr from "wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";
import WprrLazyImage from "wprr/elements/image/WprrLazyImage";

//import WprrIdImage from "wprr/elements/image/WprrIdImage";
export default class WprrIdImage extends ManipulationBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getChildrenToClone() {
		
		let id = this.getSourcedProp("id");
		
		return [React.createElement(Wprr.DataLoader, {"loadData": {"image": this.getWprrUrl(Wprr.utils.wprrUrl.getRangeItemUrl("attachment", "attachmentStatus,idSelection", "attachment", {"ids": id}))}},
			React.createElement(WprrLazyImage, {"data": Wprr.sourceProp("image")}, super._getChildrenToClone())
		)];
	}
}
