import Wprr from "wprr/Wprr";

// import MultiTypeItem from "wprr/utils/data/MultiTypeItem";
export default class MultiTypeItem {
	
	constructor() {
		this._id = null;
		this._types = new Object();
	}
	
	get id() {
		return this._id;
	}
	
	set id(aId) {
		this._id = aId;
		
		return this._id;
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