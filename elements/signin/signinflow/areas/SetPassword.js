import React from "react";
import Wprr from "wprr";

import LockedField from "../LockedField";

export default class SetPassword extends Wprr.Layout {
	
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
		
		let loader = project.getActionLoader("dbmtc/setPasswordWithVerification");
		let email = this.getReference("externalStorage", "email");
		let verificationId = this.getReference("externalStorage", "verificationId");
		let password = this.getReference("externalStorage", "password");
		
		loader.setJsonPostBody({
			"user": email,
			"verificationId": verificationId,
			"password": password
		});
		
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
			let project = this.getReference("wprr/project");
			project.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
			this.getReference("steppedPaths").nextStep();
		}
		else {
			this._showErrorMessage();
		}
	}
	
	_showErrorMessage() {
		console.log("_showErrorMessage");
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
		
		return <div>
			<LockedField />
			<div className="spacing standard" />
			<Wprr.layout.form.FieldWithLabel label={Wprr.sourceTranslation("New password")} valueName="password" fieldType="password" />
			<div className="spacing standard" />
			<Wprr.SteppedNavigation currentStep={currentStep} numberOfSteps={numberOfSteps} previousState="active" nextState={this._nextState} previousCommands={previousCommands} nextCommands={nextCommands} />
		</div>;
	}
}
