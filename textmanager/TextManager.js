import objectPath from "object-path";

import ProgrammingLanguageFunctions from "wprr/wp/ProgrammingLanguageFunctions";

//import TextManager from "wprr/textmanager/TextManager";
export default class TextManager {
	
	constructor() {
		//console.log("wprr/textmanager/TextManager::constructor");
		
		this._data = new Object();
		this._translationMap = new Object();
		
		//METODO: only use this in development mode
		this._unmappedTexts = new Object();
		this._untranslatedTexts = new Object();
		window._debugTextManager = this;
		
		//this._debugUseZzLanguage = true;
	}
	
	setData(aDataObject) {
		this._data = aDataObject;
	}
	
	addTexts(aDataObject, aPath) {
		objectPath.set(this._data, aPath, aDataObject);
	}
	
	getText(aPath) {
		//console.log("wprr/textmanager/TextManager::getText");
		
		let returnText = objectPath.get(this._data, aPath);
		
		if(returnText == undefined) {
			console.warn("No text for path " + aPath);
			this.addUntranslatedTextId(aPath);
			return null;
		}
		
		if(this._debugUseZzLanguage) {
			return "ZZZZZ";
		}
		
		return returnText;
	}
	
	getTextOrId(aPath, aId) {
		let returnText = objectPath.get(this._data, aPath);
		if(returnText == undefined) {
			//METODO: should this be added to both
			console.warn("No text for path " + aPath + ". Using id.");
			
			this.addUntranslatedText(aPath, aId);
			
			returnText = aId;
		}
		
		if(this._debugUseZzLanguage) {
			return "ZZZZZ";
		}
		
		return returnText;
	}
	
	translateText(aText) {
		let textId = this.getTranslationId(aText);
		
		if(textId) {
			let translatedText = this.getText(textId);
			if(translatedText) {
				
				if(this._debugUseZzLanguage) {
					return "ZZZZZ";
				}
				
				return translatedText;
			}
			console.warn("Translation doesn't exist for text " + aText);
			this.addUntranslatedText(textId, aText);
		}
		
		if(this._debugUseZzLanguage) {
			return "ZZZZZ";
		}
		
		return aText;
	}
	
	addUntranslatedText(aId, aText) {
		this._untranslatedTexts[aId] = aText;
	}
	
	addUntranslatedTextId(aId) {
		if(!this._untranslatedTexts[aId]) {
			this._untranslatedTexts[aId] = "";
		}
	}
	
	addUnmappedText(aId, aText) {
		this._unmappedTexts[aId] = aText;
	}
	
	getTranslationId(aText) {
		if(this._translationMap[aText]) {
			return this._translationMap[aText];
		}
		
		console.warn("Translation is not mapped for text " + aText);
		this.addUnmappedText(this._convertToCamelCase(aText), aText);
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
	
	_convertToCamelCase(aText) {
		return ProgrammingLanguageFunctions.convertToCamelCase(aText);
	};
	
	_convertToWpSlug(aText) {
		return ProgrammingLanguageFunctions.convertToWpSlug(aText);
	};
	
	_debug_getUnmappedObject() {
		
		let returnObject = new Object();
		
		for(let objectName in this._unmappedTexts) {
			objectPath.set(returnObject, objectName, this._unmappedTexts[objectName]);
		}
		
		console.log(JSON.stringify(returnObject, null, "\t"));
		return returnObject;
	}
	
	_debug_getNewTranslatedObject(aPath = null) {
		
		let newTranslationObject = JSON.parse(JSON.stringify(this._data));
		
		for(let objectName in this._untranslatedTexts) {
			objectPath.set(newTranslationObject, objectName, this._untranslatedTexts[objectName]);
		}
		
		let returnObject = aPath ? objectPath.get(newTranslationObject, aPath) : newTranslationObject;
		
		console.log(JSON.stringify(returnObject, null, "\t"));
		
		return returnObject;
	}
}