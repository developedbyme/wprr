"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import AutoSizedField from "./AutoSizedField";
export default class AutoSizedField extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("AutoSizedField::constructor");
		
		super();
		
		this._layoutName = "autoSizedField";
		
		this._testSizeElement = null;
		this._value = Wprr.sourceValue("");
		this._width = Wprr.sourceValue(100);
	}
	
	get testSizeElement() {
		if(!this._testSizeElement) {
			this._testSizeElement = document.createElement("span");
			
			this._testSizeElement.style = "position: absolute; white-space: pre;";
		}
		
		return this._testSizeElement;
	}
	
	_updateWidth() {
		//console.log("_updateWidth");
		let mainElement = this.getRef("holderElement").getMainElement();
		
		let element = this.testSizeElement;
		
		element.innerText = this._value.value;
		
		mainElement.appendChild(element);
		
		let newWidth = element.offsetWidth;
		if(newWidth < 1) {
			newWidth = 100;
		}
		this._width.value = newWidth;
		
		mainElement.removeChild(element);
		
		this.updateProp("value", this._value.value);
	}
	
	_prepareRender() {
		this._value.value = this.getFirstInput("value");
	}
	
	_getLayout(aSlots) {
		
		let className = aSlots.prop("className", "autosized-field standard-field standard-field-padding");
		
		return React.createElement(Wprr.BaseObject, {"overrideMainElementType": "span", className: className, "ref": this.createRef("holderElement")},
			aSlots.default(
				React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.styleFromWidth(this._width), "sourceUpdates": this._width},
					React.createElement(Wprr.FormField, {
						"type": aSlots.prop("fieldType", "text"),
						"className": aSlots.prop("fieldClassName", "integrated-field skip-default max-full-width"),
						"value": this._value,
						"changeCommands": Wprr.commands.callFunction(this, this._updateWidth)
					})
				)
			)
		);
	}
}