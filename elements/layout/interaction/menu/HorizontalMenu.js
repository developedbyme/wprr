"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import HorizontalMenu from "./HorizontalMenu";
export default class HorizontalMenu extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("HorizontalMenu::constructor");

		super();
		
		this._layoutName = "horizontalMenu";
	}
	
	_getLayout(aSlots) {
		
		let menuPosition = this.getFirstInputWithDefault("menuPosition", Wprr.sourceReference("horizontalMenu/slots/menuPosition"), "top-menu");
		
		let postData = this.getFirstInput(Wprr.sourceReference("wprr/postData"));
		let sideMenuTerm = Wprr.utils.dbmContent.getSingleRelation(postData, "menu-position/" + menuPosition);
		
		let defaultMenuLocation = "top-menu_default";
		if(sideMenuTerm) {
			defaultMenuLocation = "top-menu_" + sideMenuTerm.slug;
		}
		
		let loopItem = aSlots.slot("menuItem", React.createElement(Wprr.layout.interaction.menu.HorizontalMenuItem, {"menuItem": Wprr.sourceReference("loop/item")}));
		let menuLocation = aSlots.prop("menuLocation", defaultMenuLocation);
		let loop = aSlots.prop("loop", Wprr.adjusts.markupLoop(Wprr.sourceProp("menu"), loopItem));
		
		return React.createElement("nav", {},
			aSlots.slot("loader", React.createElement(Wprr.DataLoader, {"loadData": {"menu": Wprr.sourceCombine("m-router-data/v1/menu/", menuLocation)}, "sourceUpdates": menuLocation},
				aSlots.slot("loopElement", React.createElement(Wprr.Loop, {"loop": loop},
					aSlots.default(React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"}))
				))
			))
		);
	}
}