import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

//import LoaderDisplay from "./LoaderDisplay";
export default class LoaderDisplay extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("loader-display");
		
		
		this._layoutName = "loaderDisplay";
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		
		
	}
	
	_getLayout(aSlots) {
		console.log("BigSelections::_renderMainElement");
		
		return React.createElement("div", {className: "loader-padding"},
			React.createElement(Wprr.FlexRow, {className: "justify-center micro-item-spacing vertically-center-items"},
				aSlots.slot("spinner", React.createElement(Wprr.Image, {"src": "loader.svg", "className": "background-contain loader-spinner", "location": "images"})),
				aSlots.slot("textElement", Wprr.text(aSlots.prop("text", Wprr.sourceTranslation("Loading...", "site.loading"))))
			)
		);
	}
}
