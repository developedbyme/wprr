import Wprr from "wprr/Wprr";

import MultiTypeItemLinks from "wprr/utils/data/MultiTypeItemLinks";
import SelectLink from "wprr/utils/data/SelectLink";

// import MultiTypeItem from "wprr/utils/data/MultiTypeItem";
export default class MultiTypeItem {
	
	constructor() {
		this._id = null;
		this._types = new Object();
		
		this._group = null;
	}
	
	get id() {
		return this._id;
	}
	
	set id(aId) {
		this._id = aId;
		
		return this._id;
	}
	
	get group() {
		return this._group;
	}
	
	setGroup(aGroup) {
		this._group = aGroup;
		
		return this;
	}
	
	getType(aType) {
		//console.log("getType");
		//console.log(aType);
		
		if(!this._types[aType]) {
			//METODO: should we have creation
		}
		
		return this._types[aType];
	}
	
	addType(aType, aData) {
		this._types[aType] = aData;
		
		if(aData && aData.setItemConnection) {
			this.connectData(aData);
		}
		
		return this;
	}
	
	getLinks(aType) {
		if(!this._types[aType]) {
			let newLinks = new MultiTypeItemLinks();
			this.addType(aType, newLinks);
		}
		
		return this._types[aType];
	}
	
	addLinkedData(aType, aData) {
		this._types[aType] = aData;
		
		return this;
	}
	
	addSelectLink(aType, aLinksType, aSelectBy = "id", aItemPath = null) {
		let newSelectLink = new SelectLink();
		newSelectLink.setup(aLinksType, aSelectBy, aItemPath);
		this.addType(aType, newSelectLink);
		
		return this;
	}
	
	connectData(aData) {
		aData.setItemConnection(this);
		
		return this;
	}
	
	hasType(aType) {
		return (this._types[aType] !== undefined);
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "id":
			case "group":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		console.log("<>>>>>>>", this.getType(firstPart), restParts);
		return Wprr.objectPath(this.getType(firstPart), restParts);
	}
	
	static create(aId) {
		let newMultiTypeItem = new MultiTypeItem();
		newMultiTypeItem.id = aId;
		
		return newMultiTypeItem;
	}
}