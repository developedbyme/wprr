import React from "react";
import {Fragment} from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import SelectSection from "wprr/elements/area/SelectSection";
export default class SelectSection extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._canBeEmpty = false;
		this._canHaveMultipleChildren = false;
		
		this._propsThatShouldNotCopy.push("selectedSections");
	}
	
	_isSectionActive(aSection, aActiveSection) {
		//console.log("wprr/elements/area/SelectSection::_isSectionActive");
		//console.log(aSection, aActiveSection);
		
		return (aActiveSection.indexOf(aSection) !== -1);
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
		
		let availableChildren;
		if(children instanceof Array) {
			availableChildren = children;
		}
		else {
			availableChildren = [children];
		}
		
		let mainProps = this._getMainElementProps();
		
		let activeChildren = new Array();
		let currentArray = availableChildren;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			
			if(this._isSectionActive(currentChild.props["data-section-name"], selectedSections)) {
				activeChildren.push(this._performClone(currentChild, mainProps));
			}
			else if(this._isSectionActive(currentChild.props.sectionName, selectedSections)) {
				activeChildren.push(this._performClone(currentChild, mainProps));
			}
		}
		
		if(activeChildren.length === 0) {
			if(!this._canBeEmpty && !this.props.canBeEmpty) {
				console.warn("Object doesn't have any active children.");
			}
			return null;
		}
		if(activeChildren.length > 1) {
			if(this._canHaveMultipleChildren) {
				return <Fragment>
					{activeChildren}
				</Fragment>;
			}
			
			console.warn("Object has to many active children. Using first active child for ", this);
		}
		return activeChildren[0];
	}
}
