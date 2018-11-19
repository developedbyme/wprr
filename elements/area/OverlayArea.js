import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import TriggerButton from "wprr/elements/interaction/TriggerButton";

import Markup from "wprr/markup/Markup";
import MarkupPlacement from "wprr/markup/MarkupPlacement";
import MarkupChildren from "wprr/markup/MarkupChildren";
import UseMarkup from "wprr/markup/UseMarkup";

//import OverlayArea from "wprr/elements/area/OverlayArea";
export default class OverlayArea extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._internalIdCounter = 0;
		
		this._addMainElementClassName("overlay-area");
		this._addMainElementClassName("absolute-container");
		
		this._closeButtonTemplate = OverlayArea.createCloseButtonMarkup();
	}
	
	_generateId() {
		let newId = "internal" + this._internalIdCounter;
		this._internalIdCounter++;
		return newId;
	}
	
	trigger(aName, aValue) {
		switch(aName) {
			case "showOverlay":
				let template = this.getSourcedProp("template");
				let useMarkup = OverlayArea.createUseMarkup(template, this._closeButtonTemplate, aValue);
				this.showOverlay(this._generateId(), useMarkup);
				break;
			case "hideOverlay":
				this.hideOverlay(aValue);
				break;
		}
	}
	
	showOverlayInDefaultTemplate(aId, aContent) {
		let template = this.getSourcedProp("template");
		let useMarkup = OverlayArea.createUseMarkup(template, this._closeButtonTemplate, aContent);
		this.showOverlay(aId, useMarkup);
	}
	
	showOverlay(aId, aContent) {
		let overlaysArray = ([]).concat(this.props.overlays);
		
		overlaysArray.push({"id": aId, "content": aContent});
		
		this.getReference("value/overlays").updateValue("overlays", overlaysArray, null);
	}
	
	hideOverlay(aId) {
		//console.log("wprr/elements/area/OverlayArea::hideOverlay");
		
		let overlaysArray = ([]).concat(this.props.overlays);
		
		let currentArray = overlaysArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOverlay = currentArray[i];
			if(currentOverlay["id"] === aId) {
				currentArray.splice(i, 1);
				break;
			}
		}
		
		this.getReference("value/overlays").updateValue("overlays", overlaysArray, null);
	}
	
	_renderOverlay(aOverlayData) {
		
		let overlayId = aOverlayData.id;
		
		let triggerFunction = (function() {
			this.trigger("hideOverlay", overlayId);
		}).bind(this);
		let localTriggerObject = {"trigger": triggerFunction};
		
		let injectData = {"overlay/id": overlayId, "trigger/closeCurrentOverlay": localTriggerObject};
		
		let returnElement = React.createElement(ReferenceInjection, {key: "overlay-" + overlayId, injectData: injectData},
			aOverlayData.content
		);
		
		return returnElement;
	}
	
	_renderMainElement() {
		
		let overlayElement = null;
		let overlays = this.props.overlays;
		if(overlays.length > 0) {
			let overlayElements = new Array();
			let currentArray = overlays;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				overlayElements.push(this._renderOverlay(currentArray[i]));
			}
			
			overlayElement = React.createElement("div", {key: "overlay", "className": "absolute-overlay overlay-layer no-pointer-events"},
				overlayElements
			);
		}
		
		let injectData = new Object();
		injectData["trigger/showOverlay"] = this;
		injectData["trigger/hideOverlay"] = this;
		
		return React.createElement("wrapper", {},
			React.createElement(ReferenceInjection, {"injectData": injectData},
				this.props.children,
				overlayElement
			)
		);
	}
	
	static createCloseButtonMarkup() {
		let closeButtonMarkup = React.createElement(Markup, {},
			React.createElement(TriggerButton, {triggerName: "closeCurrentOverlay"},
				React.createElement(MarkupChildren, {placement: "all"})
			)
		);
		
		return React.createElement(MarkupPlacement, {placement: "closeButton", passOnInjection: true},
			React.createElement(UseMarkup, {markup: closeButtonMarkup})
		);
	}
	
	static createUseMarkup(aTemplate, aCloseButton, aContent) {
		let templateContent = [aCloseButton, React.createElement(MarkupPlacement, {placement: "content"}, aContent)];
		return React.createElement(UseMarkup, {markup: aTemplate, dynamicChildren: templateContent});
	}
}
