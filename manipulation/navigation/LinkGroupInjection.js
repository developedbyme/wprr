import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DataStorage from "wprr/utils/DataStorage";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import LinkGroupInjection from "wprr/manipulation/navigation/LinkGroupInjection";
export default class LinkGroupInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._linkGroup = new Wprr.utils.LinkGroup();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("LinkGroupInjection::_removeUsedProps");
		
		delete aReturnObject["linkGroups"];
		delete aReturnObject["linkGroupName"];
		delete aReturnObject["initialParameters"];
		
		return aReturnObject;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let initialValues = this.getSourcedProp("initialVariables");
		if(initialValues) {
			for(let objectName in initialValues) {
				this._linkGroup.setInput(objectName, this.resolveSourcedData(initialValues[objectName]));
			}
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let linkGroupName = this.getSourcedPropWithDefault("linkGroupName", "linkGroup");
		
		this._linkGroup.setLinks(this.getFirstInput("linkGroups"));
		
		let injectData = new Object();
		injectData[linkGroupName] = this._linkGroup;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
	
	static createReactElement(aLinkGroupName, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"linkGroupName": aLinkGroupName}, aChildOrChildren);
	}
}
