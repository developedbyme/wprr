import objectPath from "object-path";

//import TextManager from "wprr/textmanager/TextManager";
export default class TextManager {
	
	constructor() {
		//console.log("wprr/textmanager/TextManager::constructor");
		
		this._data = null;
	}
	
	setData(aDataObject) {
		this._data = aDataObject;
	}
	
	addTexts(aDataObject, aPath) {
		objectPath.set(this._data, aPath, aDataObject);
	}
	
	getText(aPath) {
		//console.log("wprr/textmanager/TextManager::getText");
		
		var returnText = objectPath.get(this._data, aPath);
		
		if(returnText == undefined) {
			console.warn("No text for path " + aPath);
			return null;
		}
		
		return returnText;
	}
}