import React from "react";
import Wprr from "wprr/Wprr";
import WprrBaseObject from "wprr/WprrBaseObject";

//import ResponsiveTemplateFactory from "wprr/elements/layout/ResponsiveTemplateFactory";
export default class ResponsiveTemplateFactory  {

	constructor() {
		
		this._defaultTemplate = React.createElement("div");
		this._responsiveTemplates = new Array();
		
		this._id = "ResponsiveTemplate" + Math.round(Math.random()*100000000000);
		
	}
	
	setDefaultTemplate(aTemplate) {
		this._defaultTemplate = aTemplate;
		
		return this;
	}
	
	addResponsiveTemplate(aTemplate, aMinWidth = null, aMaxWidth = null) {
		
		let newResponsiveProp = new Object();
		newResponsiveProp["props"] = {"element": aTemplate};
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
		return React.createElement(Wprr.ResponsiveProps, {"key": this._id, "element": this._defaultTemplate, "mediaQueries": [].concat(this._responsiveTemplates)},
			React.createElement(Wprr.InsertElement)
		);
	}
	
	static create(aDefaultTemplate = null) {
		let newResponsiveTemplateFactory = new ResponsiveTemplateFactory();
		
		if(aDefaultTemplate) {
			newResponsiveTemplateFactory.setDefaultTemplate(aDefaultTemplate);
		}
		
		return newResponsiveTemplateFactory;
	}
}