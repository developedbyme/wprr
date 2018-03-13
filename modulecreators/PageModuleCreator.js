"use strict";

import React from "react";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

// import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
export default class PageModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.PageModuleCreator::constructor");
		
		super();
	}
	
	_getMainCompnentWithInjections() {
		return <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{super._getMainCompnentWithInjections()}
		</PostDataInjection>;
	}
	
	static create(aClass) {
		var newPageModuleCreator = new PageModuleCreator();
		newPageModuleCreator.setClass(aClass);
		
		return newPageModuleCreator;
	}
}