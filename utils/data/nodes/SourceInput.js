import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SourceInput from "./SourceInput";
export default class SourceInput extends BaseObject {
	
	constructor() {
		super();
		
		this.createSource("value");
		this.valueSource = this.sources.get("value");
		
		this._connection = new Wprr.utils.SourceConnection();
		this._connection.addValueSource(this.valueSource);
		
		this._currentSource = null;
	}
	
	setValue(aValue) {
		
		if(aValue instanceof Wprr.utils.ValueSourceData) {
			if((aValue !== this._currentSource) && (this._currentSource !== null)) {
				this._connection.removeValueSource(this._currentSource);
				this._currentSource = null;
			}
			
			this._currentSource = aValue;
			this._connection.addValueSource(this._currentSource);
			
			this.valueSource.value = this._currentSource.value;
		}
		else {
			if(this._currentSource) {
				this._connection.removeValueSource(this._currentSource);
				this._currentSource = null;
			}
			
			this.valueSource.value = aValue;
		}
		
		return this;
	}
}