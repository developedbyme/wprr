import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

import SourceData from "wprr/reference/SourceData";

//import InArraySelection from "wprr/manipulation/adjustfunctions/control/form/InArraySelection";
export default class InArraySelection extends ControlFunction {

	constructor() {
		super();
		
		this.setInput("value", SourceData.create("prop", "value"));
		this.setInput("selectedValue", SourceData.create("prop", "selectedValue"));
		this.setInput("externalValueName", SourceData.create("prop", "valueName"));
		this.setInput("internalValueName", SourceData.create("prop", "internalValueName"));
		
	}
	
	_addValueToArray() {
		let selectedValue = this.getInputFromSingleOwner("selectedValue")
		
		let currentValue = this.getInputFromSingleOwner("value");
		let index = currentValue.indexOf(selectedValue);
		if(index === -1) {
			let newArray = currentValue.concat([]);
			newArray.push(selectedValue);
			
			let externalValueName = this.getInputFromSingleOwner("externalValueName");
			let valueController = this.getSingleOwner().getReference("value/" + externalValueName);
			if(valueController) {
				valueController.updateValue(externalValueName, newArray);
			}
			else {
				console.warn("Value controller for " + externalValueName + " doesn't exist.", this);
			}
		}
	}
	
	_removeValueFromArray() {
		let selectedValue = this.getInputFromSingleOwner("selectedValue")
		
		let currentValue = this.getInputFromSingleOwner("value");
		let index = currentValue.indexOf(selectedValue);
		if(index !== -1) {
			let newArray = currentValue.concat([]);
			newArray.splice(index, 1);
			
			let externalValueName = this.getInputFromSingleOwner("externalValueName");
			let valueController = this.getSingleOwner().getReference("value/" + externalValueName);
			if(valueController) {
				valueController.updateValue(externalValueName, newArray);
			}
			else {
				console.warn("Value controller for " + externalValueName + " doesn't exist.", this);
			}
		}
	}
	
	updateValue(aName, aValue) {
		console.log("wprr/manipulation/adjustfunctions/control/form/InArraySelection::updateValue");
		
		if(aName === this.getInputFromSingleOwner("internalValueName")) {
			if(aValue) {
				this._addValueToArray();
			}
			else {
				this._removeValueFromArray();
			}
		}
	}
	
	trigger(aName, aValue) {
		console.log("wprr/manipulation/adjustfunctions/control/form/InArraySelection::trigger");
		
		if(aName === this.getInputFromSingleOwner("internalValueName")) {
			if(aValue) {
				this._addValueToArray();
			}
			else {
				this._removeValueFromArray();
			}
		}
	}
	
	injectReferences(aReturnObject) {
		aReturnObject["trigger/" + this.getInputFromSingleOwner("internalValueName")] = this;
		aReturnObject["value/" + this.getInputFromSingleOwner("internalValueName")] = this;
	}
	
	_getInitialState() {
		let returnObject = super._getInitialState();
		
		
		
		return returnObject;
	}
	
	/**
	 * Adjusts data. This function should be overridden by classes extending from this base object.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		console.log("wprr/manipulation/adjustfunctions/control/form/InArraySelection::adjust");
		
		let value = this.getInput("value", aData, aManipulationObject);
		let selectedValue = this.getInput("selectedValue", aData, aManipulationObject);
		let internalValueName = this.getInput("internalValueName", aData, aManipulationObject);
		
		console.log(value, selectedValue);
		
		let isSelected = (value.indexOf(selectedValue) !== -1);
		
		aData[internalValueName] = isSelected;
		
		return aData;
	}
	
	static create(aValue, aSelectedValue, aExternalValueName, aInternalValueName) {
		let newInArraySelection = new InArraySelection();
		
		newInArraySelection.setInputWithoutNull("value", aValue);
		newInArraySelection.setInputWithoutNull("selectedValue", aSelectedValue);
		newInArraySelection.setInputWithoutNull("externalValueName", aExternalValueName);
		newInArraySelection.setInputWithoutNull("internalValueName", aInternalValueName);
		
		return newInArraySelection;
	}
}
