import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import InternalMessageGroupInjection from "wprr/manipulation/InternalMessageGroupInjection";
export default class InternalMessageGroupInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		//console.log(Wprr.utils.wp);
		
		this._messageGroup = new Wprr.utils.wp.dbmcontent.im.InternalMessageGroup();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/InternalMessageGroupInjection::_removeUsedProps");
		
		delete aReturnObject["data"];
		
		return aReturnObject;
	}
	
	_prepareInitialRender() {
		//console.log("wprr/manipulation/InternalMessageGroupInjection::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let data = this.getFirstInput("data");
		//console.log(data);
		
		this._messageGroup.setupFields(data.fields);
		//console.log(this._messageGroup);
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = new Object();
		injectData["messageGroup"] = this._messageGroup;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}
