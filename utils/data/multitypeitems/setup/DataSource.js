import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import DataSource from "./DataSource";
export default class DataSource extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("DataSource::prepare");
		
		aItem.requireValue("hasData/dataSource", false);
		aItem.requireValue("dataName", null);
		aItem.requireValue("data", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log(aData);
		
		aItem.setValue("hasData/dataSource", true);
		aItem.setValue("dataName", aData["dataName"]);
		aItem.setValue("data", aData["data"]);
		
		return this;
	}
}