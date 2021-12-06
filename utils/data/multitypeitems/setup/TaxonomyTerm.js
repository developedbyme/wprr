import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TaxonomyTerm from "./TaxonomyTerm";
export default class TaxonomyTerm extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("TaxonomyTerm::prepare");
		
		aItem.requireValue("hasData/taxonomyTerm", false);
		aItem.requireValue("systemId", null);
		aItem.requireValue("name", null);
		aItem.requireValue("slug", null);
		
		aItem.requireSingleLink("parent");
		aItem.getLinks("children");
		
		let index = aItem.id.lastIndexOf("/");
		if(index !== -1) {
			let parentPath = aItem.id.substring(0, index);
			aItem.addSingleLink("parent", parentPath);
		}
		
		let taxonomyIndex = aItem.id.indexOf(":");
		let taxonomyName = aItem.id.substring(0, taxonomyIndex);
		aItem.addSingleLink("taxonomy", "taxonomy:" + taxonomyName);
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("TaxonomyTerm::setup");
		console.log(aData);
		
		aItem.setValue("systemId", aData["id"]);
		aItem.setValue("name", aData["name"]);
		aItem.setValue("slug", aData["slug"]);
		aItem.setValue("hasData/taxonomyTerm", true);
		
		return this;
	}
}