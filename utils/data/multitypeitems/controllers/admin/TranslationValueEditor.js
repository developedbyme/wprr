import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class TranslationValueEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.addType("valueEditor", this);
		
		this.item.requireValue("value");
		
		this._value = this.item.getType("value");
		this._value.makeStorable();
		
		this.item.addType("storedValue", this._value.sources.get("storedValue"));
		this.item.addType("changed", this._value.sources.get("changed"));
		
		return this;
	}
	
	get value() {
		return this.item.getType("value").value;
	}
	
	set value(aValue) {
		this.item.getType("value").value = aValue;
		
		return this;
	}
	
	get valueSource() {
		return this.item.getType("value");
	}
	
	get changed() {
		return this.item.getType("changed").value;
	}
	
	get changedSource() {
		return this.item.getType("changed");
	}
	
	setupForItem(aItem) {
		
		this.setItemConnection(aItem);
		this.setup();
		
		return this;
	}
	
	save() {
		//METODO
	}
	
	cancelEdit() {
		this.value = this.item.getValue("storedValue");
	}
	
	saved(aSavedValue) {
		//console.log("saved");
		//console.log(aSavedValue);
		
		this.item.getType("storedValue").value = aSavedValue;
	}
	
	toJSON() {
		return "[TranslationValueEditor id=" + this._id + "]";
	}
	
	static create(aItem, aValue = null) {
		//console.log("TranslationValueEditor::create");
		let newTranslationValueEditor = new TranslationValueEditor();
		
		newTranslationValueEditor.setupForItem(aItem);
		aItem.setValue("value", aValue);
		aItem.setValue("storedValue", aValue);
		
		return newTranslationValueEditor;
	}
}