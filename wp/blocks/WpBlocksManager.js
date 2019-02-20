import objectPath from "object-path";

// import WpBlocksManager from "wprr/wp/blocks/WpBlocksManager";
export default class WpBlocksManager {
	
	constructor() {
		//console.log("wprr/wp/blocks/WpBlocksManager::constructor");
		
		this._blockRegistrations = new Object();
	}
	
	addBlockRegistration(aName, aRegistrationObject) {
		this._blockRegistrations[aName] = aRegistrationObject;
		
		return this;
	}
	
	registerBlocks() {
		if(wp && wp.blocks) {
			for(let objectName in this._blockRegistrations) {
				wp.blocks.registerBlockType(objectName, this._blockRegistrations[objectName].getRegistrationData());
			}
		}
		else {
			console.error("No wp.blocks. Can't register blocks");
		}
	}
}