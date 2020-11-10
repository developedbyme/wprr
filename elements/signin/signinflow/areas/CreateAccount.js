import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import LockedField from "../LockedField";

export default class ConfirmEmail extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._nextState = Wprr.sourceValue("inactive");
	}
	
	_continue() {
		console.log("_continue");
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		
		let project = this.getReference("wprr/project");
		
		let email = externalStorage.getValue("email");
		let verificationId = externalStorage.getValue("verificationId");
		
		let loader = project.getSignupLoader({
			"email": email,
			"verificationId": verificationId,
			"firstName": externalStorage.getValue("firstName"),
			"lastName": externalStorage.getValue("lastName"),
			"password": externalStorage.getValue("password"),
			"method": "fromVerification"
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._verifyCreationAndContinue, [Wprr.source("event", "raw", "data")]));
		
		loader.addSuccessCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		loader.addErrorCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		this._nextState.value = "loading";
		loader.load();
	}
	
	_verifyCreationAndContinue(aRegistrationData) {
		console.log("_verifyCreationAndContinue");
		console.log(aRegistrationData);
		
		if(aRegistrationData.registered) {
			this.getReference("steppedPaths").nextStep();
		}
		else {
			this._nextState.value = "active";
		}
	}
	
	_validateForm() {
		console.log("_validateForm");
		
		let isValid = true;
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		isValid &= externalStorage.getValue("firstName").length > 0;
		isValid &= externalStorage.getValue("lastName").length > 0;
		isValid &= externalStorage.getValue("password").length >= 6;
		
		if(this._nextState.value !== "loading") {
			this._nextState.value = isValid ? "active" : "inactive";
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		
		if(!externalStorage.getValue("firstName")) {
			externalStorage.updateValue("firstName", "");
		}
		if(!externalStorage.getValue("lastName")) {
			externalStorage.updateValue("lastName", "");
		}
		if(!externalStorage.getValue("password")) {
			externalStorage.updateValue("password", "");
		}
		
		externalStorage.createChangeCommands("firstName,lastName,password", this, Wprr.commands.callFunction(this, this._validateForm));
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = Wprr.commands.callFunction(this, this._continue);
		
		return <div>
			<LockedField />
			<div className="spacing standard" />
			<Wprr.FlexRow className="small-item-spacing halfs">
				<Wprr.layout.form.FieldWithLabel label={Wprr.sourceTranslation("First name")} valueName="firstName" />
				<Wprr.layout.form.FieldWithLabel label={Wprr.sourceTranslation("Last name")} valueName="lastName" />
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.layout.form.FieldWithLabel label={Wprr.sourceTranslation("New password")} valueName="password" fieldType="password" />
			<div className="spacing standard" />
			<Wprr.SteppedNavigation currentStep={currentStep} numberOfSteps={numberOfSteps} previousState="active" nextState={this._nextState} previousCommands={previousCommands} nextCommands={nextCommands} />
		</div>;
	}
}
