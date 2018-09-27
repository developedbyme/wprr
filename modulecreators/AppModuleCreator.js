"use strict";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

// import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";
export default class AppModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/modulecreators/AppModuleCreator::constructor");
		super();
	}
	
	static create(aClass) {
		var newAppModuleCreator = new AppModuleCreator();
		newAppModuleCreator.setClass(aClass);
		
		return newAppModuleCreator;
	}
}