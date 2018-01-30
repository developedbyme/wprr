import React from 'react';

import PropTypes from 'prop-types';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import UseMarkup from "wprr/markup/UseMarkup";
import SourceData from "wprr/reference/SourceData";
import Markup from "wprr/markup/Markup";

//import MarkupChildren from "wprr/markup/MarkupChildren";
export default class MarkupChildren extends ManipulationBaseObject {

	constructor (props) {
		super(props);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/markup/MarkupChildren::_manipulateProps");
		
		var injectionType = this.getSourcedProp("injectionType");
		if(injectionType === "dynamicChildren") {
			aReturnObject["dynamicChildren"] = this._getInjectionChildren();
		}
		
		return aReturnObject;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/markup/MarkupChildren::_removeUsedProps");
		
		delete aReturnObject["injectionType"];
		delete aReturnObject["placement"];
		delete aReturnObject["selectChildren"];
		
		return aReturnObject;
	}
	
	_getRestChildren(aChildren, aUsedPlacements) {
		
		if(!aUsedPlacements) {
			return aChildren;
		}
		
		var returnArray = new Array();
		
		var currentArray = aChildren;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			var currentElement = currentArray[i];
			if(currentElement && currentElement.props && aUsedPlacements.indexOf(currentElement.props["placement"]) !== -1) {
				//MENOTE: do nothing
			}
			else {
				returnArray.push(currentElement);
			}
		}
		
		return returnArray;
	}
	
	_getInjectionChildrenForPlacement(aPlacement, aAllChildren, aUsedPlacements) {
		//console.log("wprr/markup/MarkupChildren::_getInjectionChildrenForPlacement");
		//console.log(aPlacement, aUsedPlacements, aAllChildren);
		
		if(aPlacement === "all") {
			return aAllChildren;
		}
		else if(aPlacement === "rest") {
			return this._getRestChildren(aAllChildren, aUsedPlacements);
		}
		
		var returnArray = new Array();
		
		var currentArray = aAllChildren;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			if(currentElement && currentElement.props && currentElement.props["placement"] === aPlacement) {
				returnArray.push(currentElement);
			}
		}
		
		return returnArray;
	}
	
	_getInjectionChildren() {
		//console.log("wprr/markup/MarkupChildren::_getInjectionChildren");
		var allChildren = this.context.markupChildren;
		var usedPlacements = this.context.markupUsedPlacements;
		
		if(!allChildren) {
			console.error("Markup doesn't have any children", this);
			return [];
		}
		
		var placement = this.getSourcedPropWithDefault("placement", "all");
		
		var returnArray = this._getInjectionChildrenForPlacement(placement, allChildren, usedPlacements);
		
		return returnArray;
	}
	
	_adjustChildrenForMarkupInjection(aChildren) {
		var returnArray = new Array();
		
		var currentArray = aChildren;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			var passOnInjection = false;
			
			if(currentElement.props && currentElement.props["passOnInjection"]) {
				if(currentElement.props["passOnInjection"]) { //METODO: string alisases
					passOnInjection = true;
				}
			}
			else if(currentElement.type === UseMarkup) {
				passOnInjection = true;
			}
			
			if(passOnInjection) {
				
				var children;
				
				if(currentElement.props && currentElement.props["selectChildren"] !== undefined) {
					var selectData = currentElement.props["selectChildren"]; //METODO: source this
					if(typeof(selectData) === "string") {
						children = new Array();
						
						var allChildren = this.context.markupChildren;
						var usedPlacements = this.context.markupUsedPlacements;
						
						var currentArray2 = selectData.split(",");
						var currentArray2Length = currentArray2.length;
						for(var j = 0; j < currentArray2Length; j++) {
							var currentChildren = this._getInjectionChildrenForPlacement(currentArray2[j], allChildren, usedPlacements);
							
							children = children.concat(currentChildren);
						}
					}
					else {
						children = selectData; 
					}
				}
				else if(this.props.dynamicChildren) {
					var allChildren = this.context.markupChildren;
					
					children = <Markup injectChildren={allChildren}>{this.props.dynamicChildren}</Markup>;
				}
				else if(this.props.children) {
					var allChildren = this.context.markupChildren;
					
					children = <Markup injectChildren={allChildren}>{this.props.children}</Markup>;
				}
				else {
					children = currentElement.props.dynamicChildren ? currentElement.props.dynamicChildren : currentElement.props.children;
				}
				
				var selectChildren = <ManipulationBaseObject dynamicChildren={children}>
					{currentElement}
				</ManipulationBaseObject>;
				
				returnArray.push(selectChildren);
			}
			else {
				returnArray.push(currentElement);
			}
		}
		
		return returnArray;
	}
	
	_createClonedElement() {
		//console.log("wprr/markup/MarkupChildren::_createClonedElement");
		
		var injectionType = this.getSourcedProp("injectionType");
		if(injectionType === "dynamicChildren") {
			super._createClonedElement();
			return;
		}
		
		var returnArray = this._adjustChildrenForMarkupInjection(this._getInjectionChildren());
		
		if(returnArray.length === 0) {
			this._clonedElement = null;
		}
		else if(returnArray.length === 1) {
			this._clonedElement = this._performClone(returnArray[0], this._getMainElementProps());
		}
		else {
			var callArray = [this._getMainElementType(), {}];
			callArray = callArray.concat(returnArray);
			
			this._clonedElement = React.createElement.apply(React, callArray);
		}
	}
}

MarkupChildren.contextTypes = {
	"markupUsedPlacements": PropTypes.array,
	"markupChildren": PropTypes.array
};
