import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ArrayChangeCommands from "./ArrayChangeCommands";
export default class ArrayChangeCommands extends BaseObject {
	
	constructor() {
		super();
		
		this._lastUpdate = new Array();
		this.addCommands = new Array();
		this.removeCommands = new Array();
		this.changeCompleteCommands = new Array();
		
		this._arrayUpdatedCommand = Wprr.commands.callFunction(this, this._arrayUpdated);
		
		this.createSource("array", []).addChangeCommand(this._arrayUpdatedCommand);
		
	}
	
	addAddCommand(aCommand) {
		this.addCommands.push(aCommand);
		
		return this;
	}
	
	addRemoveCommand(aCommand) {
		this.removeCommands.push(aCommand);
		
		return this;
	}
	
	_arrayUpdated() {
		//console.log("_arrayUpdated");
		
		let newArray = this.array;
		
		let addedItems;
		let removedItems;
		
		if(this._lastUpdate.length === 0) {
			addedItems = newArray;
			removedItems = [];
		}
		else if(newArray.length === 0) {
			addedItems = [];
			removedItems = this._lastUpdate;
		}
		else {
			let temp = Wprr.utils.array.findMinorDiffs(this._lastUpdate, newArray);
			
			if(temp[0].length === 0) {
				addedItems = temp[1];
				removedItems = [];
			}
			else if(temp[1].length === 0) {
				addedItems = [];
				removedItems = temp[0];
			}
			else {
				addedItems = Wprr.utils.array.getUnselectedItems(temp[0], temp[1]);
				removedItems = Wprr.utils.array.getUnselectedItems(temp[1], temp[0]);
			}
		}
		
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
		
		Wprr.utils.CommandPerformer.perform(this.changeCompleteCommands, null, null);
	}
	
	_itemRemoved(aItem) {
		//console.log("_itemRemoved");
		//console.log(aItem);
		
		Wprr.utils.CommandPerformer.perform(this.removeCommands, aItem, null);
	}
	
	_itemAdded(aItem) {
		//console.log("_itemAdded");
		//console.log(aItem, this.addCommands);
		
		Wprr.utils.CommandPerformer.perform(this.addCommands, aItem, null);
	}
	
	static connect(aArraySource, aAddCommands = null, aRemoveCommands = null, aChangeCompleteCommands) {
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
		if(aChangeCompleteCommands) {
			newArrayChangeCommands.changeCompleteCommands = Wprr.utils.array.singleOrArray(aChangeCompleteCommands);
		}
		
		return newArrayChangeCommands;
	}
}