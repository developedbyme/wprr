import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
import SourceData from "wprr/reference/SourceData";

import RefCollector from "wprr/utils/RefCollector";

//import ContentsAndInjectedComponents from "wprr/elements/text/ContentsAndInjectedComponents";
export default class ContentsAndInjectedComponents extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._mainElementType = "section";
		this._addMainElementClassName("main-section");
		
		this._groups = null;
		this._containers = null;
		this._injectComponents = null;
		this._renderInjectComponents = null;
		
		this._readMorePosition = -1;
		this.state["showReadMore"] = false;
		
		this._refCollector = new RefCollector();
	}
	
	_addContentToGroups() {
		var currentArray = this._groups;
		var currentArrayLength = currentArray.length;
		if(this._readMorePosition !== -1 && !this.state["showReadMore"]) {
			currentArrayLength = Math.min(this._readMorePosition, currentArrayLength);
		}
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGroup = currentArray[i];
			var currentContainer = this._refCollector.getRef(currentGroup["id"]);
			var currentArray2 = currentGroup["children"];
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentElement = currentArray2[j];
				currentContainer.appendChild(currentElement);
			}
		}
		
		var currentArray = this._injectComponents;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var injectionData = currentArray[i];
			injectionData["container"].appendChild(this._refCollector.getRef(injectionData["id"]));
		}
	}
	
	componentDidMount() {
		console.log("wprr/elements/text/ContentsAndInjectedComponents::componentDidMount");
		
		this._addContentToGroups();
	}
	
	componentDidUpdate() {
		console.log("wprr/elements/text/ContentsAndInjectedComponents::componentDidUpdate");
		
		this._addContentToGroups();
	}
	
	_createInjectComponent(aId, aType, aData) {
		
		//METODO: make it work with direct injection
		
		return React.createElement("div", {ref: this._refCollector.getCallbackFunction(aId)},
			React.createElement(ContentCreatorSingleItem, {data: aData, contentCreator: SourceData.create("reference", "contentCreators/inject/" + aType)})
		);
	}
	
	_createContent() {
		var content = this.getReference("wprr/postData").getContent();
		
		this._groups = new Array();
		this._containers = new Array();
		this._injectComponents = new Array();
		this._renderInjectComponents = new Array();
		this._readMorePosition = -1;
		
		var temporaryElement = document.createElement("div");
		
		temporaryElement.innerHTML = content;
		
		var componentObjects = temporaryElement.querySelectorAll("*[data-wprr-component]");
		var currentArray = componentObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			
			var injectComponentData = new Object();
			var id = "inject-" + this._injectComponents.length;
			injectComponentData["id"] = id;
			injectComponentData["container"] = currentElement;
			
			var type = currentElement.getAttribute("data-wprr-component");
			var data = null;
			var dataString = currentElement.getAttribute("data-wprr-component-data");
			
				try {
					if(dataString != null) {
						data = JSON.parse(dataString);
					}
					this._renderInjectComponents.push(this._createInjectComponent(id, type, data));
				}
				catch(theError) {
					console.error("Error when creating injected component");
					console.log(dataString);
					this._renderInjectComponents.push(React.createElement("div", {ref: this._refCollector.getCallbackFunction(id)}, "Error when creating injected component: " + theError.message + "<br />" + theError.stack ));
				}
			
			
			this._injectComponents.push(injectComponentData);
		}
		
		var currentElements = new Array();
		
		var currentArray = temporaryElement.children;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			
			if(currentElement.nodeType === 1 && currentElement.getAttribute("data-expanded-content") == "1") {
				if(currentElements.length > 0) {
					this._containers.push(
						React.createElement("div", {key: "container-" + this._containers.length, className: "post-content centered-content-text"},
							React.createElement("div", {className: "wp-rich-text-formatting", ref: this._refCollector.getCallbackFunction("group-" + this._groups.length)})
						)
					);
					this._groups.push({"id": "group-" + this._groups.length, "children": currentElements});
					
					currentElements = new Array();
				}
				
				this._containers.push(React.createElement("div", {key: "container-" + this._containers.length, ref: this._refCollector.getCallbackFunction("group-" + this._groups.length)}));
				this._groups.push({"id": "group-" + this._groups.length, "children": [currentElement]});
			}
			else {
				currentElements.push(currentElement);
				
				if(currentElement.nodeType === 1 && currentElement.localName === "p") {
					console.dir(currentElement);
					console.log(currentElement.childNodes);
					if(currentElement.childNodes && currentElement.childNodes.length === 1) {
						let onlyChild = currentElement.childNodes[0];
						
						if(onlyChild.nodeType === 8 && onlyChild.nodeValue) {
							var injectComponentData = new Object();
							var id = "inject-" + this._injectComponents.length;
							injectComponentData["id"] = id;
							injectComponentData["container"] = currentElement;
							this._renderInjectComponents.push(this._createInjectComponent(id, "readMoreButton", {"controller": this}));
							this._injectComponents.push(injectComponentData);
							
							this._containers.push(
								React.createElement("div", {key: "container-" + this._containers.length, className: "post-content centered-content-text"},
									React.createElement("div", {className: "wp-rich-text-formatting", ref: this._refCollector.getCallbackFunction("group-" + this._groups.length)})
								)
							);
							this._groups.push({"id": "group-" + this._groups.length, "children": currentElements});
				
							currentElements = new Array();
							
							this._readMorePosition = this._groups.length;
							console.log(onlyChild, this._readMorePosition, this._groups);
						}
					}
				}
			}
		}
		
		if(currentElements.length > 0) {
			this._containers.push(
				React.createElement("div", {key: "container-" + this._containers.length, className: "post-content centered-content-text"},
					React.createElement("div", {className: "wp-rich-text-formatting", ref: this._refCollector.getCallbackFunction("group-" + this._groups.length)})
				)
			);
			this._groups.push({"id": "group-" + this._groups.length, "children": currentElements});
		}
		
		if(this._readMorePosition === -1) {
			this._readMorePosition = this._groups.length;
		}
	}
	
	_getContainers() {
		if(this._groups === null) {
			this._createContent();
		}
		
		return this._containers;
	}

	_renderMainElement() {
		//console.log("wprr/elements/text/ContentsAndInjectedComponents::_renderMainElement");
		
		let containers = this._getContainers();
		
		return React.createElement("wrapper", {},
			containers,
			React.createElement("div", {className: "wprr-inject-components"},
				this._renderInjectComponents
			)
		);
	}
}