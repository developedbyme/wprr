import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import FormField from "wprr/elements/form/FormField";
import ToggleButton from "wprr/elements/interaction/ToggleButton";
import OpenCloseExpandableArea from "wprr/elements/area/OpenCloseExpandableArea";
import ReferenceInjection from "wprr/reference/ReferenceInjection";
import EditableProps from "wprr/manipulation/EditableProps";
import ClickOutsideTrigger from "wprr/elements/interaction/ClickOutsideTrigger";

import Markup from "wprr/markup/Markup";
import MarkupChildren from "wprr/markup/MarkupChildren";
import UseMarkup from "wprr/markup/UseMarkup";
import MarkupPlacement from "wprr/markup/MarkupPlacement";
import ExternalStorageProps from "wprr/manipulation/ExternalStorageProps";

// import DropdownSelection from "wprr/elements/form/DropdownSelection";
export default class DropdownSelection extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new Wprr.utils.DataStorage();
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		console.log("updateValue");
		
		if(aName === "selection") {
			this.updateValue(aValue);
			this.close();
		}
		else if(aName === "dropdownSelection/open") {
			if(aValue) {
				this.open();
			}
			else {
				this.close();
			}
		}
	}
	
	trigger(aName, aValue) {
		console.log("trigger");
		
		if(aName === "setSelection") {
			this.updateValue(aValue);
			this.close();
		}
		if(aName === "close") {
			console.warn("Call close function directly instead of through trigger");
			this.close();
		}
	}
	
	updateValue(aValue) {
		this.updateProp("value", aValue);
		this._updateExternalValue(this.getSourcedPropWithDefault("valueName", "value"), aValue);
	}
	
	open() {
		this.updateProp("open", true);
		this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), true);
	}
	
	close() {
		console.log("close");
		this.updateProp("open", false);
		this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), false);
	}
	
	toggleOpen() {
		let open = this.getFirstInput("open", Wprr.sourceProp(this.getFirstInput("openValueName")));
		if(!open) {
			this.open();
		}
		else {
			this.close();
		}
	}
	
	_updateExternalValue(aValueName, aValue) {
		
		let updateController = this.getReference("value/" + aValueName);
		
		if(updateController) {
			updateController.updateValue(aValueName, aValue, null);
		}
	}
	
	_prepareRender() {
		console.log("DropdownSelection::_prepareRender");
		
		super._prepareRender();
		
		let open = this.getFirstInput("open", Wprr.sourceProp(this.getFirstInput("openValueName")));
		this._externalStorage.updateValue("open", open);
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/DropdownSelection::_renderMainElement");
		
		let markup = this.getFirstInput("markup", Wprr.source("command", Wprr.commands.callFunction(DropdownSelection, DropdownSelection.getDefaultMarkup)));
		
		let name = this.getFirstInput("name");
		let value = this.getFirstInput("value", Wprr.sourceProp(this.getFirstInput("valueName")));
		let open = this.getFirstInput("open", Wprr.sourceProp(this.getFirstInput("openValueName")));
		
		//METODO: check that button exists
		
		return React.createElement("wrapper", {},
			React.createElement(Wprr.HasData, {"check": name},
				React.createElement(Wprr.FormField, {type: "hidden", name: name, value: value})
			),
			React.createElement(Wprr.ExternalStorageInjection, {"storageName": "dropdownSelectionExternalStorage", "initialValues": {"open": open}, "initialExternalStorage": this._externalStorage},
				React.createElement(Wprr.ReferenceInjection, {injectData: {"dropdownSelection": this, "value/selection": this, "value/dropdownSelection/open": this, "trigger/setSelection": this, "trigger/close": this, "dropdownSelection/open": open, "dropdownSelection/value": value}},
					React.createElement(Wprr.UseMarkup, {markup: markup}, this.props.children)
				)
			)
		);
	}
	
	static createPlacements(aButton, aOverlayContent) {
		let returnArray = new Array();
		
		returnArray.push(React.createElement(MarkupPlacement, {key: "button", placement: "button"}, aButton));
		returnArray.push(React.createElement(MarkupPlacement, {key: "overlay", placement: "overlay"}, aOverlayContent));
		
		return returnArray;
	}
	
	static makeSelfContained(aElement, aValue = "", aOpen = false) {
		return React.createElement(EditableProps, {editableProps: "value,open", value: aValue, open: aOpen}, aElement);
	}
	
	static createSelfContained(aButton, aOverlayContent, aProps = {}, aValue = "", aOpen = false) {
		
		let placements = DropdownSelection.createPlacements(aButton, aOverlayContent);
		
		return DropdownSelection.makeSelfContained(
			React.createElement(DropdownSelection, aProps, placements[0], placements[1]),
			aValue,
			aOpen
		);
	}
	
	static getDefaultMarkup() {
		if(!DropdownSelection.DEFAULT_MARKUP) {
			DropdownSelection.DEFAULT_MARKUP = React.createElement(Wprr.Markup, {usedPlacements: "button,beforeList,afterList"},
				React.createElement("div", {className: "absolute-container"},
					React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(Wprr.sourceReference("dropdownSelection"), "toggleOpen")},
						React.createElement(Wprr.MarkupChildren, {placement: "button"})
					),
					React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("dropdownSelectionExternalStorage", "open")},
					React.createElement("div", {className: "position-absolute dropdown-selection-popup full-width"},
						React.createElement(Wprr.PortalledItem, {"overlayClassName": "layer-order-dropdown-portal"},
							React.createElement(Wprr.ClickOutsideTrigger, {"commands": Wprr.commands.callFunction(Wprr.sourceReference("dropdownSelection"), "close"), active: Wprr.sourceReference("dropdownSelectionExternalStorage", "active")},
								React.createElement(Wprr.OpenCloseExpandableArea, {"open": Wprr.sourceReference("dropdownSelectionExternalStorage", "open")},
									React.createElement(Wprr.MarkupChildren, {"placement": "beforeList"}),
									React.createElement(Wprr.MarkupChildren, {"placement": "rest"}),
									React.createElement(Wprr.MarkupChildren, {"placement": "afterList"})
								)
							)
						)
					)
					)
				)
			);
		}
		
		return DropdownSelection.DEFAULT_MARKUP;
	}
}
