"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import VerificationCode from "./VerificationCode";
export default class VerificationCode extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("VerificationCode::constructor");
		
		super();
		
		this._layoutName = "verificationCode";
		
		this._digits = new Array();
		
		for(let i = 0; i < 6; i++) {
			this._digits.push(Wprr.sourceValue(""));
		}
	}
	
	_replaceCharacter(aText, aIndex, aNewCharacter) {
		console.log("_replaceCharacter");
		console.log(aText, aIndex, aNewCharacter);
		
		let length = aNewCharacter.length;
		
		return aText.substring(0, aIndex) + aNewCharacter + aText.substring(aIndex+length);
	}
	
	_fieldUpdated(aIndex, aNewValue) {
		console.log("_fieldUpdated");
		console.log(aIndex, aNewValue);
		
		let digitRegExp = new RegExp("[^0-9]+", "g");
		aNewValue = aNewValue.replace(digitRegExp, "");
		
		let valueName = this.getFirstInputWithDefault("valueName", "value");
		let externalStrorage = this.getFirstInput("externalStorage", Wprr.sourceReference("externalStorage"));
		let currentValue = this.getFirstInput("value", Wprr.sourceStatic(externalStrorage).deeper(valueName));
		if(!currentValue) {
			currentValue = "      ";
		}
		
		console.log(currentValue);
		
		let newValue = currentValue;
		let nextIndex = -1;
		
		if(aNewValue.length === 1) {
			newValue = this._replaceCharacter(newValue, aIndex, aNewValue);
			nextIndex = aIndex+aNewValue.length;
		}
		else if(aNewValue.length === 0) {
			newValue = this._replaceCharacter(newValue, aIndex, " ");
		}
		else {
			let numberOfChanges = Math.min(aNewValue.length, 6-aIndex);
			for(let i = 0; i < numberOfChanges; i++) {
				newValue = this._replaceCharacter(newValue, aIndex+i, aNewValue[i]);
			}
			nextIndex = aIndex+numberOfChanges;
		}
		
		console.log(">>");
		console.log(newValue);
		
		externalStrorage.updateValue(valueName, newValue);
		
		if(nextIndex >= 0) {
			if(nextIndex < 6) {
				let nextRef = this.getRef("digit" + nextIndex);
				nextRef.getMainElement().focus();
			}
			else {
				let currentRef = this.getRef("digit" + aIndex);
				currentRef.getMainElement().blur();
			}
		}
	}
	
	_setFocusToField(aField) {
		let element = aField.getMainElement();
		if(element) {
			element.setSelectionRange(0, 1);
		}
	}
	
	_prepareRender() {
		
		super._prepareRender();
		
		let valueName = this.getFirstInputWithDefault("valueName", "value");
		let externalStrorage = this.getFirstInput("externalStorage", Wprr.sourceReference("externalStorage"));
		let currentValue = this.getFirstInput("value", Wprr.sourceStatic(externalStrorage).deeper(valueName));
		
		if(!currentValue) {
			currentValue = "      ";
		}
		
		let currentArray = this._digits;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentDigit = currentArray[i];
			let currentCharValue = currentValue[i];
			if(currentCharValue === " ") {
				currentDigit.setValue("");
			}
			else {
				currentDigit.setValue(currentCharValue);
			}
		}
	}
	
	_getLayout(aSlots) {
		
		let valueNameProp = aSlots.prop("valueName", "value");
		let externalStorageSource = aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"));
		
		return React.createElement("div", {className: "verification-code"},
			React.createElement("div", {className: "verification-code-box"},
				React.createElement(Wprr.FormField, {
					value: this._digits[0],
					ref: this.createRef("digit0"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [0, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				}),
				React.createElement(Wprr.FormField, {
					value: this._digits[1],
					ref: this.createRef("digit1"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [1, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				}),
				React.createElement(Wprr.FormField, {
					value: this._digits[2],
					ref: this.createRef("digit2"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [2, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				}),
				React.createElement(Wprr.FormField, {
					value: this._digits[3],
					ref: this.createRef("digit3"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [3, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				}),
				React.createElement(Wprr.FormField, {
					value: this._digits[4],
					ref: this.createRef("digit4"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [4, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				}),
				React.createElement(Wprr.FormField, {
					value: this._digits[5],
					ref: this.createRef("digit5"),
					autoComplete: "off",
					className: "verification-code-box-digit-field",
					changeCommands: Wprr.commands.callFunction(this, this._fieldUpdated, [5, Wprr.sourceEvent()]),
					focusCommands: Wprr.commands.callFunction(this, this._setFocusToField, [Wprr.source("commandElement")])
				})
			)
		);
	}
}