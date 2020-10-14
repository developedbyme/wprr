import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import OptionsBar from "./OptionsBar";
export default class OptionsBar extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("options-bar");
		
		
		this._layoutName = "optionsBar";
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		
		
	}
	
	_getLayout(aSlots) {
		console.log("OptionsBar::_renderMainElement");
		
		let externalStorageSource = aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"));
		let valueNameSource = aSlots.prop("valueName", "value");
		let valueSource = externalStorageSource.deeper(valueNameSource);
		let itemValueSource = Wprr.sourceReference("loop/item", "key");
		
		let defaultLoopItem = React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.setValue(externalStorageSource, valueNameSource, itemValueSource)
}, /*#__PURE__*/React.createElement(Wprr.Adjust, {
  adjust: Wprr.adjusts.classFromComparison(valueSource, itemValueSource, "===", "active", "not-active"),
  sourceUpdates: valueSource
}, /*#__PURE__*/React.createElement("div", {
  className: "option options-bar-padding text-align-center cursor-pointer flex-resize"
}, Wprr.text(Wprr.sourceReference("loop/item", "label")))));
		
		let loopItem = aSlots.slot("loopItem", defaultLoopItem);
		let spacing = aSlots.slot("spacing", React.createElement("div", {"className": "vertical-spacer-line flex-no-resize"}));
		
		return React.createElement("div", {className: ""},
			Wprr.Loop.createMarkupLoop(aSlots.prop("options", []), loopItem, spacing, React.createElement(Wprr.FlexRow, {"itemHolderType": Wprr.AddProps, "className": "uniform-item"}))
		);
	}
}
