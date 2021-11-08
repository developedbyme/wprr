import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import DataRangeLoader from "./DataRangeLoader";
export default class DataRangeLoader extends BaseObject {
	
	constructor() {
		super();
	}
	
	static setupData(aItem) {
		console.log("DataRangeLoader::setupData");
		
		let group = aItem.group;
		
		let data = aItem.getValue("data");
		let items = Wprr.objectPath(data, "items");
		let encodings = Wprr.objectPath(data, "encodings");
		for(let objectName in encodings) {
			console.log(objectName);
			let currentArray = encodings[objectName];
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let item = group.getItem(currentId);
				group.prepareItem(item, objectName);
				group.setupItem(item, objectName, items[""+currentId]);
			}
		}
		
		aItem.getLinks("range").addUniqueItems(Wprr.objectPath(data, "ids"));
		aItem.setValue("loaded", true);
	}
	
	static prepare(aItem) {
		console.log("DataRangeLoader::prepare");
		
		if(!aItem.getValue("hasData/dataRangeLoader")) {
			aItem.requireValue("loaded", false);
			aItem.requireValue("data", null);
			
			aItem.getType("data").addChangeCommand(Wprr.commands.callFunction(DataRangeLoader, DataRangeLoader.setupData, [aItem]))
			
			aItem.getLinks("range");
			
			let loader = aItem.group.project.getSharedLoader(aItem.id);
			aItem.addType("loader", loader);
			loader.load(); //MEDEBUG
			loader.addSuccessCommand(Wprr.commands.setProperty(aItem.getType("data").reSource(), "value", Wprr.sourceEvent("data")));
			
			
			aItem.setValue("hasData/dataRangeLoader", true);
			
			console.log("aItem>>>>>>>>>>", aItem);
		}
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		return this;
	}
}