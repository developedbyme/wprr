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
		
			return React.createElement("div", {className: "standard-box big-box-padding"},
				React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize"},
					aSlots.slot("select",
						<Wprr.Adjust adjust={Wprr.adjusts.classFromComparison(aSlots.prop("active", false), true, "===", "active")} sourceUpdates={Wprr.sourceReference("bigSelectionBox/externalStorage", "slots.active")}>
							<div className="checkmark-circle">
								<Wprr.HasData check={aSlots.useProp("active")} sourceUpdates={Wprr.sourceReference("bigSelectionBox/externalStorage", "slots.active")}>
									<Wprr.Image className="background-contain icon full-size" src="checkmark-bold-white.svg" />
								</Wprr.HasData>
							</div>
						</Wprr.Adjust>
					),
					aSlots.default(
						React.createElement("div", {},
							React.createElement("h2", {className: "standard-field-label no-margins"},
								Wprr.text(aSlots.prop("title", ""))
							),
							React.createElement("div", {className: "spacing micro"}),
							React.createElement("div", {className: "small-description"},
								Wprr.text(aSlots.prop("description", ""))
							)
						)
					)
				)
			);
	}
}
