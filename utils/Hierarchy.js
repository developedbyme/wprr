import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import Hierarchy from "wprr/utils/Hierarchy";
export default class Hierarchy extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this.createSource("structure");
	}
	
	_createHierarchyItem(aLinkedId, aChildrenLinks) {
		let parent = aChildrenLinks.item;
		let items = parent.group;
		
		let childItem = items.createInternalItem();
		childItem.addSingleLink("link", aLinkedId);
		childItem.addSingleLink("parent", parent.id);
		childItem.getLinks("children");
		aChildrenLinks.addItem(childItem.id);
		
		return childItem;
	}
	
	_setupList(aList, aItem) {
		console.log("_setupList");
		console.log(aList, aItem);
		
		let returnList = new Array();
		let childrenLinks = aItem.getLinks("children");
		let items = aItem.group;
		
		let currentArray = aList;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentId = 0;
			let children = [];
			if(currentItem instanceof Object) {
				currentId = Wprr.objectPath(currentItem, "id");
				children = Wprr.objectPath(currentItem, "children");
			}
			else {
				currentId = currentItem;
			}
			
			let childItem = this._createHierarchyItem(currentId, childrenLinks);
			
			let returnChildren = this._setupList(children, childItem);
			
			returnList.push({"id": currentId, "children": returnChildren});
		}
		
		return returnList;
	}
	
	setup(aData) {
		
		let mainParent = this.item;
		
		if(aData && Array.isArray(aData)) {
			let cleanedList = this._setupList(aData, mainParent);
			console.log("cleanedList", cleanedList);
			//METODO: update storage with cleaned list
		}
	}
	
	_getIdsForItem(aItem, aReturnArray) {
		console.log("_getIdsForItem");
		let childrenLinks = aItem.getLinks("children").items;
		console.log(childrenLinks);
		
		let currentArray = childrenLinks;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			aReturnArray.push(Wprr.objectPath(currentItem, "link.id"));
			
			this._getIdsForItem(currentItem, aReturnArray);
		}
	}
	
	getAllIds() {
		let returnArray = new Array();
		
		this._getIdsForItem(this.item, returnArray);
		
		return returnArray;
	}
	
	addUnorderedItems(aIds) {
		console.log("addUnorderedItems");
		let currentIds = this.getAllIds();
		
		let missingItems = Wprr.utils.array.removeValues(aIds, currentIds);
		
		let childrenLinks = this.item.getLinks("children");
		
		let currentArray = missingItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			this._createHierarchyItem(currentId, childrenLinks);
		}
	}
	
	_getJsonForItem(aItem) {
		let returnObject = new Object();
		
		returnObject["id"] = Wprr.objectPath(aItem, "link.id");
		returnObject["children"] = this._getJsonForItems(Wprr.objectPath(aItem, "children.items"));
		
		return returnObject;
	}
	
	_getJsonForItems(aItems) {
		console.log("_getJsonForItems");
		console.log(aItems);
		
		if(!aItems) {
			return [];
		}
		
		let returnArray = new Array();
		
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			returnArray.push(this._getJsonForItem(currentItem));
		}
		
		return returnArray;
	}
	
	getJsonStructure() {
		let items = this.item.getLinks("children").items;
		
		return this._getJsonForItems(items);
	}
	
	updateStructure() {
		console.log("updateStructure");
		this.structure = this.getJsonStructure();
		console.log(this.structure);
	}
	
	_isInside(aItem, aParentItem) {
		
		let currentItem = aItem;
		
		let debugCounter = 0;
		while(currentItem) {
			if(debugCounter++ > 1000) {
				console.error("While loop ran for too long", this);
				break;
			}
			if(currentItem === aParentItem) {
				return true;
			}
			currentItem = Wprr.objectPath(currentItem, "parent.linkedItem");
		}
		
		return false;
	}
	
	moveToParent(aItem, aParentItem, aPosition) {
		//console.log("moveToParent");
		//console.log(aItem, aParentItem, aPosition);
		
		if(aItem === aParentItem) {
			return;
		}
		else if(this._isInside(aParentItem, aItem)) {
			return;
		}
		
		let currentChildrenList = aItem.getType("parent").linkedItem.getLinks("children");
		
		aItem.getType("parent").setId(aParentItem.id);
		
		currentChildrenList.removeItem(aItem.id);
		aParentItem.getLinks("children").insertItem(aItem.id, aPosition);
		
		this.updateStructure();
	}
}