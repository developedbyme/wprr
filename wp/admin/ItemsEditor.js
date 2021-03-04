import React from 'react';
import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import PostEditor from "wprr/wp/admin/PostEditor";
import OrderEditor from "wprr/wp/admin/OrderEditor";

//import ItemsEditor from "wprr/wp/admin/ItemsEditor";
export default class ItemsEditor extends ProjectRelatedItem {

	constructor() {
		
		super();
		
		this._settings = {
			"postFields": []
		}
		
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
		this._editStorage.updateValue("selection", []);
		this._editStorage.updateValue("filters", new Array());
		this._editStorage.updateValue("sortOrder", new Array());
		
		this._dataType = "dbm_data";
		this._objectType = null;
		this._encoders = "privateTitle,status,fields,editObjectRelations";
		
		this._addChangeData = null;
		
		this._editStorage.createChangeCommands("allIds,searchText,filters,filter,sortOrder,sort,searchFields", this, Wprr.commands.callFunction(this, this._filterItems, []));
		
		this._filterChain =  Wprr.utils.FilterChain.create();
		
		this._dynamicFilterChain =  Wprr.utils.FilterChain.create(Wprr.sourceFunction(this, this._getFilterParts));
		this._filterChain.addPart(this._dynamicFilterChain);
		this._dynamicFiltersList = new Wprr.utils.DataStorageListConnection().setDataStorage(this._editStorage).setup("filters", "filter");
		
		this._sortChain = Wprr.utils.SortChain.create(Wprr.sourceFunction(this, this._getSortParts));
		this._sortList = new Wprr.utils.DataStorageListConnection().setDataStorage(this._editStorage).setup("sortOrder", "sort");
		
		this._searchFilterParts = this._filterChain.addFieldsSearch(
			Wprr.sourceStatic(this._editStorage, "searchFields"),
			Wprr.sourceStatic(this._editStorage, "searchText"),
			Wprr.sourceStatic(this._editStorage, "searchText")
		);
		
		this._updateSaveAllStatusCommand = Wprr.commands.callFunction(this, this._updateSaveAllStatus);
		
		this.addPostField("status", "status");
		
		this._commands = Wprr.utils.InputDataHolder.create();
		
		this._items.additionalLoader._fieldToCheckFor = "isLoadedForEdit";
		this._items.additionalLoader.addCommand(Wprr.commands.callFunction(this, this._setupItem, [Wprr.sourceEvent("item"), Wprr.sourceEvent("data")]), "setup");
	}
	
	get editStorage() {
		return this._editStorage;
	}
	
	get items() {
		return this._items;
	}
	
	get dynamicFiltersList() {
		return this._dynamicFiltersList;
	}
	
	get sortList() {
		return this._sortList;
	}
	
	get addChangeData() {
		return this._addChangeData;
	}
	
	get commands() {
		return this._commands;
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
		return this;
	}
	
	addCommands(aName, aCommands) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		let commands = this._commands.getRawInput(aName);
		//METODO: we just assumes that it is an array
		commands = commands.concat(aCommands);
		this._commands.setInput(aName, commands);
		
		return this;
	}
	
	setProject(aProject) {
		super.setProject(aProject);
		
		this._items.setProject(aProject);
		
		return this;
	}
	
	setItemsGroup(aItemsGroup) {
		this._items = aItemsGroup;
		
		return this;
	}
	
	addPostField(aName, aSaveType = "meta", aChangeGenerator = null) {
		this._settings["postFields"].push({"field": aName, "saveType": aSaveType, "changeGenerator": aChangeGenerator});
		
		return this;
	}
	
	setSearchFields(aFields) {
		this._editStorage.updateValue("searchFields", aFields);
		
		return this;
	}
	
	addFilter(aFilterPart, aData = null) {
		let newId = this._dynamicFiltersList.createConnection();
		let connection = this._dynamicFiltersList.getConnection(newId);
		
		if(aData) {
			for(let objectName in aData) {
				connection.updateValue(objectName, Wprr.utils.object.copyViaJson(aData[objectName]));
			}
		}
		
		aFilterPart.setInput("connection", connection);
		
		this._dynamicFiltersList.addItemWithId(aFilterPart, newId);
		
		return newId;
	}
	
	removeFilter(aId) {
		//console.log("removeFilter");
		//console.log(aId);
		
		this._dynamicFiltersList.removeItemById(aId);
		
		return this;
	}
	
	_getFilterParts() {
		
		let list = this._dynamicFiltersList.collectList();
		let parts = Wprr.utils.array.mapField(list, "item");
		
		return parts;
	}
	
	addSorting(aSortPart, aData = null) {
		let newId = this._sortList.createConnection();
		let connection = this._sortList.getConnection(newId);
		
		if(aData) {
			for(let objectName in aData) {
				//MEDEBUG: need to move format functions to a central identifier so we don't need them in the storage
				connection.updateValue(objectName, aData[objectName]);
				//connection.updateValue(objectName, Wprr.utils.object.copyViaJson(aData[objectName]));
			}
		}
		
		aSortPart.setInput("connection", connection);
		
		this._sortList.addItemWithId(aSortPart, newId);
		
		return newId;
	}
	
	removeSorting(aId) {
		this._sortList.removeItemById(aId);
		
		return this;
	}
	
	_getSortParts() {
		
		let list = this._sortList.collectList();
		let parts = Wprr.utils.array.mapField(list, "item");
		
		return parts;
	}
	
	_filterItems() {
		//console.log("ItemsEditor::_filterItems");
		
		let ids = this._editStorage.getValue("allIds");
		let items = this._items.getItems(ids);
		
		items = this._filterChain.filter(items, null);
		this._sortChain.sort(items, null);
		
		let filteredIds = Wprr.utils.array.mapField(items, "id");
		
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
	
	addNames(aItems, aRangeName = null) {
		//console.log("addNames");
		//console.log(aItems);
		
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			let currentId = currentData["id"];
			let item = this._items.getItem(currentId);
			if(!item.hasType("data")) {
				item.addType("data", currentData);
			}
		}
		
		if(aRangeName) {
			this._items.addRange(aRangeName, aItems);
		}
	}
	
	ensureRelationExists(aData) {
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		if(!item.hasType("relation")) {
			let newRelation = new Wprr.utils.wp.dbmcontent.relation.Relation();
			newRelation.setup(aData);
			item.addType("relation", newRelation);
			let editStorage = new Wprr.utils.DataStorage();
			item.addType("editStorage", editStorage);
			newRelation.connectToEditStorage(editStorage);
			item.addType("data", aData);
			item.addSingleLink("from", aData["fromId"]);
			item.addSingleLink("to", aData["toId"]);
		}
		
		return item;
	}
	
	ensureUserRelationExists(aData) {
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		if(!item.hasType("relation")) {
			let newRelation = new Wprr.utils.wp.dbmcontent.relation.Relation();
			newRelation.setup(aData);
			item.addType("relation", newRelation);
			let editStorage = new Wprr.utils.DataStorage();
			item.addType("editStorage", editStorage);
			newRelation.connectToEditStorage(editStorage);
			item.addType("data", aData);
			item.addSingleLink("from", aData["fromId"]);
			item.addSingleLink("to", "user" + aData["toId"]);
			item.addType("userId", aData["toId"]);
		}
		
		return item;
	}
	
	addItems(aDatas) {
		
		let returnArray = new Array();
		
		let currentArray = aDatas;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(this.addItemData(currentArray[i]));
		}
		
		return returnArray;
	}
	
	_setupItem(aItem, aData) {
		
		let item = aItem;
		
		let saveItems = new Array();
		
		let internalMessageGroup = new Wprr.utils.wp.dbmcontent.im.InternalMessageGroup();
		item.addType("messageGroup", internalMessageGroup);
		saveItems.push(internalMessageGroup);
		
		item.addType("dataChangeCommands", this._updateSaveAllStatusCommand);
		
		internalMessageGroup.setup(aData);
		internalMessageGroup.addCommand("fieldChange", this._updateSaveAllStatusCommand);
		
		let editStorage = new Wprr.utils.DataStorage();
		
		item.addType("editStorage", editStorage);
		item.addType("data", aData);
		
		internalMessageGroup.setupFieldEditStorages();
		
		if(aData["relations"]) {
			let relationsStorage = new Wprr.utils.DataStorage();
			item.addType("relations", relationsStorage);
			
			item.addType("singleRelation", new Wprr.utils.wp.dbmcontent.relation.SingleRelation());
			item.addType("multipleRelations", new Wprr.utils.wp.dbmcontent.relation.MultipleRelations());
			
			let relationEditors = new Wprr.utils.wp.dbmcontent.relation.RelationEditors();
			item.addType("relationEditors", relationEditors);
			saveItems.push(relationEditors);
			relationEditors.addCommand("changed", this._updateSaveAllStatusCommand);
			
			let outgoing = new Object();
			{
				let addToObject = outgoing;
				let directionType = "toTypes";
				let currentArray = aData["relations"]["outgoing"];
				
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentRelationData = currentArray[i];
					let currentRelationId = currentRelationData["id"];
					let item = this.ensureRelationExists(currentRelationData);
					
					let connectionType = currentRelationData["connectionType"];
					if(!addToObject[connectionType]) {
						addToObject[connectionType] = new Object();
					}
					
					let currentConnectionObject = addToObject[connectionType];
					
					if(!currentConnectionObject["any"]) {
						currentConnectionObject["any"] = new Array();
					}
					currentConnectionObject["any"].push(currentRelationId);
					
					let currentArray2 = currentRelationData[directionType];
					let currentArray2Length = currentArray2.length;
					for(let j = 0; j < currentArray2Length; j++) {
						let currentType = currentArray2[j];
						if(!currentConnectionObject[currentType]) {
							currentConnectionObject[currentType] = new Array();
						}
						currentConnectionObject[currentType].push(currentRelationId);
					}
				}
			}
			
			relationsStorage.updateValue("outgoing", outgoing);
			
			let incoming = new Object();
			{
				let addToObject = incoming;
				let directionType = "fromTypes";
				let currentArray = aData["relations"]["incoming"];
				
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentRelationData = currentArray[i];
					let currentRelationId = currentRelationData["id"];
					let item = this.ensureRelationExists(currentRelationData);
					
					let connectionType = currentRelationData["connectionType"];
					if(!addToObject[connectionType]) {
						addToObject[connectionType] = new Object();
					}
					
					let currentConnectionObject = addToObject[connectionType];
					
					if(!currentConnectionObject["any"]) {
						currentConnectionObject["any"] = new Array();
					}
					currentConnectionObject["any"].push(currentRelationId);
					
					let currentArray2 = currentRelationData[directionType];
					let currentArray2Length = currentArray2.length;
					for(let j = 0; j < currentArray2Length; j++) {
						let currentType = currentArray2[j];
						if(!currentConnectionObject[currentType]) {
							currentConnectionObject[currentType] = new Array();
						}
						currentConnectionObject[currentType].push(currentRelationId);
					}
				}
			}
			
			relationsStorage.updateValue("incoming", incoming);
			
			let userRelations = new Object();
			{
				let addToObject = userRelations;
				let currentArray = aData["relations"]["userRelations"];
				
				if(currentArray) {
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let currentRelationData = currentArray[i];
						let currentRelationId = currentRelationData["id"];
						let item = this.ensureUserRelationExists(currentRelationData);
					
						let connectionType = currentRelationData["connectionType"];
						if(!addToObject[connectionType]) {
							addToObject[connectionType] = new Array();
						}
					
						let currentConnectionObject = addToObject[connectionType];
						currentConnectionObject.push(currentRelationId);
					}
				}
			}
			
			relationsStorage.updateValue("userRelations", userRelations);
		}
		
		let postEditor = new PostEditor();
		item.addType("postEditor", postEditor);
		saveItems.push(postEditor);
		
		{
			let currentArray = this._settings["postFields"];
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentSettings = currentArray[i];
				let fieldName = currentSettings["field"];
				postEditor.addField(fieldName, aData[fieldName], currentSettings["saveType"], currentSettings["changeGenerator"]);
			}
		}
		
		item.addType("orderStorage", new Wprr.utils.DataStorage());
		let orderEditor = new OrderEditor();
		item.addType("orderEditor", orderEditor);
		saveItems.push(orderEditor);
		
		let orders = Wprr.objectPath(aData, "relations.orders");
		if(orders) {
			let currentArray = orders;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentOrder = currentArray[i];
				orderEditor.addOrder(currentOrder["forType"], currentOrder["order"]);
			}
		}
		
		item.addType("saveItems", saveItems);
		
		{
			let commandName = "setupItem";
			if(this._commands.hasInput(commandName)) {
				Wprr.utils.CommandPerformer.perform(this._commands.getInput(commandName, null, this), item, this);
			}
		}
		
		item.addType("isLoadedForEdit", true);
	}
	
	addItemData(aData) {
		console.log("addItemData");
		console.log(aData);
		
		if(!aData) {
			console.error("No data provided", aData);
			return null;
		}
		
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		
		this._setupItem(item, aData);
		
		let allIds = [].concat(this._editStorage.getValue("allIds"));
		allIds.push(currentId);
		this._editStorage.updateValue("allIds", allIds);
		
		return item;
	}
	
	enableEditsForItem(aId) {
		console.log("ItemsEditor::enableEditsForItem");
		let allIds = [].concat(this._editStorage.getValue("allIds"));
		
		if(allIds.indexOf(aId) === -1) {
			allIds.push(aId);
			this._editStorage.updateValue("allIds", allIds);
			
			this._updateSaveAllStatus();
		}
	}
	
	disableEditsForItem(aId) {
		console.log("ItemsEditor::disableEditsForItem");
		let allIds = [].concat(this._editStorage.getValue("allIds"));
		
		let index = allIds.indexOf(aId);
		if(index !== -1) {
			allIds.splice(index, 1);
			this._editStorage.updateValue("allIds", allIds);
			
			this._updateSaveAllStatus();
		}
	}
	
	setupCreation(aType, aInGroup = null, aCreationMethod = null) {
		
		this._objectType = aType;
		
		this._addChangeData = new Wprr.utils.ChangeData();
		this._addChangeData.setTitle("New " + aType);
		this._addChangeData.setTerm(aType, "dbm_type", "slugPath", "addTerms");
		
		this._addChangeData.addSetting("dataType", aType);
		if(aCreationMethod) {
			this._addChangeData.addSetting("creationMethod", aCreationMethod);
		}
		
		if(aInGroup) {
			this._addChangeData.setField("dbm/inAdminGrouping", aInGroup);
		}
		
		return this;
	}
	
	start() {
		//METODO: add listener for navigation
	}
	
	_getLoader() {
		let loader = this.project.getLoader();
		
		return loader;
	}
	
	createItem() {
		//console.log("createItem");
		
		this._editStorage.updateValue("creatingStatus", "creating");
		
		let loader = this._getLoader();
		
		let url = Wprr.utils.wprrUrl.getCreateUrl(this._dataType);
		url = this.project.getWprrUrl(url);
		
		loader.setupJsonPost(url, this._addChangeData.getCreateData());
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.source("event", "raw", "data.id")]));
		loader.load();
	}
	
	_itemCreated(aId) {
		//console.log("_itemCreated");
		
		let language = this.project.getCurrentLanguage();
		
		let url = "wprr/v1/range-item/" + this._dataType + "/drafts,idSelection/" + this._encoders + "?ids=" + aId + "&language=" + language;
		
		let loader = this.project.getSharedLoader(url);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._addCreatedRow, [Wprr.source("event", "raw", "data")]));
		
		loader.load();
	}
	
	_addCreatedRow(aData) {
		//console.log("_addCreatedRow");
		//console.log(aData);
		
		this.addItemData(aData);
		
		this._editStorage.updateValue("creatingStatus", "none");
	}
	
	_updateSaveAllStatus() {
		//console.log("_updateSaveAllStatus");
	
		let hasChanges = false;
		let currentArray = this._editStorage.getValue("allIds");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let saveItems = this._items.getItem(currentArray[i]).getType("saveItems");
			let currentArray2 = saveItems;
			let currentArray2Length = currentArray2.length;
			for(let j = 0; j < currentArray2Length; j++) {
				let currentSaveItem = currentArray2[j];
				if(currentSaveItem.hasUnsavedChanges()) {
					hasChanges = true;
					break;
				}
			}
			if(hasChanges) {
				break;
			}
		}
		
		this._editStorage.updateValue("saveAll.hasChanges", hasChanges);
	}
	
	getSaveLoaders(aItems) {
		aItems = Wprr.utils.array.singleOrArray(aItems);
		
		let saveDatas = new Array();
		
		{
			let currentArray = aItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let saveItems = this._items.getItem(currentArray[i]).getType("saveItems");
				let currentArray2 = saveItems;
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let currentSaveItem = currentArray2[j];
					console.log(currentSaveItem);
					let currentSaveDatas = currentSaveItem.getSaveDatas();
					console.log(currentSaveDatas);
				
					saveDatas = saveDatas.concat(currentSaveDatas);
				}
			}
		}
		
		let startCommands = new Array();
		let loadingSequence = new Wprr.utils.LoadingSequence();
		let groups = Wprr.utils.array.groupArray(saveDatas, "id");
		{
			let currentArray = groups;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentGroup = currentArray[i];
				let loader = this._getLoader();
				
				let changeData = new Wprr.utils.ChangeData();
				
				let currentArray2 = currentGroup["value"];
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let currentSaveData = currentArray2[j];
					
					startCommands = startCommands.concat(currentSaveData.startCommands);
					loader.addSuccessCommands(currentSaveData.savedCommands);
					loader.addErrorCommands(currentSaveData.errorCommands);
					
					changeData.addChanges(currentSaveData.changes.getChanges());
				}
				
				loader.setupJsonPost(this.project.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(currentGroup["key"])), changeData.getEditData());
				loadingSequence.addLoader(loader);
			}
		}
		
		loadingSequence.addCommands("start", startCommands);
		loadingSequence.addCommand("loaded", Wprr.commands.callFunction(this, this._updateSaveAllStatus));
		
		return loadingSequence;
	}
	
	getSaveAllLoaders() {
		//console.log("getSaveAllLoaders");
		
		let loadingSequence = this.getSaveLoaders(this._editStorage.getValue("allIds"));
		return loadingSequence;
	}
	
	saveAll() {
		//console.log("saveAll");
		
		let loadingSequence = this.getSaveAllLoaders();
		loadingSequence.load();
	}
	
	saveField(aFieldItem, aComment = null) {
		//console.log("saveField");
		//console.log(aFieldItem);
		
		let changeData = new Wprr.utils.ChangeData();
		let loader = this._getLoader();
		
		let groupId = aFieldItem.getType("parentItem").getType("messageGroup").getId();
		let field = aFieldItem.getType("field");
		let editStorage = aFieldItem.getType("editStorage");
		let fieldName = field.key;
		let value = field.getValue();
		
		changeData.setDataField(fieldName, value, aComment);
		
		loader.setupJsonPost(this.project.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(groupId)), changeData.getEditData());
		
		loader.addSuccessCommand(Wprr.commands.setValue(editStorage, "saved.value", value));
		
		let statusName = "uiState.status";
		loader.addSuccessCommand(Wprr.commands.setValue(editStorage, statusName, "normal"));
		loader.addErrorCommand(Wprr.commands.setValue(editStorage, statusName, "normal"));
		
		let workModeName = "uiState.workMode";
		loader.addSuccessCommand(Wprr.commands.setValue(editStorage, workModeName, "display"));
		loader.addErrorCommand(Wprr.commands.setValue(editStorage, workModeName, "display"));
		
		editStorage.updateValue(statusName, "saving");
		
		loader.load();
		
		return this;
	}
	
	selectAll() {
		let ids = this._editStorage.getValue("filteredIds");
		this._editStorage.updateValue("selection", [].concat(ids));
	}
	
	selectNone() {
		this._editStorage.updateValue("selection", []);
	}
}
