import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PageDataSources from "./PageDataSources";
export default class PageDataSources extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("PageDataSources::prepare");
		
		aItem.requireValue("hasData/dataSources", false);
		aItem.getLinks("dataSources");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log(aData);
		
		aItem.getLinks("dataSources").addUniqueItems(aData["dataSources"]);
		aItem.setValue("hasData/dataSources", true);
		
		return this;
	}
}