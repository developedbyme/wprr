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
		
		let backState = this.getFirstInputWithDefault("backState", "inactive");
		let state = this.getFirstInputWithDefault("state", "active");
		
		this._externalStorage.updateValue("currentStep", currentStep);
		this._externalStorage.updateValue("numberOfSteps", numberOfSteps);
		this._externalStorage.updateValue("backState", backState);
		this._externalStorage.updateValue("state", state);
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
			let activeButton = <Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("steppedNavigation"), "_goForward", [])}>
				<div className="icon-button-round large">
					<Wprr.Image src="arrow-right-white.svg" className="background-contain icon-button-round-image" />
				</div>
			</Wprr.CommandButton>;
		
			let inactiveButton = <div className="icon-button-round large disabled">
				<Wprr.Image src="arrow-right-white.svg" className="background-contain icon-button-round-image" />
			</div>;
		
			let activeBackButton = <Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("steppedNavigation"), "_goBack", [])}>
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
					React.createElement(Wprr.ExternalStorageProps, {"props": "backState", "externalStorage": Wprr.sourceReference("steppedNavigation/externalStorage")},
						React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
							Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", Wprr.sourceCombine("backButton.", Wprr.sourceProp("backState"))),
							Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", "backButton.default")
						)})
					)
				),
				React.createElement(Wprr.ExternalStorageProps, {"props": "state", "externalStorage": Wprr.sourceReference("steppedNavigation/externalStorage")},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
						Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", Wprr.sourceCombine("button.", Wprr.sourceProp("state"))),
						Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", "button.default")
					)})
				),
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(
					Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", "loop")
				)})
			);
		
			let defaultElements = {
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
					Wprr.Loop.createMarkupLoop(Wprr.utils.array.createRange(Wprr.sourceProp("currentStep"), Wprr.sourceProp("numberOfSteps")), <div className="pager-circle" />, null, <Wprr.FlexRow className="micro-item-spacing" />)
				)
			};
		
			let injectData = {
				"steppedNavigation/defaultElements": defaultElements
			};
		
			SteppedNavigation._SHARED_MARKUP = React.createElement(Wprr.ReferenceInjection, {"injectData": injectData}, 
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(Wprr.sourceReferenceIfExists("steppedNavigation/defaultElements", "layout"))})
			);
		}
		
		return SteppedNavigation._SHARED_MARKUP;
	}
}

SteppedNavigation._SHARED_MARKUP = null;
