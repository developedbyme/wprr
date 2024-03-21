import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class Translations extends Layout {
	
	_construct() {
		super._construct();
		
		let languageLoader = this._elementTreeItem.createNode("languageLoader", "loadDataRange");
		this._elementTreeItem.getLinks("languages").input(languageLoader.item.getLinks("items"));
		languageLoader.setUrl(this.getWprrUrl("range/?select=relation&encode=type&type=type/language", "wprrData"));
	}
	
	_getLayout(aSlots) {
		//console.log("_getLayout");
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("valueEditor", "translationsEditor"), as: "translationsEditor"},
				React.createElement("div", null,
					React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")},
						React.createElement("div", null,
							React.createElement(Wprr.FlexRow, {className: "small-item-spacing flex-no-wrap", itemClasses: "flex-no-resize, flex-resize"},
								React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item"))),
								React.createElement("div", null,
									React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")]), as: "valueEditor"},
										aSlots.default( React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}))
									)
								)
							)
						),
						React.createElement("div", { "data-slot": "spacing", className: "spacing small"})
					),
					React.createElement("div", {className: "spacing small"}),
					React.createElement(Wprr.FlexRow, null,
						Wprr.DropdownSelection.createSelfContained(
							React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"},
								Wprr.idText("Add translation", "site.addTranslation")
							),
							React.createElement("div", {className: "custom-selection-menu custom-selection-menu-padding"},
								React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("languages").idsSource},
									React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
										React.createElement("div", {className: "hover-row cursor-pointer standard-row-padding"},
											Wprr.text(Wprr.sourceReference("item", "name"))
										)
									)
								)
							),
							{"className": "custom-dropdown"}
						)
					)
				)
			)
		);
	}
}
