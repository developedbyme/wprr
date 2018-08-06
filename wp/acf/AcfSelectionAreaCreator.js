import React from "react";

import SelectionAreaCreator from "wprr/wp/SelectionAreaCreator";

import SourceData from "wprr/reference/SourceData";

// import AcfSelectionAreaCreator from "wprr/wp/acf/AcfSelectionAreaCreator";
export default class AcfSelectionAreaCreator extends SelectionAreaCreator {
	
	constructor() {
		super();
	}
	
	setField(aPath) {
		//console.log("wprr/wp/acf/AcfSelectionAreaCreator::setField");
		this.setSource(SourceData.create("acfField", aPath));
		
		return this;
	}
	
	static create(aPath, aAreasObject) {
		var newAcfSelectionAreaCreator = new AcfSelectionAreaCreator();
		
		newAcfSelectionAreaCreator.setField(aPath);
		newAcfSelectionAreaCreator.addAreas(aAreasObject);
		
		return newAcfSelectionAreaCreator;
	}
}