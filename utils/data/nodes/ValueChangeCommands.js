import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ValueChangeCommands from "./ValueChangeCommands";
export default class ValueChangeCommands extends BaseObject {
	
	constructor() {
		super();
		
		this._lastUpdate = null;
		this.addCommands = new Array();
		this.removeCommands = new Array();
		
		this._valueUpdatedCommand = Wprr.commands.callFunction(this, this._valueUpdated);
		
		this.createSource("value", null).addChangeCommand(this._valueUpdatedCommand);
		
	}
	
	_valueUpdated() {
		//console.log("_valueUpdated");
		
		let newValue = this.value;
		let lastValue = this._lastUpdate;
		
		this._lastUpdate = newValue;
		
		this._itemRemoved(lastValue);
		this._itemAdded(newValue);
	}
	
	_itemRemoved(aItem) {
		//console.log("ValueChangeCommands::_itemRemoved");
		//console.log(aItem);
		
		Wprr.utils.CommandPerformer.perform(this.removeCommands, aItem, null);
	}
	
	_itemAdded(aItem) {
		//console.log("ValueChangeCommands::_itemAdded");
		//console.log(aItem);
		
		Wprr.utils.CommandPerformer.perform(this.addCommands, aItem, null);
	}
	
	static connect(aValueSource, aAddCommands = null, aRemoveCommands = null) {
		//console.log("ValueChangeCommands::connect");
		
		let newValueChangeCommands = new ValueChangeCommands();
		
		aValueSource.connectSource(newValueChangeCommands.sources.get("value"));
		
		//METODO: set commands
		if(aAddCommands) {
			newValueChangeCommands.addCommands = Wprr.utils.array.singleOrArray(aAddCommands);
		}
		if(aRemoveCommands) {
			newValueChangeCommands.removeCommands = Wprr.utils.array.singleOrArray(aRemoveCommands);
		}
		
		return newValueChangeCommands;
	}
}