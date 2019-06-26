import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import OnScreenCommands from "wprr/elements/interaction/OnScreenCommands";
export default class OnScreenCommands extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._isOnScreen = false;
		
		this._callback_resizeBound = this._callback_resize.bind(this);
		this._callback_scrollBound = this._callback_scroll.bind(this);
	}
	
	_callback_resize(aEvent) {
		this._checkForUpdate();
	}
	
	_callback_scroll(aEvent) {
		this._checkForUpdate();
	}
	
	_checkForUpdate() {
		let currentElement = ReactDOM.findDOMNode(this);
		
		if(currentElement) {
			let currentPosition = currentElement.getBoundingClientRect();
			
			let isInsideViewport = true;
			if(currentPosition.y+currentPosition.height < 0) {
				isInsideViewport = false;
			}
			if(currentPosition.y > window.innerHeight) {
				isInsideViewport = false;
			}
			if(currentPosition.x+currentPosition.width < 0) {
				isInsideViewport = false;
			}
			if(currentPosition.x > window.innerWidth) {
				isInsideViewport = false;
			}
			
			let percentageInside = 0;
			if(isInsideViewport) {
				let x = Math.max(0, currentPosition.x);
				let y = Math.max(0, currentPosition.y);
				let width = Math.min(window.innerWidth, currentPosition.x+currentPosition.width)-x;
				let height = Math.min(window.innerHeight, currentPosition.y+currentPosition.height)-y;
				
				percentageInside = (width*height)/(currentPosition.width*currentPosition.height);
			}
			
			if(this._isOnScreen) {
				let triggerOffAt = this.getSourcedPropWithDefault("triggerOffAt", 0);
				if(percentageInside <= triggerOffAt) {
					this._isOnScreen = false;
					let commands = this.getSourcedProp("offComamnds");
					if(commands) {
						CommandPerformer.perform(commands, false, this);
					}
				}
			}
			else {
				if(isInsideViewport) {
					let triggerOnAt = this.getSourcedPropWithDefault("triggerOnAt", 0);
					if(percentageInside >= triggerOnAt) {
						this._isOnScreen = true;
						let commands = this.getSourcedProp("onComamnds");
						if(commands) {
							CommandPerformer.perform(commands, false, this);
						}
					}
				}
			}
		}
	}
	
	componentDidMount() {
		//console.log("wprr/elements/interaction/OnScreenCommands::componentDidMount");
		
		window.addEventListener("resize", this._callback_resizeBound, false);
		window.addEventListener("scroll", this._callback_scrollBound, false);
		
		this._checkForUpdate();
	}
	
	componentWillUnmount() {
		//console.log("wprr/elements/interaction/OnScreenCommands::componentWillUnmount");
		
		window.removeEventListener("resize", this._callback_resizeBound, false);
		window.removeEventListener("scroll", this._callback_scrollBound, false);
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["onCommands"];
		delete returnObject["offCommands"];
		delete returnObject["triggerOnAt"];
		delete returnObject["triggerOffAt"];
		
		return returnObject;
	}
}