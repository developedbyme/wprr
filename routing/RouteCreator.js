import React from "react";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
import FirstMatchingRoute from "wprr/routing/FirstMatchingRoute";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import WpConditional from "wprr/routing/qualification/wp/WpConditional";
import WpData from "wprr/routing/qualification/wp/WpData";
import HasTerm from "wprr/routing/qualification/wp/HasTerm";
import QualifyAll from "wprr/routing/qualification/QualifyAll";
import AlwaysTrue from "wprr/routing/qualification/AlwaysTrue";

// import RouteCreator from "wprr/routing/RouteCreator";
export default class RouteCreator {
	
	constructor() {
		this._mode = "firstMatch";
		this._routes = new Array();
	}
	
	setMode(aMode) {
		this._mode = aMode;
		
		return this._mode;
	}
	
	createRoute(aQualifier, aReactComponent) {
		this._routes.push(React.createElement("route", {"key": "route-" + this._routes.length, "qualify": aQualifier}, aReactComponent));
		
		return this;
	}
	
	createSingularRouteWithQualifier(aQualifier, aReactComponent) {
		
		let componentWithInjectsions = React.createElement(PostDataInjection, {"postData": SourceDataWithPath.create("reference", "wprr/pageData", "queriedData")}, aReactComponent);
		this.createRoute(aQualifier, componentWithInjectsions);
		
		return this;
	}
	
	createPageTemplateRoute(aPageTemplatePath, aReactComponent) {
		
		this.createSingularRouteWithQualifier(WpData.createForPageTemplate(aPageTemplatePath), aReactComponent);
		
		return this;
	}
	
	createSingularConditionRoute(aCondition, aReactComponent) {
		
		this.createSingularRouteWithQualifier(QualifyAll.create(WpConditional.create("is_singular"), WpConditional.create(aCondition)), aReactComponent);
		
		return this;
	}
	
	createSingularRoute(aReactComponent) {
		
		this.createSingularRouteWithQualifier(WpConditional.create("is_singular"), aReactComponent);
		
		return this;
	}
	
	createSingularPostTypeRoute(aPostType, aReactComponent) {
		
		this.createSingularRouteWithQualifier(WpData.createForPostType(aPostType), aReactComponent);
		
		return this;
	}
	
	createSingularHasTaxonomyTermRoute(aTaxonomy, aTermSlug, aReactComponent) {
		
		this.createSingularRouteWithQualifier(QualifyAll.create(WpConditional.create("is_singular"), HasTerm.create(aTaxonomy, aTermSlug, "slug")), aReactComponent);
		
		return this;
	}
	
	createArchiveRoute(aReactComponent) {
		this.createRoute(WpConditional.create("is_archive"), aReactComponent);
		
		return this;
	}
	
	createCatchAllRoute(aReactComponent) {
		this.createRoute(AlwaysTrue.create(), aReactComponent);
		
		return this;
	}
	
	getReactElements() {
		
		if(this._routes.length === 0) {
			console.warn("Module creator doesn't have any routes.", this);
			return null;
		}
		
		let parentClass = React.Fragment;
		
		switch(this._mode) {
			case "firstMatch":
				parentClass = FirstMatchingRoute;
				break;
			default:
				console.error("Unknown mode " + this._mode, this);
				break;
		}
		
		return React.createElement(parentClass, {}, this._routes);
	}

	static create(aMode = "firstMatch") {
		let newRouteCreator = new RouteCreator();
		newRouteCreator.setMode(aMode);
		
		return newRouteCreator;
	}
}