import Wprr from "wprr/Wprr";

//import CommandGroup from "wprr/commands/CommandGroup";
/**
 * Object that stores commands
 */
export default class CommandGroup {
	
	constructor() {
		this._owner = null;
		this._groups = new Object();
	}
	
	setOwner(aOwner) {
		this._owner = aOwner;
		
		return this;
	}
	
	getGroup(aName) {
		let group = this._groups[aName];
		if(!group) {
			group = new Array();
			this._groups[aName] = group;
		}
		
		return group;
	}
	
	getGroupIfExists(aName) {
		let group = this._groups[aName];
		return group ? group : null;
	}
	
	addCommand(aName, aCommand) {
		let group = this.getGroup(aName);
		
		group.push(aCommand);
		
		return this;
	}
	
	addFunction(aName, aThisObject, aFunction, aArguments = null) {
		this.addCommand(aName, Wprr.commands.callFunction(aThisObject, aFunction, aArguments));
		
		return this;
	}
	
	perform(aName, aData) {
		
		let commands = this.getGroupIfExists(aName);
		if(commands === null) {
			//METODO: check for expected names
			return this;
		}
		
		Wprr.utils.CommandPerformer.perform(commands, aData, this._owner);
		return this;
	}
}
