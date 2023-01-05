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
		
		this.createRoute(qualifier, aElement);
		
		return this;
	}
	
	createPageTemplateRoute(aTemplate, aElement) {
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			Wprr.routing.qualification.QualifyAny.create(
				Wprr.routing.qualification.Compare.create("post.linkedItem.pageTemplate.value", aTemplate),
				Wprr.routing.qualification.Compare.create("post.linkedItem.rawPostData.meta._wp_page_template.0", aTemplate)
			)
		);
		
		this.createRoute(qualifier, aElement);
		
		return this;
	}
	
	createSingularPostTypeRoute(aPostType, aElement) {
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			Wprr.routing.qualification.QualifyAny.create(
				Wprr.routing.qualification.Compare.create("post.linkedItem.postType.value", aPostType),
				Wprr.routing.qualification.Compare.create("post.linkedItem.postType", aPostType)
			)
		);
		
		this.createRoute(qualifier, aElement);
		
		return this;
	}
	
	createSingularRouteWithQualifier(aQualifier, aElement) {
		//console.log("createSingularRouteWithQualifier");
		//console.log(this);
		
		let qualifier = Wprr.routing.qualification.QualifyAll.create(
			Wprr.routing.qualification.Compare.create("pageType", "page"),
			aQualifier
		);
		
		this.createRoute(qualifier, aElement);
		
		return this;
	}
	
	createCatchAllRoute(aElement) {
		this.createRoute(Wprr.routing.qualification.AlwaysTrue.create(), aElement);
		
		return this;
	}
	
	_updateElement() {
		//console.log("_updateElement");
		
		let element = React.createElement("div", {}, "No route");
		
		let item = this._item.value;
		let itemId = Wprr.objectPath(item, "id");
		
		if(!item) {
			this._element.value = React.createElement("div", {"key": "none"});
			return;
		}
		
		let currentArray = this._routes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentQualifier = currentArray[i];
			if(currentQualifier["key"].qualify(item)) {
				element = currentQualifier["value"];
				break;
			}
		}
		
		item.group.getItem("project").setValue("language", item.getType("language"));
		
		let newElement = React.createElement(Wprr.ReferenceInjection, {"key": itemId, "injectData": {"wprr/pageItem": this._item, "wprr/postData": Wprr.sourceStatic(this._item, "post.linkedItem.postData")}}, element);
		this._element.value = newElement;
	}
	
	getReactElement() {
		return React.createElement(React.Fragment, {}, React.createElement(Wprr.InsertElement, {"element": this._element}));
	}
}
