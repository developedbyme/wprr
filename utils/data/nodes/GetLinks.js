import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import GetLinks from "./GetLinks";
export default class GetLinks extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._currentConnection = null;
		this._itemChangedCommand = Wprr.commands.callFunction(this, this._itemChanged);
		
	}
	
	setup() {
		
		this.item.requireValue("linksName", null);
		this.item.requireSingleLink("fromItem");
		this.item.getType("fromItem").idSource.addChangeCommand(this._itemChangedCommand);
		this.item.getLinks("items");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("getItemsController", this);
		this.setup();
		
		return this;
	}
	
	_itemChanged() {
		//console.log("GetLinks::_itemChanged");
		//console.log(this);
		
		
		if(this._currentConnection) {
			this._currentConnection.removeAllSources();
			this._currentConnection = null;
		}
		
		let item = Wprr.objectPath(this.item, "fromItem.linkedItem");
		
		if(item) {
			let linksName = this.item.getValue("linksName");
			let links = item.getLinks(linksName);
			
			this._currentConnection = links.idsSource.connectSource(this.item.getLinks("items").idsSource);
		}
	}
	
	toJSON() {
		return "[GetLinks id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newGetLinks = new GetLinks();
		newGetLinks.setupForItem(aItem);
		
		return newGetLinks;
	}
}