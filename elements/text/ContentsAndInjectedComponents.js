import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from "react-dom";

import WprrBaseObject from "wprr/WprrBaseObject";

import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";

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
		
		return React.createElement(ContentCreatorSingleItem, {data: aData, contentCreator: Wprr.sourceReference("contentCreators/inject/" + aType)});
	}
	
	_createContainer(aElements) {
		
		let generateContainerCommand = this.getFirstInput("generateContainerCommand");
		
		let containerId = "container-" + this._containers.length;
		let childElement = null;
		
		if(generateContainerCommand) {
			childElement = CommandPerformer.performCommand(generateContainerCommand, aElements, this);
			if(!childElement) {
				//METODO: add warning
			}
		}
		
		if(!childElement) {
			let richTextClassName = this.getSourcedPropWithDefault("richTextClassName", "wp-rich-text-formatting");
			let textGroupClassName = this.getSourcedPropWithDefault("textGroupClassName", "post-content centered-content-text");
			
			childElement = React.createElement(InjectExistingElements, {"className": textGroupClassName, "nativeElementClassName": richTextClassName, "elements": aElements});
		}
		
		
		this._containers.push(React.createElement(React.Fragment, {"key": containerId}, childElement));
	}
	
	_createContent() {
		
		let content = this.getFirstInput("content");
		let parsedContent = this.getFirstInput("parsedContent");
		if((content === null || content === undefined) && (parsedContent === null || parsedContent === undefined)) {
			content = this.getFirstInput(Wprr.source("postData", "content"));
			let postId = this.getFirstInput(Wprr.source("postData", "id"));
			parsedContent = this.getFirstInput(Wprr.sourceReferenceIfExists("wprr/parsedContent/" + postId));
		}
		
		if(!parsedContent) {
			parsedContent = Wprr.wp.blocks.BlockContentParser.createInBody(content);
		}
		
		
		this._groups = new Array();
		this._containers = new Array();
		this._injectComponents = new Array();
		this._renderInjectComponents = new Array();
		this._readMorePosition = -1;
		
		{
			let currentArray = parsedContent.componentsData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				
				let currentData = currentArray[i];
				
				let injectComponentData = new Object();
				let id = "inject-" + this._injectComponents.length;
				injectComponentData["id"] = id;
				injectComponentData["container"] = currentData["container"];
			
				let type = currentData["type"];
				let data = currentData["data"];
				
				let injectedComponent = this._createInjectComponent(id, type, data);
				
				let portal = ReactDOM.createPortal(injectedComponent, currentData["container"]);
				this._renderInjectComponents.push(portal);
			}
		}
		
		let currentElements = new Array();
		
		{
			let currentArray = parsedContent.contentElements;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
			
				if(currentElement.nodeType === 1 && currentElement.getAttribute("data-expanded-content") == "1") {
					if(currentElements.length > 0) {
						this._createContainer(currentElements);
						
						currentElements = new Array();
					}
					
					let containerId = "container-" + this._containers.length;
					this._containers.push(
						React.createElement(React.Fragment, {"key": containerId},
							React.createElement(InjectExistingElements, {"elements": [currentElement]})
						)
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