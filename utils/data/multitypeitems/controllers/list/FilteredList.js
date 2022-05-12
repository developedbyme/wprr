import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";
import FilterPart from "wprr/utils/filter/parts/FilterPart";

export default class FilteredList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateFilterPartsCommand = Wprr.commands.callFunction(this, this._updateFilterParts);
		this._updateFilterCommand = Wprr.commands.callFunction(this, this.updateFilter);
		this._updateListenersCommand = Wprr.commands.callFunction(this, this._updateListeners);
		
		this._filter = Wprr.utils.FilterChain.create();
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.getLinks("all").idsSource.addChangeCommand(this._updateFilterCommand);
		this.item.getLinks("filtered");
		
		this.item.getLinks("filterParts").idsSource.addChangeCommand(this._updateFilterPartsCommand);
		
		//METODO: change properties
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("filteredListController", this);
		this.setup();
		
		return this;
	}
	
	setItems(aItems) {
		this.item.getLinks("all").input(aItems);
		
		return this;
	}
	
	_updateFilterParts() {
		//console.log("_updateFilterParts");
		
		let filterParts = Wprr.objectPath(this.item, "filterParts.items.(every).filterPart");
		this._filter.setParts(filterParts);
		this.updateFilter();
	}
	
	updateFilter() {
		//console.log("updateFilter");
		
		let items = this.item.getLinks("all").items;
		let filteredItems = this._filter.filter(items, null);
		//console.log(items, filteredItems, Wprr.utils.array.mapField(filteredItems, "id"));
		
		this.item.getLinks("filtered").setItems(Wprr.utils.array.mapField(filteredItems, "id"));
	}
	
	addFieldSearch(aFields) {
		//console.log("addFieldSearch");
		//console.log(aFields);
		
		let item = this.item.group.createInternalItem();
		let textSource = item.setValue("searchValue", "").getType("searchValue");
		textSource.addChangeCommand(this._updateFilterCommand);
		let fieldsSource = item.setValue("fields", aFields).getType("fields");
		fieldsSource.addChangeCommand(this._updateFilterCommand);
		
		let filterPart = Wprr.utils.filterPartFunctions.createFieldsSearch(fieldsSource, textSource, textSource);
		item.addType("filterPart", filterPart);
		
		this.item.getLinks("filterParts").addItem(item.id);
		
		return item;
	}
	
	addInArrayMatch(aField, aMatchValues = []) {
		let item = this.item.group.createInternalItem();
		
		let fieldSource = item.setValue("field", aField).getType("field");
		fieldSource.addChangeCommand(this._updateFilterCommand);
		
		let matchValuesSource = item.setValue("matchValues", aMatchValues).getType("matchValues");
		matchValuesSource.addChangeCommand(this._updateFilterCommand);
		
		let compareTypeSource = item.setValue("compareType", "inArray").getType("compareType");
		compareTypeSource.addChangeCommand(this._updateFilterCommand);
		
		let formatTypeSource = item.setValue("formatType", null).getType("formatType");
		formatTypeSource.addChangeCommand(this._updateFilterCommand);
		
		let activeSource = item.setValue("active", aMatchValues.length > 0).getType("active");
		activeSource.addChangeCommand(this._updateFilterCommand);
		
		matchValuesSource.addChangeCommand(Wprr.commands.callFunction(this, function() {activeSource.value = (matchValuesSource.value.length > 0);}));
		
		let filterPart = Wprr.utils.filterPartFunctions.createCompareField(fieldSource, matchValuesSource, compareTypeSource, formatTypeSource, activeSource);
		item.addType("filterPart", filterPart);
		
		this.item.getLinks("filterParts").addItem(item.id);
		
		return item;
	}
	
	addFieldCompare(aField, aCompareValue, aCompareType = "==") {
		let item = this.item.group.createInternalItem();
		
		let fieldSource = item.setValue("field", aField).getType("field");
		fieldSource.addChangeCommand(this._updateFilterCommand);
		
		let compareValueSource = item.setValue("compareValue", aCompareValue).getType("compareValue");
		compareValueSource.addChangeCommand(this._updateFilterCommand);
		
		let compareTypeSource = item.setValue("compareType", aCompareType).getType("compareType");
		compareTypeSource.addChangeCommand(this._updateFilterCommand);
		
		let formatTypeSource = item.setValue("formatType", null).getType("formatType");
		formatTypeSource.addChangeCommand(this._updateFilterCommand);
		
		let activeSource = item.setValue("active", true).getType("active");
		activeSource.addChangeCommand(this._updateFilterCommand);
		
		let filterPart = Wprr.utils.filterPartFunctions.createCompareField(fieldSource, compareValueSource, compareTypeSource, formatTypeSource, activeSource);
		item.addType("filterPart", filterPart);
		
		this.item.getLinks("filterParts").addItem(item.id);
		
		return item;
	}
	
	addInDateRange(aField, aStartDate, aEndDate) {
		let item = this.item.group.createInternalItem();
		
		let fieldSource = item.setValue("field", aField).getType("field");
		fieldSource.addChangeCommand(this._updateFilterCommand);
		
		let startDateSource = item.setValue("startDate", aStartDate).getType("startDate");
		startDateSource.addChangeCommand(this._updateFilterCommand);
		
		let endDateSource = item.setValue("endDate", aEndDate).getType("endDate");
		endDateSource.addChangeCommand(this._updateFilterCommand);
		
		let activeSource = item.setValue("active", true).getType("active");
		activeSource.addChangeCommand(this._updateFilterCommand);
		
		let filterPart = Wprr.utils.filterPartFunctions.createInDateRange(startDateSource, endDateSource, fieldSource, activeSource);
		item.addType("filterPart", filterPart);
		
		this.item.getLinks("filterParts").addItem(item.id);
		
		return item;
	}
	
	addFilterFunction(aFunction) {
		let item = this.item.group.createInternalItem();
		
		let filterPart = new FilterPart();
		
		filterPart.setInput("filterFunction", aFunction);
		
		item.addType("filterPart", filterPart);
		
		this.item.getLinks("filterParts").addItem(item.id);
		
		return item;
	}
	
	_updateListeners() {
		console.log("_updateListeners");
		
		//METODO:
	}
	
	toJSON() {
		return "[FilteredList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newFilteredList = new FilteredList();
		newFilteredList.setupForItem(aItem);
		
		return newFilteredList;
	}
}