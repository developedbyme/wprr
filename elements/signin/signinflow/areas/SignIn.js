import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import LockedField from "../LockedField";

export default class SignIn extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._nextState = Wprr.sourceValue("inactive");
	}
	
	_validateForm() {
		//console.log("_validateForm");
		
		let isValid = true;
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		isValid &= externalStorage.getValue("password").length > 0;
		
		if(this._nextState.value !== "loading") {
			this._nextState.value = isValid ? "active" : "inactive";
		}
	}
	
	_continue() {
		//console.log("_continue");
		
		let project = this.getReference("wprr/project");
		
		
		let email = this.getReference("externalStorage", "email");
		let password = this.getReference("externalStorage", "password");
		let remember = this.getReference("externalStorage", "remember");
		
		let loader = project.getLoginLoader(email, password, remember);
		
		loader.addErrorCommand(Wprr.commands.callFunction(this, this._showErrorMessage, []));
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._continueToNextStep, [Wprr.sourceEvent("data")]));
		
		loader.addSuccessCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		loader.addErrorCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		this._nextState.value = "loading";
		loader.load();
	}
	
	_continueToNextStep(aData) {
		//console.log("_continueToNextStep");
		//console.log(aData);
		
		if(aData.authenticated) {
			this.getReference("steppedPaths").nextStep();
		}
		else {
			this._showErrorMessage();
		}
	}
	
	_showErrorMessage() {
		console.log("_showErrorMessage");
		
		//METODO
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		externalStorage.createChangeCommands("password", this, Wprr.commands.callFunction(this, this._validateForm));
		this._validateForm();
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = Wprr.commands.callFunction(this, this._continue);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(LockedField, null), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.FieldWithLabel, {
  label: Wprr.sourceTranslation("Password"),
  valueName: "password",
  fieldType: "password"
}), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "pixel-item-spacing vertically-center-items"
}, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  props: "remember",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  valueName: "remember"
})), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, Wprr.translateText("Remember me"))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "changeStep", ["resetPassword"])
}, /*#__PURE__*/React.createElement("div", {
  className: "action-link cursor-pointer"
}, Wprr.translateText("Lost password")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.SteppedNavigation, {
  currentStep: currentStep,
  numberOfSteps: numberOfSteps,
  previousState: "active",
  nextState: this._nextState,
  previousCommands: previousCommands,
  nextCommands: nextCommands
}));
	}
}
