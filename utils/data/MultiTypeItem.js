import Wprr from "wprr/Wprr";

import MultiTypeItemLinks from "wprr/utils/data/MultiTypeItemLinks";
import SelectLink from "wprr/utils/data/SelectLink";
import SingleLink from "wprr/utils/data/SingleLink";
import NamedLinks from "wprr/utils/data/NamedLinks";

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
	
	get cache() {
		if(!this.hasType("cache")) {
			this.addType("cache", new Wprr.utils.DataStorage());
		}
		
		return this.getType("cache");
	}
	
	get settings() {
		if(!this.hasType("settings")) {
			this.addType("settings", new Wprr.utils.DataStorage());
		}
		
		return this.getType("settings");
	}
	
	setGroup(aGroup) {
		this._group = aGroup;
		
		return this;
	}
	
	setup(aSetupType, aData) {
		let statusPath = "setup." + aSetupType + ".done";
		let settings = this.settings;
		if(!settings.getValue(statusPath)) {
			
			this.group.setupItem(this, aSetupType, aData);
			
			settings.updateValue(statusPath, true);
		}
		
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
	
	setValue(aType, aData) {
		this.getValueSource(aType).value = aData;
		
		return this;
	}
	
	requireValue(aType, aDefaultData = null) {
		if(!this.hasType(aType)) {
			let theSource = Wprr.sourceValue(aDefaultData);
			this.addType(aType, theSource);
		}
		
		return this;
	}
	
	getValueSource(aType) {
		if(!this.hasType(aType)) {
			let theSource = Wprr.sourceValue(null);
			this.addType(aType, theSource);
		}
		
		return this.getType(aType);
	}
	
	getValue(aType) {
		return this.getValueSource(aType).value;
	}
	
	getLinks(aType) {
		if(!this._types[aType]) {
			let newLinks = new MultiTypeItemLinks();
			this.addType(aType, newLinks);
		}
		
		return this._types[aType];
	}
	
	getNamedLinks(aType) {
		if(!this._types[aType]) {
			let newLinks = new NamedLinks();
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
	
	addSingleLink(aType, aId) {
		let newSingleLink = new SingleLink();
		newSingleLink.setId(aId);
		this.addType(aType, newSingleLink);
		
		return newSingleLink;
	}
	
	connectData(aData) {
		aData.setItemConnection(this);
		
		return this;
	}
	
	hasType(aType) {
		return (this._types[aType] !== undefined);
	}
	
	hasSetting(aName) {
		return Wprr.objectPath(this.settings, aName) !== undefined;
	}
	
	addSetting(aName, aValue) {
		this.settings.updateValue(aName, aValue);
		
		return this;
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
			case "cache":
			case "settings":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getType(firstPart), restParts);
	}
	
	static create(aId) {
		let newMultiTypeItem = new MultiTypeItem();
		newMultiTypeItem.id = aId;
		
		return newMultiTypeItem;
	}
}