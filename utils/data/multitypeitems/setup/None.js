import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import None from "./None";
export default class None extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("None::prepare");
		
		//MENOTE: do nothing
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("None::setup");
		//console.log(aData);
		
		//MENOTE: do nothing
		
		return this;
	}
}