import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import ResponsiveProps from "wprr/manipulation/measure/ResponsiveProps";
import UseMarkup from "wprr/markup/UseMarkup";

//import ResponsiveTemplateFactory from "wprr/elements/layout/ResponsiveTemplateFactory";
export default class ResponsiveTemplateFactory  {

	constructor() {
		
		this._defaultTemplate = null;
		this._responsiveTemplates = new Array();
		
	}
	
	setDefaultTemplate(aTemplate) {
		this._defaultTemplate = aTemplate;
		
		return this;
	}
	
	addResponsiveTemplate(aTemplate, aMinWidth = null, aMaxWidth = null) {
		
		let newResponsiveProp = new Object();
		newResponsiveProp["props"] = {"markup": aTemplate};
		if(aMinWidth !== null) {
			newResponsiveProp["minWidth"] = aMinWidth;
		}
		if(aMaxWidth !== null) {
			newResponsiveProp["maxWidth"] = aMaxWidth;
		}
		
		this._responsiveTemplates.push(newResponsiveProp);
		
		return this;
	}
	
	getReactElements() {
		return <ResponsiveProps markup={this._defaultTemplate} mediaQueries={this._responsiveTemplates}>
			<UseMarkup />
		</ResponsiveProps>;
	}
	
	static create() {
		let newResponsiveTemplateFactory = new ResponsiveTemplateFactory();
		
		return newResponsiveTemplateFactory;
	}
}