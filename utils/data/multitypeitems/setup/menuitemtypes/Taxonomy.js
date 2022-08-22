import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Taxonomy from "./Taxonomy";
export default class Taxonomy extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Taxonomy::prepare");
		
		aItem.requireValue("hasData/menuItem/taxonomy", false);
		aItem.requireSingleLink("term");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Taxonomy::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("term", aData["term"]);
		
		aItem.getValueSource("defaultText").input(aItem.getSingleLink("term").getValueSource("name"));
		//METODO: url
		
		aItem.setValue("hasData/menuItem/taxonomy", true);
		
		return this;
	}
}