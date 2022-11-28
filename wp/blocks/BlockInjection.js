import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import BlockInjection from "wprr/wp/blocks/BlockInjection";
export default class BlockInjection {
	
	constructor() {
		
		this._element = null;
		
		this._blockDataReferenceName = "blockData";
		this._blockDataToProps = new Array();
		
		this.inject = this._inject.bind(this);
	}
	
	setElement(aElement) {
		
		this._element = aElement;
		
		return this;
	}
	
	addBlockDataProp(aDataName, aChangedPropName = null) {
		let newObject = new Object();
		
		newObject["data"] = aDataName;
		if(aChangedPropName) {
			newObject["propName"] = aChangedPropName;
		}
		else {
			newObject["propName"] = aDataName;
		}
		
		this._blockDataToProps.push(newObject);
		
		return this;
	}
	
	addBlockDataProps(...aNames) {
		let currentArray = aNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this.addBlockDataProp(currentArray[i]);
		}
		
		//console.log(this);
		
		return this;
	}
	
	_inject(aData, aItemKey, aReferences, aReturnArray) {
		
		let blockDataProps = new Object();
		let currentArray = this._blockDataToProps;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			blockDataProps[currentData["propName"]] = Wprr.sourceReference(this._blockDataReferenceName, currentData["data"]);
		}
		
		let injectData = new Object();
		injectData[this._blockDataReferenceName] = aData;
		
		let returnElement = React.createElement(Wprr.ReferenceInjection, {"key": aItemKey, "injectData": injectData}, 
			React.createElement(Wprr.ManipulationBaseObject, blockDataProps,
				this._element
			)
		);
		
		aReturnArray.push(returnElement);
	}
}