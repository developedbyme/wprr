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
		
		console.log("vwve>>>>", switchableArea)
		
		
		return <div className="multi-step-dropdown">
			{Wprr.DropdownSelection.createSelfContained(
				aSlots.slot("button", <Wprr.layout.form.DropdownButton className="cursor-pointer">
					{aSlots.slot("buttonContent", <Wprr.InsertElement element={Wprr.sourceReference("dropdownButton/externalStorage", "defaults.defaultSlot")} />)}
				</Wprr.layout.form.DropdownButton>),
				aSlots.slot("overlay",
					<div className="custom-selection-menu">
						{aSlots.slot("pathRouter", 
							<Wprr.EditableProps editableProps="path" path="">
								<Wprr.PathRouter routes={routes}>
									<Wprr.ExternalStorageProps props="type" externalStorage={Wprr.sourceReference("pathRouter/externalStorage")}>
										{aSlots.default(switchableArea)}
									</Wprr.ExternalStorageProps>
								</Wprr.PathRouter>
							</Wprr.EditableProps>
						)}
					</div>
				),
				{"className": aSlots.prop("containerClassName", "custom-dropdown")}
			)}
		</div>;
	}
}