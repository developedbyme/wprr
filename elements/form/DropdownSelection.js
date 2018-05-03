import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import FormField from "wprr/elements/form/FormField";
import ToggleButton from "wprr/elements/interaction/ToggleButton";
import OpenCloseExpandableArea from "wprr/elements/area/OpenCloseExpandableArea";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import Markup from "wprr/markup/Markup";
import MarkupChildren from "wprr/markup/MarkupChildren";
import UseMarkup from "wprr/markup/UseMarkup";

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
		this._updateExternalValue(this.getSourcedPropWithDefault("valueName", "value"), aValue);
		this._updateExternalValue(this.getSourcedPropWithDefault("openValueName", "open"), false);
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
		
		return <wrapper>
			<FormField type="hidden" name={this.props.name} value={value} />
			<ReferenceInjection injectData={{"value/selection": this, "value/dropdownSelection/open": this, "trigger/setSelection": this, "dropdownSelection/open": open, "dropdownSelection/value": value}}>
				<UseMarkup markup={markup}>
					{this.props.children}
				</UseMarkup>
			</ReferenceInjection>
		</wrapper>
	}
}

DropdownSelection.DEFAULT_MARKUP = <Markup usedPlacements="button">
									<div className="absolute-container">
										<ToggleButton valueName="dropdownSelection/open" value={SourceData.create("reference", "dropdownSelection/open")}>
											<MarkupChildren placement="button" />
										</ToggleButton>
										<div className="position-absolute drop-down-selection-popup">
											<OpenCloseExpandableArea open={SourceData.create("reference", "dropdownSelection/open")}>
												<MarkupChildren placement="rest" />
											</OpenCloseExpandableArea>
										</div>
									</div>
								</Markup>;
