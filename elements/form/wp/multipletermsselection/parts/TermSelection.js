import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import Parts from "./parts-circular.js";

// import TermSelection from "wprr/elements/form/wp/TermSelection";
export default class TermSelection extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		
		let term = this.getFirstInput("term");
		
		let id = term.id;
		
		return React.createElement(Wprr.FlexRow, {"className": "flex-no-wrap", "itemClasses": "flex-no-resize,flex-resize"},
			React.createElement(Parts.Indent, {"indent": Wprr.sourceReference("indent")}),
			React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
				React.createElement(Wprr.AddProps, {"selectionValue": id},
					React.createElement(Parts.Selection, {})
				),
				React.createElement(Wprr.TranslationOrId, {"id": term.slug, "prefix": Wprr.sourceReferenceIfExists("termTranslationPath"), "defaultText": term.name})
			)
		);
	}
}