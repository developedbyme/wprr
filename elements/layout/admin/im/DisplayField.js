"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

import * as cellTypes from "./displayfields/areas.js";

//import DisplayField from "./DisplayField";
export default class DisplayField extends Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getLayout(aSlots) {
		
		let typeSource = aSlots.prop("type", Wprr.sourceReference("field", "field.type"));
		let switchableArea = Wprr.creators.SwitchableAreaCreator.getReactElementsForDynamicClasses(typeSource, aSlots.prop("cellTypes", cellTypes), "standard");
		
		return switchableArea;
	}
}
