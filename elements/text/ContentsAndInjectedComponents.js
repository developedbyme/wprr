import React from "react";
import ReactDOM from "react-dom";

import WprrBaseObject from "wprr/WprrBaseObject";

import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
import SourceData from "wprr/reference/SourceData";

import CommandPerformer from "wprr/commands/CommandPerformer";
import InjectExistingElements from "wprr/elements/area/InjectExistingElements";

//import ContentsAndInjectedComponents from "wprr/elements/text/ContentsAndInjectedComponents";
export default class ContentsAndInjectedComponents extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._mainElementType = "section";
		this._addMainElementClassName("main-section");
		
		this._groups = null;
		this._containers = null;
		this._injectComponents = null;
		this._renderInjectComponents = null;
		
		this._readMorePosition = -1;
		this.state["showReadMore"] = false;
	}
	
	_createInjectComponent(aId, aType, aData) {
		
		//METODO: make it work with direct injection
		
		return React.createElement("div", {"key": "inject-" + aId},
			React.createElement(ContentCreatorSingleItem, {data: aData, contentCreator: SourceData.create("reference", "contentCreators/inject/" + aType)})
		);
	}
	
	_createContainer(aElements) {
		
		let generateContainerCommand = this.getFirstInput("generateContainerCommand");
		
		let containerId = "container-" + this._containers.length;
		
		if(generateContainerCommand) {
			CommandPerformer.performCommand(generateContainerCommand, {"containers": this._containers, "containerId": containerId}, this);
		}
		else {
			let richTextClassName = this.getSourcedPropWithDefault("richTextClassName", "wp-rich-text-formatting");
			let textGroupClassName = this.getSourcedPropWithDefault("textGroupClassName", "post-content centered-content-text");
		
			this._containers.push(
				React.createElement(InjectExistingElements, {"key": containerId, "className": textGroupClassName, "nativeElementClassName": richTextClassName, "elements": aElements})
			);
		}
	}
	
	_createContent() {
		let content = this.getSourcedPropWithDefault("content", SourceData.create("postData", "content"));
		
		this._groups = new Array();
		this._containers = new Array();
		this._injectComponents = new Array();
		this._renderInjectComponents = new Array();
		this._readMorePosition = -1;
		
		let temporaryElement = document.createElement("div");
		
		temporaryElement.innerHTML = content;
		
		{
			let componentObjects = temporaryElement.querySelectorAll("*[data-wprr-component]");
			let currentArray = componentObjects;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
				
				if(!temporaryElement.contains(currentElement)) {
					//MENOTE: element has been removed for being inside of another component
					continue;
				}
			
				let injectComponentData = new Object();
				let id = "inject-" + this._injectComponents.length;
				injectComponentData["id"] = id;
				injectComponentData["container"] = currentElement;
			
				let type = currentElement.getAttribute("data-wprr-component");
				let data = new Object();
				let dataString = currentElement.getAttribute("data-wprr-component-data");
			
				try {
					if(dataString != null) {
						data = JSON.parse(dataString);
					}
					
					data["innerMarkup"] = currentElement.innerHTML;
					
					if(data["innerMarkup"] && data["innerMarkup"] !== "") {
						currentElement.innerHTML = "";
					}
					
					let injectedComponenet = this._createInjectComponent(id, type, data);
					//this._renderInjectComponents.push(injectedComponenet);
					
					let portal = ReactDOM.createPortal(injectedComponenet, currentElement);
					this._renderInjectComponents.push(portal);
				}
				catch(theError) {
					console.error("Error when creating injected component");
					console.log(dataString);
				}
			}
		}
		
		let currentElements = new Array();
		
		{
			let currentArray = temporaryElement.children;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
			
				if(currentElement.nodeType === 1 && currentElement.getAttribute("data-expanded-content") == "1") {
					if(currentElements.length > 0) {
						this._createContainer(currentElements);
						
						currentElements = new Array();
					}
					
					this._containers.push(
						React.createElement(InjectExistingElements, {"elements": [currentElement]})
					);
				}
				else {
					currentElements.push(currentElement);
				
					if(currentElement.nodeType === 1 && currentElement.localName === "p") {
						if(currentElement.childNodes && currentElement.childNodes.length === 1) {
							let onlyChild = currentElement.childNodes[0];
						
							if(onlyChild.nodeType === 8 && onlyChild.nodeValue) {
								let injectComponentData = new Object();
								let id = "inject-" + this._injectComponents.length;
								injectComponentData["id"] = id;
								injectComponentData["container"] = currentElement;
								this._renderInjectComponents.push(this._createInjectComponent(id, "readMoreButton", {"controller": this}));
								this._injectComponents.push(injectComponentData);
								
								this._createContainer(currentElements);
								
								currentElements = new Array();
								
								this._readMorePosition = this._groups.length;
							}
						}
					}
				}
			}
		}
		
		if(currentElements.length > 0) {
			this._createContainer(currentElements);
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
			React.createElement("div", {"key": "injected-components", "className": "wprr-inject-components"},
				this._renderInjectComponents
			)
		);
	}
}