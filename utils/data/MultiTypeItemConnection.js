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
}