import React from "react";

import SelectionAreaCreator from "wprr/wp/SelectionAreaCreator";

import DbmContentFunctions from "wprr/wp/dbmcontent/DbmContentFunctions";
import SourceData from "wprr/reference/SourceData";

// import DbmContentSelectionAreaCreator from "wprr/wp/dbmcontent/DbmContentSelectionAreaCreator";
export default class DbmContentSelectionAreaCreator extends SelectionAreaCreator {
	
	constructor() {
		super();
	}
	
	setField(aPath) {
		//console.log("wprr/wp/dbmcontent/DbmContentSelectionAreaCreator::setField");
		this.setSource(SourceData.createFunction(DbmContentFunctions._source_relationSlugs, aPath));
		
		return this;
	}
	
	static create(aPath, aAreasObject) {
		var newDbmContentSelectionAreaCreator = new DbmContentSelectionAreaCreator();
		
		newDbmContentSelectionAreaCreator.setField(aPath);
		newDbmContentSelectionAreaCreator.addAreas(aAreasObject);
		
		return newDbmContentSelectionAreaCreator;
	}
}