import React from "react";
import {Fragment} from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import SelectSection from "wprr/elements/area/SelectSection";
export default class SelectSection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._canBeEmpty = false;
		this._canHaveMultipleChildren = false;
		
		this._propsThatShouldNotCopy.push("selectedSections");
	}
	
	_isSectionActive(aSection, aActiveSection) {
		//console.log("wprr/elements/area/SelectSection::_isSectionActive");
		//console.log(aSection, aActiveSection);
		
		if(!aSection) {
			return false;
		}
		
		let sectionNames = Wprr.utils.array.arrayOrSeparatedString(aSection);
		let currentArray = sectionNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSection = currentArray[i];
			if(aActiveSection.indexOf(currentSection) !== -1) {
				return true;
			}
		}
		
		return false;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/StatusGroup::_removeUsedProps");
		
		delete aReturnObject["selectedSections"];
		delete aReturnObject["canBeEmpty"];
		
		return aReturnObject;
	}
	
	_renderClonedElement() {
		//console.log("wprr/elements/area/SelectSection::_renderClonedElement");
		
		//MENOTE: this.props.children can be undefiend, the only child or an array
		let children = this.props.children;
		if(children == undefined) {
			console.error("Object doesn't have any children. Can't render main element for ", this);
			//METODO: check for error display
			return null;
		}
		
		let selectedSections = this.getSourcedProp("selectedSections");
		if(typeof(selectedSections) === "string") {
			selectedSections = selectedSections.split(","); //METODO: trim whitespace
		}
		if(!(selectedSections instanceof Array)) {
			console.warn("Selected sections are not an array.", this);
			selectedSections = [];
		}
		
		let availableChildren;
		if(children instanceof Array) {
			availableChildren = children;
		}
		else {
			availableChildren = [children];
		}
		
		let mainProps = this._getMainElementProps();
		
		let hasActive = false;
		let defaultChild = null;
		let activeChildren = new Array();
		let currentArray = availableChildren;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			
			if(this._isSectionActive(currentChild.props["data-section-name"], selectedSections)) {
				activeChildren.push(this._performClone(currentChild, mainProps));
				hasActive = true;
			}
			else if(this._isSectionActive(currentChild.props.sectionName, selectedSections)) {
				activeChildren.push(this._performClone(currentChild, mainProps));
				hasActive = true;
			}
			
			if(!hasActive && !defaultChild) {
				if(currentChild.props["data-default-section"] === "true" || currentChild.props["data-default-section"] == true) {
					defaultChild = currentChild;
				}
			}
		}
		
		if(activeChildren.length === 0) {
			if(defaultChild) {
				activeChildren.push(this._performClone(defaultChild, mainProps));
			}
			else {
				if(!this._canBeEmpty && !this.props.canBeEmpty) {
					console.warn("Object doesn't have any active children.", this);
				}
				return null;
			}
		}
		if(activeChildren.length > 1) {
			if(this._canHaveMultipleChildren || this.getSourcedProp("canHaveMultipleChildren")) {
				return React.createElement(React.Fragment, {}, activeChildren);
			}
			
			console.warn("Object has to many active children. Using first active child for ", this);
		}
		return activeChildren[0];
	}
}
