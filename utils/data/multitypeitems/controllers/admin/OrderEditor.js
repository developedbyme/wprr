import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import ValueEditor from "./ValueEditor";

export default class OrderEditor extends ValueEditor {
	
	constructor() {
		//console.log("OrderEditor::constructor");
		
		super();
		
	}
	
	setup() {
		
		super.setup();
		
		this.item.addType("orderEditor", this);
		this.item.requireSingleLink("editedItem");
		this.item.requireValue("forType");
		
		return this;
	}
	
	setupSelection(aItemId, aForType) {
		//console.log("setupSelection");
		let item = this.item.group.getItem(aItemId);
		
		this.item.addSingleLink("editedItem", aItemId);
		this.item.setValue("forType", aForType);
		
		return this;
	}
	
	setupInitialValue(aItem) {
		
		let relations = Wprr.objectPath(aItem, "outgoingRelations.items");
		relations = Wprr.utils.array.getItemsBy("type.id", "dbm_type:object-relation/relation-order-by", relations);
		
		let forType = this.item.getValue("forType");
		relations = Wprr.utils.array.getItemsBy("to.linkedItem.forType.value", forType, relations);
		relations = this._filterActiveRelations(relations);
		
		let hasValue = false;
		
		if(relations.length) {
			let relation = relations[relations.length-1];
			let orderItem = Wprr.objectPath(relation, "to.linkedItem");
			
			if(orderItem) {
				hasValue = true;
				
				let orderValue = orderItem.getValue("order");
				if(!orderValue) {
					orderValue = [];
				}
				this.valueSource.setValue(orderValue);
				
				this.item.getType("storedValue").input(orderItem.getValueSource("order"));
			}
		}
		
		if(!hasValue) {
			this.value = [];
		}
		
		return this;
	}
	
	_filterActiveRelations(aItems) {
		//console.log("_filterActiveRelations");
		
		let currentTime = moment().unix();
		
		let returnArray = new Array();
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let startAt = currentItem.getValue("startAt");
			let endAt = currentItem.getValue("endAt");
			
			if((startAt === -1 || startAt <= currentTime) && (endAt === -1 || endAt > currentTime)) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}
	
	_getIdsFromTree(aItems, aReturnArray) {
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			if(typeof(currentData) === "object" && currentData.id) {
				aReturnArray.push(currentData.id);
				
				if(currentData.children) {
					this._getIdsFromTree(currentData.children, aReturnArray);
				}
				
			}
			else {
				aReturnArray.push(currentData);
			}
		}
	}
	
	updateForActiveRelations(aIds) {
		//console.log("updateForActiveRelations");
		
		let existingIds = [];
		this._getIdsFromTree(this.value, existingIds);
		
		let newValue = Wprr.utils.object.copyViaJson(this.value);
		
		let newItems = Wprr.utils.array.removeValues(aIds, existingIds);
		let removeItems = Wprr.utils.array.removeValues(existingIds, aIds);
		
		{
			let currentArray = newItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				newValue.push(currentArray[i]);
			}
		}
		
		if(removeItems.length) {
			let currentArray = removeItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let index = newValue.indexOf(currentArray[i]);
				if(index >= 0) {
					newValue.splice(index, 1);
				}
			}
			
			//METODO: handle removal in hierarchy
		}
		
		
		this.value = newValue;
		
		return this;
	}
	
	toJSON() {
		return "[OrderEditor id=" + this._id + "]";
	}
	
	static create(aItem) {
		//console.log("OrderEditor::create");
		let newOrderEditor = new OrderEditor();
		
		newOrderEditor.setupForItem(aItem);
		
		return newOrderEditor;
	}
}