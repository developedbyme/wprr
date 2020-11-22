import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import LockedField from "../LockedField";

export default class Email extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._nextState = Wprr.sourceValue("inactive");
	}
	
	_validateForm() {
		//console.log("_validateForm");
		
		let isValid = true;
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		isValid &= Wprr.utils.validations.phoneNumber(externalStorage.getValue("phoneNumber"));
		
		if(this._nextState.value !== "loading") {
			this._nextState.value = isValid ? "active" : "inactive";
		}
	}
	
	_updatePhoneNumberToInternational() {
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		let originalPhoneNumber = externalStorage.getValue("phoneNumber");
		let phoneNumber = originalPhoneNumber;
		let defaultPrefix = externalStorage.getValue("defaultPrefix");
		
		phoneNumber = phoneNumber.replace(new RegExp("[ \\.]", "g"), "");
		
		if(phoneNumber[0] === "+") {
			//MENOTE: do nothing
		}
		else if(phoneNumber.indexOf("00") === 0) {
			phoneNumber = "+" + phoneNumber.substring(2);
		}
		else if(phoneNumber.indexOf("0") === 0) {
			phoneNumber = defaultPrefix + phoneNumber.substring(1);
		}
		else {
			phoneNumber = defaultPrefix + phoneNumber;
		}
		
		let optionalIndex = phoneNumber.indexOf("(0)");
		if(optionalIndex > -1) {
			phoneNumber = phoneNumber.substring(0, optionalIndex) + phoneNumber.substring(optionalIndex+3);
		}
		
		if(phoneNumber !== originalPhoneNumber) {
			externalStorage.updateValue("phoneNumber", phoneNumber);
		}
		
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		externalStorage.createChangeCommands("phoneNumber", this, Wprr.commands.callFunction(this, this._validateForm));
		this._validateForm();
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = [
			Wprr.commands.callFunction(this, this._updatePhoneNumberToInternational),
			Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "nextStep")
		];
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(LockedField, null), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.FieldWithLabel, {
  label: Wprr.sourceTranslation("Phone number", "site.phoneNumber"),
  valueName: "phoneNumber"
}), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.SteppedNavigation, {
  currentStep: currentStep,
  numberOfSteps: numberOfSteps,
  previousState: "inactive",
  nextState: this._nextState,
  previousCommands: previousCommands,
  nextCommands: nextCommands
}));
	}
}
