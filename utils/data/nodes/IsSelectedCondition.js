import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import IsSelectedCondition from "./IsSelectedCondition";
export default class IsSelectedCondition extends BaseObject {
	
	constructor() {
		super();
		
		this._valueUpdatedCommand = Wprr.commands.callFunction(this, this._valueUpdated);
		this._isSelectedChangedCommand = Wprr.commands.callFunction(this, this._isSelectedChanged);
		
		this.createSource("selectedValue", null).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("value", null).addChangeCommand(this._valueUpdatedCommand);
		
		this.createSource("isSelected", false).addChangeCommand(this._isSelectedChangedCommand);
	}
	
	_valueUpdated() {
		//console.log("_valueUpdated");
		
		this.isSelected = this.selectedValue == this.value;
	}
	
	_isSelectedChanged() {
		//console.log("_isSelectedChanged");
		
		if(this.isSelected) {
			this.selectedValue = this.value;
		}
		else {
			this.selectedValue = null;
		}
	}
}