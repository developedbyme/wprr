import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Breadcrumb from "./Breadcrumb";
export default class Breadcrumb extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Breadcrumb::prepare");
		
		aItem.requireValue("hasData/breadcrumb", false);
		aItem.getLinks("breadcrumb");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log(aData);
		
		aItem.getLinks("breadcrumb").setItems(aData["breadcrumb"]);
		aItem.setValue("hasData/breadcrumb", true);
		
		return this;
	}
}