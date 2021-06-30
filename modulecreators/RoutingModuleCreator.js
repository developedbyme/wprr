"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import ModuleCreatorBaseObject from "wprr/modulecreators/ModuleCreatorBaseObject";

import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
import FirstMatchingRoute from "wprr/routing/FirstMatchingRoute";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import WpConditional from "wprr/routing/qualification/wp/WpConditional";
import WpData from "wprr/routing/qualification/wp/WpData";
import HasTerm from "wprr/routing/qualification/wp/HasTerm";
import QualifyAll from "wprr/routing/qualification/QualifyAll";

import RouteCreator from "wprr/routing/RouteCreator";

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
		//console.log("RoutingModuleCreator::constructor");
		
		super();
		
		this._routeCreator = RouteCreator.create();
		
		this._router = new Wprr.utils.navigation.PageDataRouter();
		this._router.itemSource.value = null;
		this._siteDataLoader.itemSource.addChangeCommand(Wprr.commands.setProperty(this._router.itemSource.reSource(), "value", this._siteDataLoader.itemSource))
		
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
	
	getRouteCreator() {
		return this._routeCreator;
	}
	
	createRoute(aQualifier, aReactComponent) {
		this._routeCreator.createRoute(aQualifier, aReactComponent);
		
		this._router.createRoute(aQualifier, aReactComponent);
		
		return this;
	}
	
	createPageTemplateRoute(aPageTemplatePath, aReactComponent) {
		this._routeCreator.createPageTemplateRoute(aPageTemplatePath, aReactComponent);
		
		this._router.createPageTemplateRoute(aPageTemplatePath, aReactComponent);
		
		return this;
	}
	
	createSingularRouteWithQualifier(aQualifier, aReactComponent) {
		console.log("createSingularRouteWithQualifier");
		this._routeCreator.createSingularRouteWithQualifier(aQualifier, aReactComponent);
		
		this._router.createSingularRouteWithQualifier(aQualifier, aReactComponent);
		
		return this;
	}
	
	createSingularRoute(aReactComponent) {
		this._routeCreator.createSingularRoute(aReactComponent);
		
		this._router.createSingularRoute(aReactComponent);
		
		return this;
	}
	
	createSingularPostTypeRoute(aPostType, aReactComponent) {
		this._routeCreator.createSingularPostTypeRoute(aPostType, aReactComponent);
		
		this._router.createSingularPostTypeRoute(aPostType, aReactComponent);
		
		return this;
	}
	
	createSingularHasTaxonomyTermRoute(aTaxonomy, aTermSlug, aReactComponent) {
		this._routeCreator.createSingularHasTaxonomyTermRoute(aTaxonomy, aTermSlug, aReactComponent);
		
		//METODO
		console.warn("createSingularHasTaxonomyTermRoute is not supported in new router", aTaxonomy, aTermSlug, aReactComponent);
		
		return this;
	}
	
	createArchiveRoute(aReactComponent) {
		this._routeCreator.createArchiveRoute(aReactComponent);
		
		//METODO
		console.warn("createArchiveRoute is not supported in new router", aReactComponent);
	}
	
	_getMainCompnentWithInjections() {
		
		let childrensArray = new Array();
		if(this._header) {
			childrensArray.push(React.createElement(MarkupPlacement, {"placement": "header"}, this._header));
		}
		
		//childrensArray.push(React.createElement(MarkupPlacement, {"placement": "routes"}, this._routeCreator.getReactElements()));
		
		//MENOTE: test that this works with old functionality
		childrensArray.push(React.createElement(MarkupPlacement, {"placement": "routes"}, React.createElement(Wprr.OpenCloseExpandableArea, {"open": Wprr.sourceFunction(this, function(aValue) {return !aValue}, [this._siteDataLoader.loadedSource]), "sourceUpdates": this._siteDataLoader.loadedSource},
			<div>Loading...</div>
		)));
		childrensArray.push(React.createElement(MarkupPlacement, {"placement": "routes"}, this._router.getReactElement()));
		
		if(this._footer) {
			childrensArray.push(React.createElement(MarkupPlacement, {"placement": "footer"}, this._footer));
		}
		
		return React.createElement(UseMarkup, {"markup": this._markup, "dynamicChildren": childrensArray});
	}
	
	static create() {
		var newRoutingModuleCreator = new RoutingModuleCreator();
		
		return newRoutingModuleCreator;
	}
}

RoutingModuleCreator.DEFAULT_MARKUP = React.createElement(Markup, {}, React.createElement(MarkupChildren, {"placement": "all"}));