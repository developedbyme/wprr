import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import BlockedArea from "wprr/elements/area/BlockedArea";
export default class BlockedArea extends WprrBaseObject {

	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		
		return React.createElement("div", {"className": "absolute-container"},
			React.createElement("div", {"className": "position-relative"},
				React.createElement(Wprr.ContentsAndInjectedComponents, {content: Wprr.sourceReference("blockData", "innerMarkup")})
			),
			React.createElement("div", {"className": "absolute-overlay"},
				React.createElement("div", {"className": "full-size blocked-area-overlay"}),
				React.createElement("div", {"className": "absolute-overlay centered-cell-holder"},
					React.createElement("div", {"className": "section-no-available-text"}, Wprr.idText("You don't have access to this content", "site.blockedContent"))
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null,
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", { className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("Blocked area")),
				React.createElement("hr", {className: "line no-margin"})
			),
			React.createElement(wp.editor.InnerBlocks, null),
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", {className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("End:"), " ", Wprr.translateText("Blocked area")),
				React.createElement("hr", {className: "line no-margin"})
			)
		);
	}
}
