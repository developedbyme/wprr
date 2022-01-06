import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PartOfArray from "./PartOfArray";
export default class PartOfArray extends BaseObject {
	
	constructor() {
		super();
		
		this._arrayUpdatedCommand = Wprr.commands.callFunction(this, this._arrayUpdated);
		
		this.createSource("array", []).addChangeCommand(this._arrayUpdatedCommand);
		this.createSource("startAt", 0).addChangeCommand(this._arrayUpdatedCommand);
		this.createSource("numberOfItems", 10).addChangeCommand(this._arrayUpdatedCommand);
		
		this.createSource("showsAll", false);
		this.createSource("partOfArray", []);
	}
	
	_arrayUpdated() {
		//console.log("_arrayUpdated");
		
		let currentArray = this.array;
		let currentArrayLength = currentArray.length;
		
		let startAt = Math.max(0, this.startAt);
		let endAt = Math.min(currentArrayLength, startAt+this.numberOfItems);
		
		let returnArray = new Array();
		for(let i = startAt; i < endAt; i++) {
			returnArray.push(currentArray[i]);
		}
		
		this.partOfArray = returnArray;
		this.showsAll = (endAt >= currentArrayLength);
	}
	
	selectAll() {
		let currentArray = this.array;
		let currentArrayLength = currentArray.length;
		
		this.startAt = 0;
		this.numberOfItems = currentArrayLength;
		
		return this;
	}
	
	showMoreItems(aNumberOfItems) {
		let currentArray = this.array;
		let currentArrayLength = currentArray.length;
		
		this.numberOfItems = Math.min(this.numberOfItems+aNumberOfItems, currentArrayLength);
		
		return this;
	}
	
	doubleNumberOfItems() {
		this.showMoreItems(this.numberOfItems);
		
		return this;
	}
	
	static connect(aArraySource) {
		//console.log("PartOfArray::connect");
		
		let newPartOfArray = new PartOfArray();
		
		aArraySource.connectSource(newPartOfArray.sources.get("array"));
		
		return newPartOfArray;
	}
}