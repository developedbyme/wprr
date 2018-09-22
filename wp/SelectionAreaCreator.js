import React from "react";

import SelectSection from "wprr/elements/area/SelectSection";
import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

// import SelectionAreaCreator from "wprr/wp/SelectionAreaCreator";
export default class SelectionAreaCreator {
	
	constructor() {
		this._source = null;
		
		this._areas = new Object();
	}
	
	setSource(aSource) {
		//console.log("wprr/wp/SelectionAreaCreator::setSource");
		this._source = aSource;
		
		return this;
	}
	
	addArea(aName, aAreaElement) {
		this._areas[aName] = aAreaElement;
		
		return this;
	}
	
	addAreas(aAreasObject) {
		for(let objectName in aAreasObject) {
			this.addArea(objectName, aAreasObject[objectName]);
		}
		
		return this;
	}
	
	getReactElements() {
		
		let sections = new Array();
		for(let objectName in this._areas) {
			sections.push(React.createElement(ManipulationBaseObject, {"key": "section-" + objectName, "sectionName": objectName}, this._areas[objectName]));
		}
		
		return React.createElement(SelectSection, {"selectedSections": this._source}, sections);
	}
	
	static create(aSource = null, aAreasObject = null) {
		var newSelectionAreaCreator = new SelectionAreaCreator();
		
		if(aSource) {
			newSelectionAreaCreator.setSource(aSource);
		}
		if(aAreasObject) {
			newSelectionAreaCreator.addAreas(aAreasObject);
		}
		
		return newSelectionAreaCreator;
	}
}