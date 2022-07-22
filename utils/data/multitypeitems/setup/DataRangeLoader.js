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
		
		let ranges = aItem.getType("ranges").linkedItem;
		
		let data = aItem.getValue("data");
		let items = Wprr.objectPath(data, "items");
		let encodings = Wprr.objectPath(data, "encodings");
		for(let objectName in encodings) {
			let ids = encodings[objectName];
			let currentArray = ids;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let item = group.getItem(currentId);
				group.prepareItem(item, objectName);
				group.setupItem(item, objectName, items[""+currentId]);
			}
			
			if(objectName !== "id") {
				ranges.getLinks(objectName).setItems(ids);
			}
		}
		
		let mainIds = Wprr.objectPath(data, "ids");
		ranges.getLinks("main").setItems(mainIds);
		
		let calculations = aItem.getValue("calculations");
		{
			let currentArray = calculations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentCalculation = currentArray[i];
				let rangePath = currentCalculation["range"];
				let range = Wprr.objectPath(ranges, rangePath);
				if(range) {
					let calculation = currentCalculation["calculation"];
				
					let currentArray2 = range;
					let currentArray2Length = currentArray2.length;
					for(let j = 0; j < currentArray2Length; j++) {
						calculation.call(window, currentArray2[j]);
					}
				}
			}
		}
		
		aItem.getLinks("range").addUniqueItems(mainIds);
		aItem.setValue("itemsSetup", true);
	}
	
	static prepare(aItem) {
		//console.log("DataRangeLoader::prepare");
		
		if(!aItem.getValue("hasData/dataRangeLoader")) {
			aItem.requireValue("calculations", new Array());
			aItem.requireValue("itemsSetup", false);
			
			let loader = aItem.group.project.getSharedLoader(aItem.id);
			aItem.addType("loader", loader);
			
			aItem.getType("data").addChangeCommand(Wprr.commands.callFunction(DataRangeLoader, DataRangeLoader.setupData, [aItem]))
			//METODO: check if data already is loaded
			
			aItem.getLinks("range");
			aItem.requireSingleLink("ranges", aItem.group.createInternalItem().id);
			aItem.getType("ranges").linkedItem.addSingleLink("dataRangeLoader", aItem.id);
			
			aItem.setValue("hasData/dataRangeLoader", true);
		}
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		//MENOTE: do nothing
		
		return this;
	}
}