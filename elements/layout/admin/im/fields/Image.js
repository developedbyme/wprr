import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Image extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement("div", null,
			React.createElement(Wprr.layout.admin.im.FileDropField)
		);
	}
}