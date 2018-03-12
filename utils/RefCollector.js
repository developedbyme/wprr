// import RefCollector from "wprr/utils/RefCollector";
/**
 * Collets reacts refs
 */
export default class RefCollector {
	
	/**
	 * Contructor
	 */
	constructor() {
		this._refs = new Object();
		this._boundFunctions = new Object();
	}
	
	getRef(aName) {
		if(this._refs[aName]) {
			return this._refs[aName];
		}
		
		console.warn("Ref with name " + aName + " doesn't exist.", this);
		return null;
	}
	
	addRef(aName, aObject) {
		//console.log("wprr/utils/RefCollector::addRef");
		
		this._refs[aName] = aObject;
	}
	
	_getBoundCallbackFunction(aName) {
		if(!this._boundFunctions[aName]) {
			this._boundFunctions[aName] = this.addRef.bind(this, aName);
		}
		
		return this._boundFunctions[aName];
	}
	
	getCallbackFunction(aName) {
		return this._getBoundCallbackFunction(aName);
	}
}