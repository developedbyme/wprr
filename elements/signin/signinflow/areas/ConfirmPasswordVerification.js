import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import LockedField from "../LockedField";

export default class ConfirmPasswordVerification extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._shouldMoveOn = false;
		this._sendingCode = null;
		
		this._sendStatus = Wprr.sourceValue("sending");
		this._nextState = Wprr.sourceValue("inactive");
	}
	
	_continue() {
		console.log("_continue");
		
		this._shouldMoveOn = true;
		if(this._sendStatus.value === "verified") {
			this.getReference("steppedPaths").nextStep();
		}
		else {
			let verificationCode = this.getFirstInput(Wprr.sourceReference("externalStorage", "verificationCode"));
			this._nextState.value = "loading";
			if(this._sendingCode !== verificationCode) {
				this._checkCode(verificationCode);
			}
		}
	}
	
	_sendEmail() {
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("dbmtc/sendPasswordResetVerification");
		let email = this.getReference("externalStorage", "email");
		
		loader.setJsonPostBody({
			"user": email
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._emailSent, [Wprr.source("event", "raw", "data.verificationId")]));
		
		loader.load();
	}
	
	_resendEmail() {
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("dbmtc/resendPasswordResetVerification");
		let verificationId = this.getReference("externalStorage", "verificationId");
		
		loader.setJsonPostBody({
			"verificationId": verificationId,
			"sendType": "email"
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._emailSent, verificationId));
		
		this._sendStatus.value = "sending";
		loader.load();
	}
	
	_emailSent(aVerificationId) {
		console.log("_emailSent");
		console.log(aVerificationId);
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		externalStorage.updateValue("verificationId", aVerificationId);
		
		this._sendStatus.value = "normal";
	}
	
	_checkCode(aCode) {
		
		this._sendingCode = aCode;
		
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("dbmtc/verifyResetPassword");
		let email = this.getReference("externalStorage", "email");
		let verificationId = this.getReference("externalStorage", "verificationId");
		
		loader.setJsonPostBody({
			"user": email,
			"verificationId": verificationId,
			"verificationCode": aCode
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._verificationResult, [Wprr.source("event", "raw", "data.verified"), aCode]));
		
		loader.load();
	}
	
	_verificationResult(aIsVerified, aCode) {
		console.log("_verificationResult");
		console.log(aIsVerified, aCode);
		
		let verificationCode = this.getFirstInput(Wprr.sourceReference("externalStorage", "verificationCode"));
		if(verificationCode === aCode) {
			this._sendingCode = null;
			this._nextState.value = "active";
			if(aIsVerified) {
				this._sendStatus.setValue("verified");
				if(this._shouldMoveOn) {
					this.getReference("steppedPaths").nextStep();
				}
			}
			else {
				this._shouldMoveOn = false;
			}
		}
	}
	
	_updateForCodeChange() {
		console.log("_updateForCodeChange");
		
		let verificationCode = this.getFirstInput(Wprr.sourceReference("externalStorage", "verificationCode"));
		console.log(verificationCode);
		
		verificationCode = verificationCode.split(" ").join("");
		if(verificationCode.length >= 6) {
			this._nextState.setValue("active");
			this._checkCode(verificationCode);
		}
		else {
			this._nextState.setValue("inactive");
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		externalStorage.updateValue("verificationCode", "      ");
		
		externalStorage.createChangeCommands("verificationCode", this, Wprr.commands.callFunction(this, this._updateForCodeChange));
		
		this._sendEmail();
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = Wprr.commands.callFunction(this, this._continue);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(LockedField, null), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Verification")
}, /*#__PURE__*/React.createElement(Wprr.SelectSection, {
  selectedSections: this._sendStatus
}, /*#__PURE__*/React.createElement("div", {
  "data-section-name": "sending"
}, /*#__PURE__*/React.createElement("div", {
  className: "signup-verification__waiting-box"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "vertically-center-items small-item-spacing"
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  className: "verified-phone background-contain",
  src: "verified-mobile.svg"
}), Wprr.translateText("Sending verification")))), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "normal"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing justify-between"
}, /*#__PURE__*/React.createElement("div", null, Wprr.translateText("We have sent you a verification code")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this._resendEmail)
}, /*#__PURE__*/React.createElement("div", {
  className: "action-link cursor-pointer"
}, Wprr.translateText("Resend"))))), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-center"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.VerificationCode, {
  valueName: "verificationCode",
  sourceUpdates: Wprr.sourceReference("externalStorage", "vericationCode")
}))), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "verified"
}, /*#__PURE__*/React.createElement("div", {
  className: "signup-verification__verified-box"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "vertically-center-items small-item-spacing"
}, /*#__PURE__*/React.createElement("div", {
  className: "signup-verification__check-circle centered-cell-holder"
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  className: "checkmark background-contain",
  src: "checkmark-white-fat.svg"
})), Wprr.translateText("Verified")))))), /*#__PURE__*/React.createElement("div", {
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
