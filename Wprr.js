import WprrBaseObject from "wprr/WprrBaseObject";

import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";

//import Wprr from "wprr";
export default class Wprr {
	
	constructor() {
		this._moduleCreators = new Object();
	}
	
	addGlobalReference(aGlobalObject) {
		aGlobalObject["wprr"] = this;
		
		return this;
	}
	
	addPageModule(aName, aModule) {
		this._moduleCreators[aName] = PageModuleCreator.create(aModule);
		
		return this;
	}
	
	insertModule(aName, aHolderElement, aData) {
		let currentModuleCreator = this._moduleCreators[aName];
		if(currentModuleCreator) {
			currentModuleCreator.createModule(aHolderElement, aData);
		}
		else {
			console.error("No module named " + aName, this);
		}
	}
	
	static test() {
		console.log(WprrBaseObject);
	}
}