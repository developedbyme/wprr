import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import MultipleBigSelections from "./MultipleBigSelections";
export default class MultipleBigSelections extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("big-selections");
		
		
		this._layoutName = "bigSelections";
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		
		
	}
	
	_getLayout(aSlots) {
		console.log("MultipleBigSelections::_renderMainElement");
		
		let externalStorageSource = aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"));
		let valueNameSource = aSlots.prop("valueName", "value");
		let valueSource = externalStorageSource.deeper(valueNameSource);
		let itemValueSource = Wprr.sourceReference("loop/item", "key");
		
		let defaultLoopItem = React.createElement(Wprr.MultipleSelectionValue, {
  fieldName: valueNameSource,
  value: itemValueSource,
  externalStorage: externalStorageSource
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.toggleValue(Wprr.sourceReference("value/selected"), "selected", Wprr.sourceProp("selected"))
}, /*#__PURE__*/React.createElement(Wprr.Adjust, {
  adjust: Wprr.adjusts.condition(Wprr.sourceProp("selected"), true, "===", "active", "not-active"),
  sourceUpdates: valueSource
}, /*#__PURE__*/React.createElement(Wprr.layout.form.BigSelectionBox, {
  title: Wprr.sourceReference("loop/item", "label"),
  description: Wprr.sourceReference("loop/item", "description"),
  className: "cursor-pointer"
}))));
		
		let loopItem = aSlots.slot("loopItem", defaultLoopItem);
		let spacing = aSlots.slot("spacing", React.createElement("div", {"className": "spacing small"}));
		
		return React.createElement("div", {className: ""},
			Wprr.Loop.createMarkupLoop(aSlots.prop("options", []), loopItem, spacing)
		);
	}
}
