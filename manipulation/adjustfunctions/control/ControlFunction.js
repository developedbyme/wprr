import SourceData from "wprr/reference/SourceData";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";
/**
 * Base object for control functions.
 */
export default class ControlFunction extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._owners = new Array();
	}
	
	setState(aStateObject) {
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			currentOwner.setState(aStateObject);
		}
	}
	
	getInputFromSingleOwner(aName) {
		let inputData = this.getRawInput(aName);
		if(inputData instanceof SourceData) {
			if(this._owners.length === 0) {
				console.error("Source can't be resolved without any owner.");
				return null;
			}
			else if(this._owners.length !== 1) {
				console.error("Source can't be resolved with multiple owners.");
				return null;
			}
			
			let singleOwner = this._owners[0];
			return this.getInput(aName, singleOwner.props, singleOwner);
		}
		
		return inputData;
		
		
	}
	
	getSingleOwner() {
		if(this._owners.length === 0) {
			console.error("No owner.");
			return null;
		}
		else if(this._owners.length !== 1) {
			console.error("Too many owners.");
			return null;
		}
		
		let singleOwner = this._owners[0];
		return singleOwner;
	}
	
	_getInitialState() {
		//MENOTE: should be overridden
		return {};
	}
	
	_setInitialStateToOwner(aOwner) {
		aOwner.setState(this._getInitialState());
	}
	
	addOwner(aOwner) {
		this._owners.push(aOwner);
		
		this._setInitialStateToOwner(aOwner);
		
		return this;
	}
	
	removeOwner(aOwner) {
		let isFound = false;
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			if(currentOwner === aOwner) {
				currentArray.splice(i, 1);
				isFound = false;
				break;
			}
		}
		
		if(!isFound) {
			console.warn("Owner not find in control. Can't remove", this);
		}
		
		return this;
	}
	
	injectReferences(aReturnObject) {
		//MENOTE: should be overridden
	}
}
