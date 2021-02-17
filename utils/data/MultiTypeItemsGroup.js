import Wprr from "wprr/Wprr";

import MultiTypeItem from "wprr/utils/data/MultiTypeItem";
import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import AdditionalLoader from "wprr/utils/data/AdditionalLoader";

// import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";
export default class MultiTypeItemsGroup extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._prefix = "item";
		this._items = new Object();
		
		this._internalPrefix = "-internal";
		this._nextInternalId = 0;
		
		this._additionalLoader = null;
		this._commands = null;
	}
	
	get prefix() {
		return this._prefix;
	}
	
	set prefix(aValue) {
		this._prefix = aValue;
		
		return this._prefix;
	}
	
	get additionalLoader() {
		if(!this._additionalLoader) {
			this._additionalLoader = new AdditionalLoader();
			this._additionalLoader.setProject(this.project);
			this._additionalLoader.setItems(this);
		}
		
		return this._additionalLoader;
	}
	
	get commands() {
		if(!this._commands) {
			let commandGroup = new Wprr.utils.CommandGroup();
			commandGroup.setOwner(this);
			this._commands = commandGroup;
		}
		
		return this._commands;
	}
	
	setProject(aProject) {
		super.setProject(aProject);
		
		if(this._additionalLoader) {
			this._additionalLoader.setProject(this.project);
		}
		
		return this;
	}
	
	setupItem(aItem, aSetupType, aData) {
		//console.log("setupItem");
		//console.log(aItem, aSetupType);
		
		this.commands.perform("setupItem/" + aSetupType, {"item": aItem, "data": aData, "setupType": aSetupType});
		
		return this;
	}
	
	getItem(aId) {
		//console.log("getItem");
		//console.log(aId);
		
		let nameWithPrefix = this._prefix + aId;
		
		if(!this._items[nameWithPrefix]) {
			this._items[nameWithPrefix] = MultiTypeItem.create(aId).setGroup(this);
		}
		
		return this._items[nameWithPrefix];
	}
	
	getTerm(aId) {
		return this.getItem("term" + aId);
	}
	
	getItems(aIds) {
		let returnArray = new Array();
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			returnArray.push(this.getItem(currentId));
		}
		
		return returnArray;
	}
	
	hasItem(aId) {
		let nameWithPrefix = this._prefix + aId;
		return (this._items[nameWithPrefix] !== undefined);
	}
	
	hasItemType(aId, aType) {
		if(this.hasItem(aId)) {
			let item = this.getItem(aId);
			if(item.hasType(aType)) {
				return true;
			}
		}
		return false;
	}
	
	hasItems(aIds) {
		let currentArray = Wprr.utils.array.singleOrArray(aIds);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			if(!this.hasItem(currentId)) {
				return false;
			}
		}
		
		return true;
	}
	
	hasItemsWithType(aIds, aType) {
		
		if(!aIds) {
			console.error("Ids are not set", aIds, aType, this);
			return false;
		}
		
		let currentArray = Wprr.utils.array.singleOrArray(aIds);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			if(!this.hasItemType(currentId, aType)) {
				return false;
			}
		}
		
		return true;
	}
	
	getIdsWithMissingType(aIds, aType) {
		
		let returnArray = new Array();
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			if(!this.hasItemType(currentId, aType)) {
				returnArray.push(currentId);
			}
		}
		
		return returnArray;
	}
	
	mapFromIds(aIds, aPath) {
		//console.log("mapFromIds");
		//console.log(aIds, aPath);
		let items = this.getItems(aIds);
		
		return Wprr.utils.array.mapField(items, aPath);
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("getValueForPath");
		//console.log(aPath);
		
		let tempArray = (""+aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "prefix":
			case "additionalLoader":
			case "commands":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getItem(firstPart), restParts);
	}
	
	generateNextInternalId() {
		let nextId = this._nextInternalId;
		this._nextInternalId++;
		
		return this._internalPrefix + nextId;
	}
	
	_setSlugPathForItem(aItem) {
		//console.log("_setSlugPathForItem");
		//console.log(aItem);
		
		let parent = Wprr.objectPath(aItem, "parent.linkedItem");
		if(parent) {
			if(!parent.hasType("slugPath")) {
				this._setSlugPathForItem(parent);
			}
			aItem.addType("slugPath", parent.getType("slugPath") + "/" + aItem.getType("slug"));
		}
		else {
			aItem.addType("slugPath", aItem.getType("slug"));
		}
	}
	
	addTerms(aTerms, aTaxonomy) {
		//console.log("addTerms");
		//console.log(aTerms, aTaxonomy);
		
		let allIds = new Array();
		let allItems = new Array();
		let topLevel = new Array();
		let children = new Object();
		
		let taxonomyItemName = "taxonomy-" + aTaxonomy;
		
		{
			let currentArray = aTerms;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTerm = currentArray[i];
				let currentId = currentTerm["id"];
				let itemId = "term" + currentId;
			
				allIds.push(itemId);
			
				let item = this.getItem(itemId);
				allItems.push(item);
				item.addType("data", currentTerm);
				item.addType("slug", currentTerm["slug"]);
				item.addType("name", currentTerm["name"]);
				item.addSelectLink("childBySlug", "children", "slug");
				item.addSingleLink("taxonomy", taxonomyItemName);
			
				//METODO: add child by path
			
				let parentId = currentTerm["parentId"]
				if(parentId) {
					let parentItemId = "term" + parentId;
					item.addSingleLink("parent", parentItemId);
				
					if(!children[parentItemId]) {
						children[parentItemId] = new Array();
					}
				
					children[parentItemId].push(itemId);
				}
				else {
					topLevel.push(itemId);
				}
			}
		}
		
		{
			let currentArray = allItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				if(!currentItem.hasType("slugPath")) {
					this._setSlugPathForItem(currentItem);
				}
			}
		}
		
		for(let objectName in children) {
			let currentItem = this.getItem(objectName);
			let currentChildrenLinks = currentItem.getLinks("children");
			currentChildrenLinks.addItems(children[objectName]);
		}
		
		let taxonomyItem = this.getItem(taxonomyItemName);
		taxonomyItem.addType("systemName", aTaxonomy);
		
		let allLinks = taxonomyItem.getLinks("all");
		allLinks.addItems(allIds);
		
		let topLevelLinks = taxonomyItem.getLinks("topLevel");
		topLevelLinks.addItems(topLevel);
		
		taxonomyItem.addSelectLink("termBySlug", "all", "slug");
		taxonomyItem.addSelectLink("termBySlugPath", "all", "slugPath");
		taxonomyItem.addSelectLink("topLevelTermBySlug", "topLevel", "slug");
		
		return this;
	}
	
	addRange(aPath, aItems) {
		let ids = Wprr.utils.array.mapField(aItems, "id");
		
		let currentItem = this.getItem(aPath);
		currentItem.addType("path", aPath);
		
		let allLinks = currentItem.getLinks("all");
		allLinks.addItems(ids);
		
		return this;
	}
	
	setupRangeItems(aItems, aTypes) {
		//console.log("MultiTypeItemsGroup::setupRangeItems");
		//console.log(aItems, aTypes);
		
		let currentArray2 = Wprr.utils.array.arrayOrSeparatedString(aTypes);
		let currentArray2Length = currentArray2.length;
		
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			let currentId = currentData["id"];
			
			let item = this.getItem(currentId);
			for(let j = 0; j < currentArray2Length; j++) {
				item.setup(currentArray2[j], currentData);
			}
		}
		
		return this;
	}
	
	setupItems(aIds, aTypes, aData) {
		let currentArray2 = Wprr.utils.array.arrayOrSeparatedString(aTypes);
		let currentArray2Length = currentArray2.length;
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			
			let item = this.getItem(currentId);
			for(let j = 0; j < currentArray2Length; j++) {
				item.setup(currentArray2[j], aData);
			}
		}
		
		return this;
	}
}