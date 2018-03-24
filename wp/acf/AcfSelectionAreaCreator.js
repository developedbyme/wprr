import React from "react";

import SelectSection from "wprr/elements/area/SelectSection";
import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

// import AcfSelectionAreaCreator from "wprr/wp/acf/AcfSelectionAreaCreator";
export default class AcfSelectionAreaCreator {
	
	constructor() {
		this._acfSource = null;
		
		this._areas = new Object();
	}
	
	setField(aPath) {
		//console.log("wprr/wp/acf/AcfSelectionAreaCreator::setField");
		this._acfSource = SourceData.create("acfField", aPath);
		
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
			sections.push(<ManipulationBaseObject key={"section-" + objectName} sectionName={objectName}>
				{this._areas[objectName]}
			</ManipulationBaseObject>);
		}
		
		return <SelectSection selectedSections={this._acfSource}>
			{sections}
		</SelectSection>
	}
	
	static create(aPath, aAreasObject) {
		var newAcfSelectionAreaCreator = new AcfSelectionAreaCreator();
		
		newAcfSelectionAreaCreator.setField(aPath);
		newAcfSelectionAreaCreator.addAreas(aAreasObject);
		
		return newAcfSelectionAreaCreator;
	}
}