import Wprr from "wprr/Wprr";

// import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";
export default class MultiTypeItemConnection {
	
	constructor() {
		this._item = null;
	}
	
	get item() {
		return this._item;
	}
	
	setItemConnection(aItem) {
		this._item = aItem;
		
		return this;
	}
	
	createItemGroup(aTypeName = "main", aItemName = "mainItem") {
		if(this._item) {
			console.warn("Item is already set for " + this + ". Overwriting.", this);
		}
		
		let newGroup = new Wprr.utils.data.MultiTypeItemsGroup();
		newGroup.getItem(aItemName).addType(aTypeName, this);
		
		return this;
	}
}