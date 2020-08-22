import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import SelectLink from "wprr/utils/data/SelectLink";
export default class SelectLink extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._linksName = null;
		this._selectBy = "id";
		this._itemPath = null;
	}
	
	setup(aLinksName, aSelectBy = "id", aItemPath = null) {
		this._linksName = aLinksName;
		this._selectBy = aSelectBy;
		this._itemPath = aItemPath;
		
		return this;
	}
	
	getLink(aName) {
		console.log("getLink");
		console.log(aName);
		
		let links = this.item.getLinks(this._linksName).items;
		console.log(this._linksName, links);
		
		let selectedLink = Wprr.utils.array.getItemBy(this._selectBy, aName, links);
		console.log(selectedLink, this._selectBy, aName);
		
		if(this._itemPath) {
			Wprr.objectPath(selectedLink, this._itemPath);
		}
		
		return selectedLink
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "getLink":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getLink(firstPart), restParts);
	}
}