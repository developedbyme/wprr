import objectPath from "object-path";

//import TextManager from "wprr/textmanager/TextManager";
export default class TextManager {
	
	constructor() {
		//console.log("wprr/textmanager/TextManager::constructor");
		
		this._data = null;
		this._translationMap = new Object();
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
	
	translateText(aText) {
		let textId = this.getTranslationId(aText);
		
		if(textId) {
			let translatedText = this.getText(textId);
			if(translatedText) {
				return translatedText;
			}
			console.warn("Translation doesn't exist for text " + aText);
		}
		
		return aText;
	}
	
	getTranslationId(aText) {
		if(this._translationMap[aText]) {
			return this._translationMap[aText];
		}
		
		console.warn("Translation is not mapped for text " + aText);
		return null;
	}
	
	addTranslationsToMap(aDataObject, aPath = null) {
		for(let objectName in aDataObject) {
			let currentData = aDataObject[objectName];
			this.addTranslationToMap(currentData, objectName, aPath);
		}
	}
	
	addTranslationToMap(aData, aName, aPath = null) {
		
		let prefix = aPath ? aPath + "." : "";
		
		if(Array.isArray(aData)) {
			let currentArray = aData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				this.addTranslationToMap(currentData, i+"", aPath);
			}
		}
		else if(typeof(aData) === "object") {
			this.addTranslationsToMap(aData, prefix + aName);
		}
		else {
			let stringVersion = aData+"";
			this._translationMap[stringVersion] = prefix + aName;
		}
	}
}