"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import MultiStepDropdown from "./MultiStepDropdown";
export default class MultiStepDropdown extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("MultiStepDropdown::constructor");

		super();
		
		this._layoutName = "multiStepDropdown";
	}
	
	_getLayout(aSlots) {
		
		let routes = aSlots.prop("routes", [{"test": ".*", "type": "notSet", "data": {}}]);
		let switchableArea = Wprr.creators.SwitchableAreaCreator.getReactElementsForDynamicClasses(Wprr.sourceProp("type"), aSlots.prop("areaClasses", {}), "none");
		
		return React.createElement("div",
			{
				className: "multi-step-dropdown"
			},
			Wprr.DropdownSelection.createSelfContained(
				aSlots.slot("button", React.createElement(Wprr.layout.form.DropdownButton,
					{
						className: "cursor-pointer"
					},
					aSlots.slot("buttonContent", React.createElement(Wprr.InsertElement,
						{
							element: Wprr.sourceReference("dropdownButton/externalStorage", "defaults.defaultSlot")
						}))
					)
				),
				aSlots.slot("overlay", React.createElement("div",
					{
						className: "custom-selection-menu"
					},
					aSlots.slot("pathRouter", React.createElement(Wprr.EditableProps,
						{
							editableProps: "path",
							path: ""
						},
						React.createElement(Wprr.PathRouter,
							{
								routes: routes
							},
							React.createElement(Wprr.ExternalStorageProps,
								{
									props: "type",
									externalStorage: Wprr.sourceReference("pathRouter/externalStorage")
								},
								aSlots.default(switchableArea)
							)
						)
					))
				)),
				{
					"className": aSlots.prop("containerClassName", "custom-dropdown")
				}
			)
		);
	}
}