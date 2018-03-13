import WprrBaseObject from "wprr/WprrBaseObject";

import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
import PageModuleWithRendererCreator from "wprr/modulecreators/PageModuleWithRendererCreator";
import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";
import AppModuleWithRenderCreator from "wprr/modulecreators/AppModuleWithRenderCreator";

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
		let newModuleCreator = PageModuleCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addPageModuleWithRenderer(aName, aModule) {
		let newModuleCreator = PageModuleWithRendererCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addAppModule(aName, aModule) {
		let newModuleCreator = AppModuleCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addAppWithRendererModule(aName, aModule) {
		let newModuleCreator = AppModuleWithRenderCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
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