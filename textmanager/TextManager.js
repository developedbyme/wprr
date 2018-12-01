import objectPath from "object-path";

//import TextManager from "wprr/textmanager/TextManager";
export default class TextManager {
	
	constructor() {
		//console.log("wprr/textmanager/TextManager::constructor");
		
		this._data = null;
		this._translationMap = new Object();
		
		//METODO: only use this in development mode
		this._unmappedTexts = new Object();
		this._untranslatedTexts = new Object();
		//window._debugTextManager = this;
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
			this._untranslatedTexts[textId] = aText;
		}
		
		return aText;
	}
	
	getTranslationId(aText) {
		if(this._translationMap[aText]) {
			return this._translationMap[aText];
		}
		
		console.warn("Translation is not mapped for text " + aText);
		this._unmappedTexts[this._convertToCamelCase(aText)] = aText;
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
		//METODO: move this to utils
		
		//METODO: remove special characters
		
		let specialCharactersRegExp = new RegExp("[^A-Za-z0-9 ]+", "g");
		
		//METODO: better replacement of all special characters
		aText = aText
			.replace(/å/g, "a")
			.replace(/ä/g, "a")
			.replace(/ö/g, "o")
			.replace(/Å/g, "A")
			.replace(/Ä/g, "A")
			.replace(/Ö/g, "O")
			.replace(specialCharactersRegExp, "");
		
		var currentArray = aText.split(" ");
		var currentArrayLength = currentArray.length;
		var returnText = currentArray[0].toLowerCase();
		for(var i = 1; i < currentArrayLength; i++) { //MENOTE: first iteration is done outside of loop
			var currentString = currentArray[i].toLowerCase();
			if(currentString.length > 0) {
				returnText += currentString[0].toUpperCase() + currentString.substring(1, currentString.length);
			}
		}
	
		return returnText;
	};
	
	_debug_getUnmappedObject() {
		console.log(JSON.stringify(this._unmappedTexts, null, "\t"));
		return this._unmappedTexts;
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