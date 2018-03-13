"use strict";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

// import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
export default class PageModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.PageModuleCreator::constructor");
		
		super();
	}
		
	static create(aClass) {
		var newPageModuleCreator = new PageModuleCreator();
		newPageModuleCreator.setClass(aClass);
		
		return newPageModuleCreator;
	}
}