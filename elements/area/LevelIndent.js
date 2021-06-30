import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import LevelIndent from "wprr/elements/area/LevelIndent";
export default class LevelIndent extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	
	_renderMainElement() {
		
		let level = this.getFirstInputWithDefault("level", 0);
		let indent = this.getFirstInputWithDefault("indent", Wprr.sourceReferenceIfExists("level/indent"), 20);
		let indentFunction = this.getFirstInputWithDefault("indentFunction", Wprr.sourceReferenceIfExists("level/indentFunction"), LevelIndent.linearIndent);
		
		return React.createElement("div", {"style": {"width": indentFunction(level, indent)}});
	}
	
	static linearIndent(aLevel, aIndent) {
		return aLevel*aIndent;
	}
}
