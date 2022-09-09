"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "../Layout";

// import Menu from "./Menu";
export default class Menu extends Layout {

	/**
	 * Constructor
	 */
	_construct() {
		//console.log("Menu::constructor");

		super._construct();
		
		this._layoutName = "menu";
		
		let menuLocation = this.getFirstInput("location");
		
		this._elementTreeItem.requireValue("loaded", false);
		
		let loader = this._elementTreeItem.addNode("menuLoader", new Wprr.utils.data.nodes.LoadDataRange());
		loader.setUrl(this.getWprrUrl("range/?select=menu&encode=menuItem&location=" + menuLocation, "wprrData"));
		
		this._elementTreeItem.getType("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._loaded));
		this._elementTreeItem.getType("loaded").input(loader.item.getType("loaded"));
		
		this._elementTreeItem.getLinks("menuItems").input(loader.item.getLinks("items"));
		
		let filteredList = this._elementTreeItem.addNode("filteredList", new Wprr.utils.data.multitypeitems.controllers.list.FilteredList());
		filteredList.addFieldCompare("parent.id", 0);
		filteredList.item.getLinks("all").input(this._elementTreeItem.getLinks("menuItems"));
		
		let sortedList = this._elementTreeItem.addNode("sortedList", new Wprr.utils.data.multitypeitems.controllers.list.SortedList());
		sortedList.addFieldSort("order.value");
		sortedList.item.getLinks("all").input(filteredList.item.getLinks("filtered"));
		
		this._elementTreeItem.getLinks("topLevelMenuItems").input(sortedList.item.getLinks("sorted"));
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "menu"},
			aSlots.slot("loopElement",
				React.createElement(Wprr.Loop,
					{
						loop: Wprr.adjusts.markupLoop(
							this._elementTreeItem.getLinks("topLevelMenuItems").idsSource,
							aSlots.source("itemInjection",
								React.createElement(Wprr.SelectItem, {id: Wprr.sourceReference("loop/item"), as: aSlots.prop("as", "item")},
									aSlots.default(
										React.createElement("div", null, "No menu item set")
									)
								)
							),
							aSlots.source("spacing", null)
						).setInput("keyField", []),
						sourceUpdates: this._elementTreeItem.getLinks("topLevelMenuItems").idsSource
					},
					aSlots.slot("insertElements",
						React.createElement(Wprr.InjectChildren, null)
					)
				)
			)
		);
	}
}
