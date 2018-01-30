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
		
		this.state["overlays"] = new Array();
		
		this._internalIdCounter = 0;
		
		this._addMainElementClassName("overlay-area");
		this._addMainElementClassName("absolute-container");
		
		let closeButtonMarkup = <Markup><TriggerButton trigger="closeCurrentOverlay" /><MarkupChildren placement="all" /></Markup>;
		
		this._closeButtonTemplate = <MarkupPlacement placement="closeButton" passOnInjection={true}>
			<UseMarkup markup={closeButtonMarkup} />
		</MarkupPlacement>;
	}
	
	_generateId() {
		let newId = "internal" + this._internalIdCounter;
		this._internalIdCounter++;
		return newId;
	}
	
	trigger(aName, aValue) {
		switch(aName) {
			case "showOverlay":
				//METODO: templates
				this.showOverlay(this._generateId(), aValue);
				break;
			case "hideOverlay":
				this.hideOverlay(aValue);
				break;
		}
	}
	
	showOverlay(aId, aContent) {
		let overlaysArray = this.state["overlays"];
		
		let localTrigger = null; //METODO: implement local trigger
		
		overlaysArray.push({"id": aId, "content": aContent, "localTrigger": localTrigger});
		
		let newStateObject = {"overlays": overlaysArray};
		
		//METODO: use external state instead
		
		this.setState(newStateObject);
	}
	
	hideOverlay(aId) {
		//METODO
	}
	
	_renderOverlay(aOverlayData) {
		
		let overlayId = aOverlayData.id;
		//METODO: create the trigger here
		let injectData = {"overlay/id": overlayId, "trigger/closeCurrentOverlay": aOverlayData.localTrigger};
		
		let returnElement = <ReferenceInjection key={"overlay-" + overlayId} injectData={injectData}>
			{aOverlayData.content}
		</ReferenceInjection>;
		
		return returnElement;
	}
	
	_renderMainElement() {
		
		let overlayElement = null;
		let overlays = this.state["overlays"];
		if(overlays.length > 0) {
			let overlayElements = new Array();
			let currentArray = overlays;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				overlayElements.push(this._renderOverlay(currentArray[i]));
			}
			
			overlayElement = <div className="absolute-overlay no-pointer-events">
				{overlayElements}
			</div>;
		}
		
		let injectData = new Object();
		injectData["trigger/showOverlay"] = this;
		injectData["trigger/hideOverlay"] = this;
		
		return <wrapper>
			<ReferenceInjection injectData={injectData}>
				{this.props.children}
				{overlayElement}
			</ReferenceInjection>
		</wrapper>;
	}
}
