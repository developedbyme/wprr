import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class Email extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._nextState = Wprr.sourceValue("inactive");
	}
	
	_validateForm() {
		//console.log("_validateForm");
		
		let isValid = true;
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		isValid &= Wprr.utils.validations.isEmail(externalStorage.getValue("email"));
		
		if(this._nextState.value !== "loading") {
			this._nextState.value = isValid ? "active" : "inactive";
		}
	}
	
	_continue() {
		//console.log("_continue");
		
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("has-user");
		let email = this.getReference("externalStorage", "email");
		
		loader.setJsonPostBody({
			"email": email
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._continueToNextStep, [Wprr.sourceEvent("data.hasUser")]));
		
		loader.addSuccessCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		loader.addErrorCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		this._nextState.value = "loading";
		
		loader.load();
	}
	
	_continueToNextStep(aExistingUser) {
		//console.log("_continueToNextStep");
		//console.log(aExistingUser);
		
		let nextStep = "new";
		if(aExistingUser) {
			nextStep = "existing";
		}
		
		this.getReference("steppedPaths").changeStep(nextStep);
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("externalStorage"));
		externalStorage.createChangeCommands("email", this, Wprr.commands.callFunction(this, this._validateForm));
		this._validateForm();
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = Wprr.commands.callFunction(this, this._continue);
		
		//METODO: block submit with enter if not valid
		
		return <div>
			<Wprr.ValidatingForm submitCommands={nextCommands}>
				<Wprr.layout.form.FieldWithLabel label={Wprr.sourceTranslation("Email", "site.email")} valueName="email" />
				<div className="spacing standard" />
				<Wprr.SteppedNavigation currentStep={currentStep} numberOfSteps={numberOfSteps} previousState="inactive" nextState={this._nextState} previousCommands={previousCommands} nextCommands={Wprr.commands.submitForm()} />
			</Wprr.ValidatingForm>
		</div>;
	}
}
