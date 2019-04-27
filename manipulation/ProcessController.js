import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import ProcessController from "wprr/manipulation/ProcessController";
export default class ProcessController extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ProcessController::_removeUsedProps");
		
		delete aReturnObject["process"];
		delete aReturnObject["autoStart"];
		
		return aReturnObject;
	}
	
	componentDidMount() {
		super.componentDidMount();
		
		let autoStart = this.getSourcedProp("autoStart");
		if(autoStart !== false) {
			let process = this.getSourcedProp("process");
			process.start();
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let process = this.getSourcedProp("process");
		process.setElement(this);
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let process = this.getSourcedProp("process");
		
		let name = null;
		let prefix = "process/";
		if(name) {
			prefix += name + "/";
		}
		
		
		let injectData = new Object();
		injectData[prefix + "controller"] = process;
		injectData[prefix + "continueCommand"] = Wprr.commands.callFunction(process, process.continue);
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
	
	static createReactElement(aProcess, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"process": aProcess}, aChildOrChildren);
	}
}
