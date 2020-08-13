import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

// import SteppedNavigation from "wprr/elements/form/SteppedNavigation";
export default class SteppedNavigation extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._markup = null;
		this._externalStorage = new Wprr.utils.DataStorage();
	}
	
	_goBack() {
		console.log("wprr/elements/form/SteppedNavigation::_goBack");
		
		let commands = this.getSourcedProp("backCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_goForward() {
		console.log("wprr/elements/form/SteppedNavigation::_goForward");
		
		let commands = this.getSourcedProp("commands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_prepareRender() {
		let currentStep = this.getFirstInputWithDefault("currentStep", 1);
		let numberOfSteps = this.getFirstInputWithDefault("numberOfSteps", 2);
		
		let previousState = this.getFirstInputWithDefault("previousState", "inactive");
		let nextState = this.getFirstInputWithDefault("nextState", "active");
		
		this._externalStorage.updateValue("currentStep", currentStep);
		this._externalStorage.updateValue("numberOfSteps", numberOfSteps);
		this._externalStorage.updateValue("previousState", previousState);
		this._externalStorage.updateValue("nextState", nextState);
	}
	
	_getMarkup() {
		if(!this._markup) {
			
			let sharedMarkup = SteppedNavigation.getSharedMarkup();
			
			this._markup = React.createElement("div", {"className": "stepped-navigation-holder"},
				React.createElement(Wprr.ReferenceInjection,
					{"injectData": {
						"steppedNavigation": this,
						"steppedNavigation/externalStorage": this._externalStorage
					}}, 
					sharedMarkup
				)
			);
		}
		return this._markup;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/SteppedNavigation::_renderMainElement");
		
		return this._getMarkup();
	}
	
	static getSharedMarkup() {
		if(!SteppedNavigation._SHARED_MARKUP) {
			let activeButton = <Wprr.CommandButton commands={Wprr.sourceFirst(
				Wprr.sourcePropFrom(Wprr.sourceReference("steppedNavigation"), "nextCommands"),
				Wprr.sourceReferenceIfExists("steppedNavigation/nextCommands"),
				Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "nextCommands")
			)}>
				<div className="icon-button-round large">
					<Wprr.Image src="arrow-right-white.svg" className="background-contain icon-button-round-image" />
				</div>
			</Wprr.CommandButton>;
		
			let inactiveButton = <div className="icon-button-round large disabled">
				<Wprr.Image src="arrow-right-white.svg" className="background-contain icon-button-round-image" />
			</div>;
		
			let activeBackButton = <Wprr.CommandButton commands={Wprr.sourceFirst(
				Wprr.sourcePropFrom(Wprr.sourceReference("steppedNavigation"), "previousCommands"),
				Wprr.sourceReferenceIfExists("steppedNavigation/previousCommands"),
				Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "previousCommands")
			)}>
				<div className="icon-button-round outlined">
					<Wprr.Image src="arrow-left-standard.svg" className="background-contain icon-button-round-image" />
				</div>
			</Wprr.CommandButton>;
		
			let inactiveBackButton = <div className="icon-button-round outlined disabled">
				<Wprr.Image src="arrow-left-standard.svg" className="background-contain icon-button-round-image" />
			</div>;
		
			let layout = React.createElement(Wprr.FlexRow, {className: "justify-between small-item-spacing vertically-center-items", itemClasses: "width-50,flex-no-resize,width-50"},
				React.createElement(Wprr.FlexRow, {className: "justify-between"},
					React.createElement("div"),
					React.createElement(Wprr.ExternalStorageProps, {"props": "previousState", "externalStorage": Wprr.sourceReference("steppedNavigation/externalStorage")},
						React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
							Wprr.sourceReferenceIfExists("steppedNavigation/defaults", Wprr.sourceCombine("backButton.", Wprr.sourceProp("previousState"))),
							Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "backButton.default")
						)})
					)
				),
				React.createElement(Wprr.ExternalStorageProps, {"props": "nextState", "externalStorage": Wprr.sourceReference("steppedNavigation/externalStorage")},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
						Wprr.sourceReferenceIfExists("steppedNavigation/defaults", Wprr.sourceCombine("button.", Wprr.sourceProp("nextState"))),
						Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "button.default")
					)})
				),
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
					Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "loop")
				)})
			);
		
			let defaultValues = {
				"button": {
					"active": activeButton,
					"inactive": inactiveButton,
					"default": activeButton
				},
				"backButton": {
					"active": activeBackButton,
					"inactive": inactiveBackButton,
					"default": inactiveBackButton
				},
				"layout": layout,
				"loop": React.createElement(Wprr.ExternalStorageProps, {"props": "currentStep,numberOfSteps", "externalStorage": Wprr.sourceReference("steppedNavigation/externalStorage")},
					Wprr.Loop.createMarkupLoop(
						Wprr.sourceFunction(Wprr.utils.array, "createRange", [Wprr.sourceProp("currentStep"), Wprr.sourceProp("numberOfSteps")]),
						Wprr.sourceFirst(
							Wprr.sourceReferenceIfExists("steppedNavigation/elements/pagerItem"),
							Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "pagerItem")
						),
						null,
						React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
							Wprr.sourceReferenceIfExists("steppedNavigation/elements/pagerHolder"),
							Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "pagerHolder")
						)})
					)
				),
				"pagerItem": <div className="pager-circle" />,
				"pagerHolder": <Wprr.FlexRow className="micro-item-spacing" />,
				"previousCommands": Wprr.commands.callFunction(window.history, "back"),
				"nextCommands": Wprr.commands.submitForm()
			};
		
			let injectData = {
				"steppedNavigation/defaults": defaultValues
			};
		
			SteppedNavigation._SHARED_MARKUP = React.createElement(Wprr.ReferenceInjection, {"injectData": injectData}, 
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(Wprr.sourceReferenceIfExists("steppedNavigation/defaults", "layout"))})
			);
		}
		
		return SteppedNavigation._SHARED_MARKUP;
	}
}

SteppedNavigation._SHARED_MARKUP = null;
