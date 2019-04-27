// import PathGenerator from "wprr/utils/PathGenerator";
/**
 * Genereator for paths
 */
export default class PathGenerator  {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		this._separator = null;
		this._separatorReplacement = null;
		this.setSeparator("/");
		this._parts = new Array();
	};
	
	setSeparator(aSeparator) {
		this._separator = aSeparator;
		this._separatorReplacement = "%" + this._separator.charCodeAt(0).toString(16).toUpperCase();
		
		return this;
	}
	
	resetParts() {
		this._parts = new Array();
		
		return this;
	}
	
	setPath(aPath) {
		this._parts = aPath.split(this._separator);
		
		return this;
	}
	
	add(aName) {
		
		let name = aName.split(this._separator).join(this._separatorReplacement);
		
		this._parts.push(name);
		
		return this;
	}
	
	get() {
		return this._parts.join(this._separator);
	}
	
	addAndGet(aName) {
		return this.add(aName).get();
	}
	
	up(aLength = 1) {
		let length = Math.min(this._parts.length, aLength);
		
		for(let i = 0; i < length; i++) {
			this._parts.pop();
		}
		
		return this;
	}
	
	static create() {
		let newPathGenerator = new PathGenerator();
		
		return newPathGenerator;
	}
}