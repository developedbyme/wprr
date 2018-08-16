"use strict";

import React from "react";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
import FirstMatchingRoute from "wprr/routing/FirstMatchingRoute";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import WpConditional from "wprr/routing/qualification/wp/WpConditional";
import WpData from "wprr/routing/qualification/wp/WpData";

import Markup from "wprr/markup/Markup";
import MarkupChildren from "wprr/markup/MarkupChildren";
import UseMarkup from "wprr/markup/UseMarkup";
import MarkupPlacement from "wprr/markup/MarkupPlacement";

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
		
		this._markup = RoutingModuleCreator.DEFAULT_MARKUP;
	}
	
	setMarkup(aMarkup) {
		this._markup = aMarkup;
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
	
	createSingularRouteWithQualifier(aQualifier, aReactComponent) {
		let componentWithInjectsions = <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{aReactComponent}
		</PostDataInjection>;

		this.createRoute(aQualifier, componentWithInjectsions);
	}
	
	createSingularRoute(aReactComponent) {
		let componentWithInjectsions = <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{aReactComponent}
		</PostDataInjection>;

		this.createRoute(WpConditional.create("is_singular"), componentWithInjectsions);
	}
	
	createSingularPostTypeRoute(aPostType, aReactComponent) {
		let componentWithInjectsions = <PostDataInjection postData={SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}>
			{aReactComponent}
		</PostDataInjection>;

		this.createRoute(WpData.createForPostType(aPostType), componentWithInjectsions);
	}
	
	createArchiveRoute(aReactComponent) {
		this.createRoute(WpConditional.create("is_archive"), aReactComponent);
	}
	
	_getMainCompnentWithInjections() {
		
		if(this._routes.length === 0) {
			console.warn("Module creator doesn't have any routes.", this);
			return null;
		}
		
		let childrensArray = new Array();
		if(this._header) {
			childrensArray.push(<MarkupPlacement placement="header">{this._header}</MarkupPlacement>);
		}
		childrensArray.push(<MarkupPlacement placement="routes">
			<FirstMatchingRoute>
				{this._routes}
			</FirstMatchingRoute>
		</MarkupPlacement>);
		if(this._footer) {
			childrensArray.push(<MarkupPlacement placement="footer">{this._footer}</MarkupPlacement>);
		}
		
		return <UseMarkup markup={this._markup} dynamicChildren={childrensArray} />;
	}
	
	static create() {
		var newRoutingModuleCreator = new RoutingModuleCreator();
		
		return newRoutingModuleCreator;
	}
}

RoutingModuleCreator.DEFAULT_MARKUP = <Markup>
	<MarkupChildren placement="all" />
</Markup>;