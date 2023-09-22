import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import UploadedFile from "./UploadedFile";
export default class UploadedFile extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("UploadedFile::prepare");
		
		aItem.requireValue("hasData/uploadedFile", false);
		aItem.requireValue("fileName", null);
		aItem.requireValue("url", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("UploadedFile::setup");
		//console.log(aItem, aData);
		
		aItem.setValue("fileName", aData["fileName"]);
		aItem.setValue("url", aData["url"]);
		aItem.setValue("hasData/uploadedFile", true);
		
		return this;
	}
}