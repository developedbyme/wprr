import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import CopyValue from "./CopyValue";
export default class CopyValue extends BaseObject {
	
	constructor() {
		super();
		
		this._activeUpdatedCommand = Wprr.commands.callFunction(this, this._activeUpdated);
		
		this._connection = new Wprr.utils.SourceConnection();
		
		this.createSource("input", null);
		this.createSource("active", true);
		this.createSource("output", null);
		
		this.sources.get("active").addChangeCommand(this._activeUpdatedCommand);
		this._connection.addValueSource(this.sources.get("input"));
		this._activeUpdated();
	}
	
	_activeUpdated() {
		//console.log("_valueUpdated");
		//console.log(this);
		
		if(this.active) {
			this.output = this.input;
			this._connection.addValueSource(this.sources.get("output"));
		}
		else {
			this._connection.removeValueSource(this.sources.get("output"));
		}
	}
	
	static connect(aInput, aOutput, aActive = true) {
		//console.log("CopyValue::connect");
		
		let newCopyValue = new CopyValue();
		
		aInput.connectSource(newCopyValue.sources.get("input"));
		newCopyValue.sources.get("active").input(aActive);
		newCopyValue.sources.get("output").connectSource(aOutput);
		
		//console.log(newCopyValue);
		
		return newCopyValue;
	}
}