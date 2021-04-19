import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import BigSelectionBox from "./BigSelectionBox";
export default class BigSelectionBox extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("big-selection-box");
		
		
		this._layoutName = "bigSelectionBox";
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		
		
	}
	
	_getLayout(aSlots) {
		console.log("BigSelectionBox::_renderMainElement");
		
		let descriptionSource = aSlots.prop("description", "");
		
			return React.createElement("div", {className: "standard-box big-box-padding"},
				React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize"},
					aSlots.slot("select",
		React.createElement(Wprr.Adjust, {
		  adjust: Wprr.adjusts.classFromComparison(aSlots.prop("active", false), true, "===", "active"),
		  sourceUpdates: Wprr.sourceReference("bigSelectionBox/externalStorage", "slots.active")
		}, /*#__PURE__*/React.createElement("div", {
		  className: "checkmark-circle checkmark-circle-padding"
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: aSlots.useProp("active"),
		  sourceUpdates: Wprr.sourceReference("bigSelectionBox/externalStorage", "slots.active")
		}, /*#__PURE__*/React.createElement(Wprr.Image, {
		  className: "background-contain icon full-size",
		  src: "checkmark-bold-white.svg"
		}))))
					),
					aSlots.default(
						React.createElement("div", {},
							React.createElement("h2", {className: "standard-field-label no-margins"},
								Wprr.text(aSlots.prop("title", ""))
							),
							React.createElement(Wprr.HasData, {"check": descriptionSource, "checkType": "notEmpty"},
								React.createElement("div", {className: "spacing micro"}),
								React.createElement("div", {className: "small-description no-paragraph-margins-around"},
									Wprr.text(aSlots.prop("description", ""), "html")
								)
							)
						)
					)
				)
			);
	}
}
