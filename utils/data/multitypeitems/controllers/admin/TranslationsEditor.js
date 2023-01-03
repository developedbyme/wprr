import Wprr from "wprr/Wprr";
import React from "react";

import ValueEditor from "./ValueEditor";
import TranslationValueEditor from "./TranslationValueEditor";

export default class TranslationsEditor extends ValueEditor {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		super.setup();
		
		this.item.getNamedLinks("translationEditors");
		
		return this;
	}
	
	setupInitialEditors() {
		let value = this.value;
		if(value) {
			for(let objectName in value) {
				this.getTranslationEditor(objectName);
			}
		}
		
		return this;
	}
	
	get translationsEditor() {
		return this;
	}
	
	getTranslationEditor(aLanguageCode) {
		let group = this.item.getNamedLinks("translationEditors");
		
		if(!group.hasLinkByName(aLanguageCode)) {
			let currentValue = this.value;
			if(currentValue[aLanguageCode] === undefined) {
				currentValue = Wprr.utils.object.copyViaJson(currentValue);
				currentValue[aLanguageCode] = "";
				this.value = currentValue;
			}
			let newEditor = TranslationValueEditor.create(this.item.group.createInternalItem(), currentValue[aLanguageCode]);
			
			let getPropertyNode = Wprr.utils.data.nodes.ObjectProperty.connect(this.item.getValueSource("value"), aLanguageCode, newEditor.item.getValueSource("value"));
			
			group.addItem(aLanguageCode, newEditor.item.id);
		}
		
		return group.getLinkByName(aLanguageCode).getType("valueEditor");
	}
	
	addTranslation(aLanguageCode, aDefaultValue = "") {
		let currentValue = this.value;
		
		if(currentValue[aLanguageCode] === undefined) {
			let newValue = Wprr.utils.object.copyViaJson(currentValue);
			newValue[aLanguageCode] = aDefaultValue;
			this.value = newValue;
		}
		
		return this.getTranslationEditor(aLanguageCode);
	}
	
	toJSON() {
		return "[TranslationsEditor id=" + this._id + "]";
	}
	
	static create(aItem, aValue = null) {
		//console.log("TranslationsEditor::create");
		let newTranslationsEditor = new TranslationsEditor();
		
		newTranslationsEditor.setupForItem(aItem);
		aItem.setValue("value", aValue);
		aItem.setValue("storedValue", aValue);
		newTranslationsEditor.setupInitialEditors();
		
		return newTranslationsEditor;
	}
}