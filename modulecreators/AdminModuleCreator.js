"use strict";

import React from "react";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

// import AdminModuleCreator from "wprr/modulecreators/AdminModuleCreator";
export default class AdminModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/modulecreators/AdminModuleCreator::constructor");
		
		super();
	}
	
	_configureModule(aHolderNode, aData, aModuleData) {
		//console.log("wprr/modulecreators/AdminModuleCreator::constructor");
		//console.log(aHolderNode, aData, aModuleData);
		
		super._configureModule(aHolderNode, aData, aModuleData);
		
		this._referenceHolder.addObject("wprr/adminData", aData.admin);
	}
	
	static create(aClass) {
		var newAdminModuleCreator = new AdminModuleCreator();
		newAdminModuleCreator.setClass(aClass);
		
		return newAdminModuleCreator;
	}
}