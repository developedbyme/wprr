import Wprr from "wprr/Wprr";

import MultiTypeItem from "wprr/utils/data/MultiTypeItem";
import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";

// import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";
export default class MultiTypeItemsGroup extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._prefix = "item";
		this._items = new Object();
		
		this._internalPrefix = "-internal";
		this._nextInternalId = 0;
	}
	
	get prefix() {
		return this._prefix;
	}
	
	set prefix(aValue) {
		this._prefix = aValue;
		
		return this._prefix;
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
			aItem.addType("slugPath", parent.getType("slug") + "/" + aItem.getType("slug"));
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
		
	}
}