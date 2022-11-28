import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PageSetting from "./PageSetting";
export default class PageSetting extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PageSetting::prepare");
		
		aItem.requireValue("hasData/pageSetting", false);
		aItem.requireValue("identifier", null);
		aItem.requireValue("data", null);
		
		aItem.requireSingleLink("headerType");
		aItem.requireSingleLink("heroType");
		aItem.requireSingleLink("footerType");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log(aData);
		
		aItem.setValue("hasData/pageSetting", true);
		
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("data", aData["data"]);
		
		aItem.addSingleLink("headerType", aData["headerType"]);
		aItem.addSingleLink("heroType", aData["heroType"]);
		aItem.addSingleLink("footerType", aData["footerType"]);
		
		return this;
	}
}