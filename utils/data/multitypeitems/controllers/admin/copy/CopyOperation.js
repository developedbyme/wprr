import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import CopyOperation from "./CopyOperation";
export default class CopyOperation extends MultiTypeItemConnection {
	
	constructor() {
		super();
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.requireSingleLink("itemToCopy");
		this.item.requireValue("status", "waiting");
		this.item.requireValue("started", false);
		this.item.requireValue("done", false);
		this.item.getNamedLinks("connectedItems");
		
		let allLoaded = this.item.addNode("allLoaded", new Wprr.utils.data.nodes.logic.All());
		allLoaded.addValues(
			this.item.getValueSource("started")
		);
		
		this.item.requireValue("loaded", false).getValueSource("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._allLoaded));
		this.item.getValueSource("loaded").input(allLoaded.sources.get("output"));
		
		return this;
	}
	
	setItemToCopy(aId) {
		this.item.addSingleLink("itemToCopy", aId);
		
		return this;
	}
	
	addCopyOfRelations(aName, aRelationPath, aObjectTypes = null, aEncodings = "fields,fields/translations,relations") {
		
		let baseUrl = Wprr.objectPath(this.item.group.getItem("project"), "paths.linkedItem.pathController.wp/wprrData.fullPath");
		
		let item = this.item.group.createInternalItem();
		
		item.addSingleLink("copyOperation", this.item.id);
		item.requireValue("loaded", false);
		item.setValue("objectTypes", aObjectTypes);
		
		let links = item.getLinks("items");
		
		let loader = this.item.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		links.input(loader.item.getLinks("items"));
		//METODO: connect start and id to url
		
		let joinValues = this.item.addNode("joinValues", new Wprr.utils.data.nodes.JoinValues());
		joinValues.addValue(baseUrl + "/range/?select=objectRelation,anyStatus&encode=id&path=" + aRelationPath + "&fromIds=");
		joinValues.addValue(this.item.getType("itemToCopy").idSource);
		joinValues.separator = "";
		loader.item.getValueSource("url").input(joinValues.sources.get("output"));
		
		let detailsLoader = this.item.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", baseUrl + "/range/?select=idSelection,anyStatus&encode=" + aEncodings + "&ids={ids}");
		item.getValueSource("loaded").input(detailsLoader.item.getValueSource("loaded"))
		detailsLoader.item.getLinks("ids").input(links);
		
		let allLoaded = Wprr.objectPath(this.item, "allLoaded");
		allLoaded.addValues(
			item.getValueSource("loaded")
		);
		
		this.item.getNamedLinks("connectedItems").addItem(aName, item.id);
		
		return item;
	}
	
	_allLoaded() {
		console.log("CopyOperation::_allLoaded");
		
		let project = this.item.group.getItem("project").getType("controller");
		
		let loader = project.getLoader();
		
		let baseUrl = Wprr.objectPath(this.item.group.getItem("project"), "paths.linkedItem.pathController.wp/wprrData.fullPath");
		
		let data = {};
		let originalIds = {};
		
		//METODO: check if an item occurs in multiple sets
		
		let connectedItems = this.item.getNamedLinks("connectedItems");
		let currentArray = connectedItems.names;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			let currentData = connectedItems.getLinkByName(currentName);
			
			let objectTypes = currentData.getValue("objectTypes");
			
			if(objectTypes) {
				let uniqueIds = Wprr.utils.array.removeDuplicates(currentData.getLinks("items").ids);
				
				data[currentName] = {
					"amount": uniqueIds.length,
					"types": objectTypes
				}
				
				originalIds[currentName] = uniqueIds;
			}
			
		}
		
		loader.setupJsonPost(baseUrl + "/admin/create-posts/", {"data": data});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemsCreated, [Wprr.sourceEvent("data"), originalIds]))
		
		loader.load();
	}
	
	_itemsCreated(aData, aOriginalIds) {
		console.log("CopyOperation::_itemsCreated");
		console.log(aData, aOriginalIds);
		
		let connectedItems = this.item.getNamedLinks("connectedItems");
		let mainCopyMap = this.item.getNamedLinks("copyMap");
		
		for(let objectName in aOriginalIds) {
			let originalIds = aOriginalIds[objectName];
			let newIds = aData[objectName];
			
			let currentItem = connectedItems.getLinkByName(objectName);
			
			let copyMap = currentItem.getNamedLinks("copyMap");
			
			let currentArray = originalIds;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				copyMap.addItem(originalIds[i], newIds[i]);
				mainCopyMap.addItem(originalIds[i], newIds[i]);
				
				let currentArray2 = currentItem.getValue("objectTypes");
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let objectType = currentArray2[j];
					this.item.group.getItem(newIds[i]).getLinks("objectTypes").addItem("dbm_type:" + objectType);
				}
			}
		}
		
		this.item.setValue("status", "done");
		this.item.setValue("done", true);
	}
	
	start() {
		console.log("CopyOperation::start");
		
		if(this.item.getValue("status") === "waiting") {
			this.item.setValue("status", "processing");
			this.item.setValue("started", true);
		}
		
		return this;
	}
	
	static create(aItem) {
		let newCopyOperation = new CopyOperation();
		
		newCopyOperation.setItemConnection(aItem)
		newCopyOperation.setup();
		
		return newCopyOperation;
	}
}