"use strict";

import React from "react";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

// import AdminModuleCreator from "wprr/modulecreators/AdminModuleCreator";
export default class AdminModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.AdminModuleCreator::constructor");
		
		super();
	}
	
	static create(aClass) {
		var newAdminModuleCreator = new AdminModuleCreator();
		newAdminModuleCreator.setClass(aClass);
		
		return newAdminModuleCreator;
	}
}