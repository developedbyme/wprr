import React from 'react';
import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";

//import ItemsEditor from "wprr/wp/admin/ItemsEditor";
export default class ItemsEditor extends ProjectRelatedItem {

	constructor() {
		
		super();
		
		this._editStorage = new Wprr.utils.DataStorage();
		this._items = new Wprr.utils.data.MultiTypeItemsGroup();
		
		this._editStorage.updateValue("allIds", []);
		this._editStorage.updateValue("filteredIds", []);
		this._editStorage.updateValue("operation", "none");
		this._editStorage.updateValue("searchText", "");
		this._editStorage.updateValue("saveAll.hasChanges", false);
		this._editStorage.updateValue("saveAll.status", "normal");
		this._editStorage.updateValue("creatingStatus", "none");
		this._editStorage.updateValue("searchFields", []);
		
		this._dataType = "dbm_data";
		this._encoders = "privateTitle,status,fields";
		
		this._addChangeData = null;
		
		this._editStorage.createChangeCommands("allIds,searchText,filters,searchFields", this, Wprr.commands.callFunction(this, this._filterItems, []));
		
		this._filterChain =  Wprr.utils.FilterChain.create();
		
		this._dynamicFilterChain =  Wprr.utils.FilterChain.create();
		this._filterChain.addPart(this._dynamicFilterChain);
		this._dynamicFiltersList = new Wprr.utils.DataStorageListConnection().setDataStorage(this._editStorage).setup("filters", "filter");
		
		this._searchFilterParts = this._filterChain.addFieldsSearch(
			Wprr.sourceStatic(this._editStorage, "searchFields"),
			Wprr.sourceStatic(this._editStorage, "searchText"),
			Wprr.sourceStatic(this._editStorage, "searchText")
		);
		
		this._updateSaveAllStatusCommand = Wprr.commands.callFunction(this, this._updateSaveAllStatus);
	}
	
	setSearchFields(aFields) {
		this._editStorage.updateValue("searchFields", aFields);
		
		return this;
	}
	
	_filterItems() {
		let ids = this._editStorage.getValue("allIds");
		let items = this._items.getItems(ids);
		console.log(items, this._editStorage.getValue("searchText"));
		
		items = this._filterChain.filter(items, null);
		
		let filteredIds = Wprr.utils.array.mapField(items, "id");
		
		console.log(items, filteredIds, this._filterChain);
		
		this._editStorage.updateValue("filteredIds", filteredIds);
	}
	
	setupFromData(aData) {
		let currentArray = aData;
		let currentArrayLength = currentArray.length;
		
		//this._editStorage.disableUpdates();
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			this.addItemData(currentData);
		}
		//this._editStorage.enableUpdates();
		
		return this;
	}
	
	addItemData(aData) {
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		
		let internalMessageGroup = new Wprr.utils.wp.dbmcontent.im.InternalMessageGroup();
		item.addType("messageGroup", internalMessageGroup);
		
		internalMessageGroup.setup(aData);
		internalMessageGroup.addCommand("fieldChange", this._updateSaveAllStatusCommand);
		
		item.addType("editStorage", new Wprr.utils.DataStorage());
		item.addType("data", aData);
		
		let allIds = [].concat(this._editStorage.getValue("allIds"));
		allIds.push(currentId);
		this._editStorage.updateValue("allIds", allIds);
		
		//METODO: setup object relation and status editor
		
		return item;
	}
	
	setupCreation(aType, aInGroup = null) {
		this._addChangeData = new Wprr.utils.ChangeData();
		this._addChangeData.setTitle("New " + aType);
		this._addChangeData.setTerm(aType, "dbm_type", "slugPath");
		
		if(aInGroup) {
			this._addChangeData.setField("dbm/inAdminGrouping", aInGroup);
		}
		
		return this;
	}
	
	start() {
		//METODO: add listener for navigation
	}
	
	get editStorage() {
		return this._editStorage;
	}
	
	get items() {
		return this._items;
	}
	
	_getLoader() {
		let loader = this.project.getLoader();
		
		return loader;
	}
	
	createItem() {
		console.log("createItem");
		
		this._editStorage.updateValue("creatingStatus", "creating");
		
		let loader = this._getLoader();
		
		let url = Wprr.utils.wprrUrl.getCreateUrl(this._dataType);
		url = this.project.getWprrUrl(url);
		
		loader.setupJsonPost(url, this._addChangeData.getCreateData());
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.source("event", "raw", "data.id")]));
		loader.load();
	}
	
	_itemCreated(aId) {
		console.log("_itemCreated");
		
		let language = this.project.getCurrentLanguage();
		
		let url = "wprr/v1/range-item/" + this._dataType + "/drafts,idSelection/" + this._encoders + "?ids=" + aId + "&language=" + language;
		
		let loader = this.project.getSharedLoader(url);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._addCreatedRow, [Wprr.source("event", "raw", "data")]));
		
		loader.load();
	}
	
	_addCreatedRow(aData) {
		console.log("_addCreatedRow");
		console.log(aData);
		
		this.addItemData(aData);
		
		this._editStorage.updateValue("creatingStatus", "none");
		console.log(this);
	}
	
	_updateSaveAllStatus() {
		console.log("_updateSaveAllStatus");
	
		let hasChanges = false;
		let currentArray = this._editStorage.getValue("allIds");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentGroup = this._items.getItem(currentArray[i]).getType("messageGroup");
			if(currentGroup.hasUnsavedChanges()) {
				hasChanges = true;
				break;
			}
		}
	
		console.log("hasChanges", hasChanges);
		this._editStorage.updateValue("saveAll.hasChanges", hasChanges);
	}
	
	getSaveLoaders() {
		//METODO
	}
	
	saveAll() {
		console.log("saveAll");
		
		//METODO:
	}
}
