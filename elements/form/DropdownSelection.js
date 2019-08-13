import React from "react";

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

// import DropdownSelection from "wprr/elements/form/DropdownSelection";
export default class DropdownSelection extends WprrBaseObject {

	constructor( props ) {
		super( props );
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		if(aName === "selection") {
			this._updateExternalValue(this.getSourcedPropWithDefault("valueName", "value"), aValue);
			this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), false);
		}
		else if(aName === "dropdownSelection/open") {
			this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), aValue);
		}
	}
	
	trigger(aName, aValue) {
		if(aName === "setSelection") {
			this._updateExternalValue(this.getSourcedPropWithDefault("valueName", "value"), aValue);
			this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), false);
		}
		if(aName === "close") {
			this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), false);
		}
	}
	
	_updateExternalValue(aValueName, aValue) {
		
		let updateController = this.getReference("value/" + aValueName);
		
		if(updateController) {
			updateController.updateValue(aValueName, aValue, null);
		}
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/DropdownSelection::_renderMainElement");
		
		let markup = this.getSourcedPropWithDefault("markup", DropdownSelection.DEFAULT_MARKUP);
		
		let value = this.getSourcedPropWithDefault("value", SourceData.create("prop", this.getSourcedProp("valueName")));
		let open = this.getSourcedPropWithDefault("open", SourceData.create("prop", this.getSourcedProp("openValueName")));
		
		//METODO: check that button exists
		
		return React.createElement("wrapper", {},
			React.createElement(FormField, {type: "hidden", name: this.props.name, value: value}),
			React.createElement(ReferenceInjection, {injectData: {"value/selection": this, "value/dropdownSelection/open": this, "trigger/setSelection": this, "trigger/close": this, "dropdownSelection/open": open, "dropdownSelection/value": value}},
				React.createElement(UseMarkup, {markup: markup}, this.props.children)
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
}

DropdownSelection.DEFAULT_MARKUP = React.createElement(Markup, {usedPlacements: "button,beforeList,afterList"},
	React.createElement(ClickOutsideTrigger, {triggerName: "close", active: SourceData.create("reference", "dropdownSelection/open")},
		React.createElement("div", {className: "absolute-container"},
			React.createElement(ToggleButton, {valueName: "dropdownSelection/open", value: SourceData.create("reference", "dropdownSelection/open")},
				React.createElement(MarkupChildren, {placement: "button"})
			),
			React.createElement("div", {className: "position-absolute dropdown-selection-popup full-width"},
				React.createElement(OpenCloseExpandableArea, {"open": SourceData.create("reference", "dropdownSelection/open")},
					React.createElement(MarkupChildren, {"placement": "beforeList"}),
					React.createElement(MarkupChildren, {"placement": "rest"}),
					React.createElement(MarkupChildren, {"placement": "afterList"})
				)
			)
		)
	)
);
