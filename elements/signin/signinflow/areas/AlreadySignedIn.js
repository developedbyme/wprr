import React from "react";
import Wprr from "wprr";

export default class Email extends Wprr.Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._nextState = Wprr.sourceValue("active");
	}
	
	_continueToNextStep() {
		//console.log("_continueToNextStep");
		//console.log(aExistingUser);
		
		this.getReference("steppedPaths").changeStep("changeEmail");
	}
	
	_logout() {
		
		let project = this.getReference("wprr/project");
		
		let loader = project.getLogoutLoader();
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._continueToNextStep, []));
		
		loader.addSuccessCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		loader.addErrorCommand(Wprr.commands.setProperty(this._nextState.reSource(), "value", this._nextState.value));
		this._nextState.value = "inactive";
		
		loader.load();
	}
	
	_getLayout(aSlots) {
		
		let currentStep = aSlots.prop("currentStep", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.currentStep"), 1));
		let numberOfSteps = aSlots.prop("numberOfSteps", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.numberOfSteps"), 2));
		
		let previousCommands = aSlots.prop("previousCommands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.previousCommands"), Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "previousStep")));
		let nextCommands = Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "nextStep");
		
		return <div>
			<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Continue as", "site.continueAs")}>
				<div className="standard-box standard-box-padding">
					<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-no-reisze,flex-resize,flex-no-resize">
						<Wprr.Image overrideMainElementType="img" src={Wprr.source("combine", ["https://www.gravatar.com/avatar/", Wprr.sourceReference("wprr/userData", "data.gravatarHash"), "?s=64&d=mm&r=g"])} />
						<div>
							<div className="signed-in-name">
								{Wprr.text(Wprr.sourceReference("wprr/userData", "data.firstName"))}
								{" "}
								{Wprr.text(Wprr.sourceReference("wprr/userData", "data.lastName"))}
							</div>
							<div className="spacing small" />
							<div className="signed-in-email">
								{Wprr.text(Wprr.sourceReference("wprr/userData", "data.email"))}
							</div>
						</div>
						<Wprr.CommandButton commands={Wprr.commands.callFunction(this, this._logout)}>
							<div className="action-link secondary cursor-pointer">
								{Wprr.idText("Change", "site.change")}
							</div>
						</Wprr.CommandButton>
					</Wprr.FlexRow>
				</div>
			</Wprr.layout.form.LabelledArea>
			<div className="spacing standard" />
			<Wprr.SteppedNavigation currentStep={currentStep} numberOfSteps={numberOfSteps} previousState="inactive" nextState={this._nextState} previousCommands={previousCommands} nextCommands={nextCommands} />
		</div>;
	}
}
