import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import Indent from "wprr/elements/form/wp/Indent";
export default class Indent extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		
		let indent = this.getFirstInput("indent");
		let range = Wprr.utils.array.createRange(1, indent);
		
		
		let indentElement = React.createElement("div", {"className": "terms-tree-indent"});
		let flexRow = React.createElement(Wprr.FlexRow, {"classes": "flex-no-wrap"});
		
		return Wprr.Loop.createMarkupLoop(range, indentElement, null, flexRow);
	}
}