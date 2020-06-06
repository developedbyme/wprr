import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import ItemSpacing from "wprr/elements/form/wp/ItemSpacing";
export default class ItemSpacing extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		return React.createElement("div", {"className": "spacing small"});
	}
}