"use strict";

import React from "react";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
import FirstMatchingRoute from "wprr/routing/FirstMatchingRoute";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import WpConditional from "wprr/routing/qualification/wp/WpConditional";
import WpData from "wprr/routing/qualification/wp/WpData";

// import RoutingModuleCreator from "wprr/modulecreators/RoutingModuleCreator";
export default class RoutingModuleCreator extends ModuleCreatorBaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("oa.RoutingModuleCreator::constructor");
		
		//METODO: all routing factory funcitonlaity should be broken out to a separate class
		
		super();
		
		this._routes = new Array();
		
		this._header = null;
		this._footer = null;
	}
	
	setHeader(aReactComponent) {
		this._header = aReactComponent;
		
		return this;
	}
	
	setFooter(aReactComponent) {
		this._footer = aReactComponent;
		
		return this;
	}
	
	createRoute(aQualifier, aReactComponent) {
		this._routes.push(<route key={"route-" + this._routes.length} qualify={aQualifier}>
			{aReactComponent}
		</route>);
	}
	
	createPageTemplateRoute(aPageTemplatePath, aReactComponent) {
		
		let componentWithInjectsions = <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{aReactComponent}
		</PostDataInjection>;
		
		this.createRoute(WpData.createForPageTemplate(aPageTemplatePath), componentWithInjectsions);
	}
	
	createSingularRoute(aReactComponent) {
		let componentWithInjectsions = <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{aReactComponent}
		</PostDataInjection>;

		this.createRoute(WpConditional.create("is_singular"), componentWithInjectsions);
	}
	
	createArchiveRoute(aReactComponent) {
		this.createRoute(WpConditional.create("is_archive"), aReactComponent);
	}
	
	_getMainCompnentWithInjections() {
		
		if(this._routes.length === 0) {
			console.warn("Module creator doesn't have any routes.", this);
			return null;
		}
		
		return <React.Fragment>
			{this._header}
			<FirstMatchingRoute>
				{this._routes}
			</FirstMatchingRoute>
			{this._footer}
		</React.Fragment>;
	}
	
	static create() {
		var newRoutingModuleCreator = new RoutingModuleCreator();
		
		return newRoutingModuleCreator;
	}
}