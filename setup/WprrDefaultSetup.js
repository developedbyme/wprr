import Wprr from "wprr";

import ImageLoaderManager from "wprr/imageloader/ImageLoaderManager";

//import DefaultSetup from "wprr/setup/WprrDefaultSetup";
export default class WprrDefaultSetup {
	
	static setup(aGlobalObject) {
		if(!aGlobalObject.wprr) {
			let wprr = new Wprr();
			wprr.addGlobalReference(aGlobalObject);
			if(!wprr.imageLoaderManager) {
				wprr.imageLoaderManager = new ImageLoaderManager();
				wprr.imageLoaderManager.start();
			}
		}
		else {
			console.warn("Wprr already exist.", this);
		}
		
		return aGlobalObject.wprr;
	}
}