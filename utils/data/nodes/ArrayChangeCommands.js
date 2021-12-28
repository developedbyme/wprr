import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ArrayChangeCommands from "./ArrayChangeCommands";
export default class ArrayChangeCommands extends BaseObject {
	
	constructor() {
		super();
		
		this._lastUpdate = new Array();
		this.addCommands = new Array();
		this.removeCommands = new Array();
		
		this._arrayUpdatedCommand = Wprr.commands.callFunction(this, this._arrayUpdated);
		
		this.createSource("array", []).addChangeCommand(this._arrayUpdatedCommand);
		
	}
	
	_arrayUpdated() {
		//console.log("_arrayUpdated");
		
		let newArray = this.array;
		
		let addedItems = Wprr.utils.array.getUnselectedItems(this._lastUpdate, newArray);
		let removedItems = Wprr.utils.array.getUnselectedItems(newArray, this._lastUpdate);
		
		this._lastUpdate = Wprr.utils.array.copy(newArray);
		
		if(removedItems.length > 0) {
			let currentArray = removedItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				this._itemRemoved(currentItem);
			}
		}
		if(addedItems.length > 0) {
			let currentArray = addedItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				this._itemAdded(currentItem);
			}
		}
	}
	
	_itemRemoved(aItem) {
		//console.log("_itemRemoved");
		//console.log(aItem);
		
		Wprr.utils.CommandPerformer.perform(this.removeCommands, aItem, null);
	}
	
	_itemAdded(aItem) {
		//console.log("_itemAdded");
		//console.log(aItem);
		
		Wprr.utils.CommandPerformer.perform(this.addCommands, aItem, null);
	}
	
	static connect(aArraySource, aAddCommands = null, aRemoveCommands = null) {
		//console.log("ArrayChangeCommands::connect");
		
		let newArrayChangeCommands = new ArrayChangeCommands();
		
		aArraySource.connectSource(newArrayChangeCommands.sources.get("array"));
		
		//METODO: set commands
		if(aAddCommands) {
			newArrayChangeCommands.addCommands = Wprr.utils.array.singleOrArray(aAddCommands);
		}
		if(aRemoveCommands) {
			newArrayChangeCommands.removeCommands = Wprr.utils.array.singleOrArray(aRemoveCommands);
		}
		
		return newArrayChangeCommands;
	}
}