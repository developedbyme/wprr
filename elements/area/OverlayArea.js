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
		
		let closeButtonMarkup = <Markup><TriggerButton triggerName="closeCurrentOverlay"><MarkupChildren placement="all" /></TriggerButton></Markup>;
		
		this._closeButtonTemplate = <MarkupPlacement placement="closeButton" passOnInjection={true}><UseMarkup markup={closeButtonMarkup} /></MarkupPlacement>;
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
				let templateContent = [this._closeButtonTemplate, <MarkupPlacement placement="content">{aValue}</MarkupPlacement>];
				this.showOverlay(this._generateId(), <UseMarkup markup={template} dynamicChildren={templateContent} />);
				break;
			case "hideOverlay":
				this.hideOverlay(aValue);
				break;
		}
	}
	
	showOverlay(aId, aContent) {
		let overlaysArray = ([]).concat(this.state["overlays"]);
		
		overlaysArray.push({"id": aId, "content": aContent});
		
		let newStateObject = {"overlays": overlaysArray};
		
		//METODO: use external state instead
		
		this.setState(newStateObject);
	}
	
	hideOverlay(aId) {
		console.log("wprr/elements/area/OverlayArea::hideOverlay");
		
		let overlaysArray = ([]).concat(this.state["overlays"]);
		
		let currentArray = overlaysArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOverlay = currentArray[i];
			if(currentOverlay["id"] === aId) {
				currentArray.splice(i, 1);
				break;
			}
		}
		
		let newStateObject = {"overlays": overlaysArray};
		
		//METODO: use external state instead
		
		this.setState(newStateObject);
	}
	
	_renderOverlay(aOverlayData) {
		
		let overlayId = aOverlayData.id;
		
		let triggerFunction = (function() {
			console.log("triggerFunction");
			this.trigger("hideOverlay", overlayId);
		}).bind(this);
		let localTriggerObject = {"trigger": triggerFunction};
		
		let injectData = {"overlay/id": overlayId, "trigger/closeCurrentOverlay": localTriggerObject};
		
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
