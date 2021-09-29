import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import LoadRange from "./LoadRange";
export default class LoadRange extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._loadRangeCommand = Wprr.commands.callFunction(this, this._loadRange);
		
	}
	
	setup() {
		
		this.item.getValueSource("url").addChangeCommand(this._loadRangeCommand);
		this.item.getLinks("loadedItems");
		
		this.item.requireValue("loaded", false);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("loadRangeController", this);
		this.setup();
		
		return this;
	}
	
	_loadRange() {
		//console.log("_loadRange");
		
		let url = this.item.getValue("url")
		
		if(url) {
			let loader = this.item.group.project.getSharedLoader(url);
		
			if(loader.getStatus() === 1) {
				this._rangeLoaded(url, loader.getData()["data"]);
			}
			else {
				this.item.setValue("loaded", false);
				loader.addSuccessCommand(Wprr.commands.callFunction(this, this._rangeLoaded, [url, Wprr.sourceEvent("data")]));
				loader.load();
			}
		}
	}
	
	_rangeLoaded(aUrl, aRange) {
		//console.log("_rangeLoaded");
		//console.log(aUrl, aRange);
		
		let url = this.item.getValue("url")
		if(aUrl === url) {
			let ids = Wprr.utils.array.mapField(aRange, "id");
			this.item.getLinks("loadedItems").setItems(ids);
		
			this.item.setValue("loaded", true);
		}
		
	}
	
	toJSON() {
		return "[LoadRange id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newLoadRange = new LoadRange();
		newLoadRange.setupForItem(aItem);
		
		return newLoadRange;
	}
}