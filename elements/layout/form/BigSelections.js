import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import BigSelections from "./BigSelections";
export default class BigSelections extends Layout {

	_construct() {
		super._construct();
		
		this._addMainElementClassName("big-selections");
		
		this._layoutName = "bigSelections";
		
		this._value = Wprr.sourceValue(null);
		this.addExposedProps("value");
		this._value.input(this.getSource("value"));
	}
	
	setValue(aValue) {
		this._value.value = aValue;
		
		return this;
	}
	
	_getLayout(aSlots) {
		console.log("BigSelections::_renderMainElement");
		
		let itemValueSource = Wprr.sourceReference("loop/item", "key");
		
		let defaultLoopItem = React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this.setValue, [itemValueSource])},
			React.createElement(Wprr.Adjust, {adjust: Wprr.adjusts.condition(this._value, itemValueSource, "===", "active"), sourceUpdates: this._value},
				aSlots.default(React.createElement(Wprr.layout.form.BigSelectionBox, {title: Wprr.sourceReference("loop/item", "label"), description: Wprr.sourceReference("loop/item", "description"), className: "cursor-pointer"}))
			)
		);
		
		let loopItem = aSlots.slot("loopItem", defaultLoopItem);
		let spacing = aSlots.slot("spacing", React.createElement("div", {"className": "spacing small"}));
		
		return React.createElement("div", {className: ""},
			Wprr.Loop.createMarkupLoop(aSlots.prop("options", []), loopItem, spacing)
		);
	}
}
