import Wprr from "wprr/Wprr";
import React from "react";

//import PageDataRouter from "wprr/utils/navigation/PageDataRouter";
export default class PageDataRouter {

	constructor() {
		
		this._item = Wprr.sourceValue("item");
		this._element = Wprr.sourceValue("element");
		
		this._item.addChangeCommand(Wprr.commands.callFunction(this, this._updateElement));
		
		this._routes = new Array();
	}
	
	get item() {
		return this._item.value;
	}
	
	get itemSource() {
		return this._item;
	}
	
	get element() {
		return this._element.value;
	}
	
	get elementSource() {
		return this._element;
	}
	
	createRoute(aQualifier, aElement) {
		this._routes.push({"key": aQualifier, "value": aElement});
		
		return this;
	}
	
	createSingularRoute(aElement) {
		let qualifier = Wprr.routing.qualification.Compare.create("pageType", "page");
		let elementWithInjections = React.createElement(Wprr.RelatedItem, {"id": "post.linkedItem.postData", "from": this._item, "as": "wprr/postData"}, aElement);
		
		this.createRoute(qualifier, elementWithInjections);
		
		return this;
	}
	
	createPageTemplateRoute(aTemplate, aElement) {
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			Wprr.routing.qualification.Compare.create("post.linkedItem.rawPostData.meta._wp_page_template.0", aTemplate)
		);
		
		let elementWithInjections = React.createElement(Wprr.RelatedItem, {"id": "post.linkedItem.postData", "from": this._item, "as": "wprr/postData"}, aElement);
		
		this.createRoute(qualifier, elementWithInjections);
		
		return this;
	}
	
	createSingularPostTypeRoute(aPostType, aElement) {
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			Wprr.routing.qualification.Compare.create("post.linkedItem.postType", aPostType)
		);
		
		let elementWithInjections = React.createElement(Wprr.RelatedItem, {"id": "post.linkedItem.postData", "from": this._item, "as": "wprr/postData"}, aElement);
		
		this.createRoute(qualifier, elementWithInjections);
		
		return this;
	}
	
	createSingularRouteWithQualifier(aQualifier, aElement) {
		//console.log("createSingularRouteWithQualifier");
		//console.log(this);
		
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			aQualifier
		);
		
		let elementWithInjections = React.createElement(Wprr.RelatedItem, {"id": "post.linkedItem.postData", "from": this._item, "as": "wprr/postData"}, aElement);
		
		this.createRoute(qualifier, elementWithInjections);
		
		return this;
	}
	
	_updateElement() {
		console.log("_updateElement");
		
		let element = React.createElement("div", {}, "No route");
		
		let item = this._item.value;
		let itemId = Wprr.objectPath(item, "id");
		
		console.log(item, Wprr.objectPath(item, "post.linkedItem.postType"));
		
		let currentArray = this._routes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentQualifier = currentArray[i];
			console.log(currentQualifier);
			if(currentQualifier["key"].qualify(item)) {
				element = currentQualifier["value"];
				break;
			}
		}
		
		this._element.value = React.createElement(Wprr.ReferenceInjection, {"key": itemId, "injectData": {"wprr/pageItem": this._item}}, element);
	}
	
	getReactElement() {
		return React.createElement("div", {}, React.createElement(Wprr.InsertElement, {"element": this._element}));
	}
}
