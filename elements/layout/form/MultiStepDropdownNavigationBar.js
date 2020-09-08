"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import MultiStepDropdownNavigationBar from "./MultiStepDropdownNavigationBar";
export default class MultiStepDropdownNavigationBar extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("MultiStepDropdownNavigationBar::constructor");

		super();
		
		this._layoutName = "multiStepDropdownNavigationBar";
	}
	
	_getLayout(aSlots) {
		
		let pathRouterSource = Wprr.sourceReference("pathRouter/externalStorage");
		let pathSource = pathRouterSource.deeper("path");
		let levelUpSource = Wprr.sourceFunction(MultiStepDropdownNavigationBar, MultiStepDropdownNavigationBar._getLevelUpPath, [pathSource]);
		
		let pathStorageSource = Wprr.sourceReference("value/path");
		let upCommand = Wprr.commands.setValue(pathStorageSource, "path", levelUpSource);
		

		return React.createElement(Wprr.HasData, {check: pathSource, checkType: "notEmpty"},
			React.createElement("div", {className: "multi-step-dropdown-navigation-bar multi-step-dropdown-navigation-bar-padding"},
				React.createElement(Wprr.CommandButton, {commands: upCommand},
					React.createElement("div", {className: "cursor-pointer"},
						React.createElement(Wprr.FlexRow, {className: "pixel-item-spacing"},
							"<",
							Wprr.text(aSlots.prop("text", Wprr.sourceTranslation("Back")))
						)
					)
				)
			)
		);
	}
	
	static _getLevelUpPath(aPath) {
		let pathArray = aPath.split("/");
		
		pathArray.pop();
		
		return pathArray.join("/")
	}
}