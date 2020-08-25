import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";

// import ItemsLoader from "wprr/utils/data/ItemsLoader";
export default class ItemsLoader extends ProjectRelatedItem {
	
	constructor() {
		
		super();
		
		this._items = new MultiTypeItemsGroup();
		
		this._externalStorage = new Wprr.utils.DataStorage();
		this._externalStorage.updateValue("url", null);
		this._externalStorage.updateValue("status", 0);
		this._externalStorage.updateValue("ids", []);
		
		this._externalStorage.createChangeCommands("url", null, Wprr.commands.callFunction(this, this._updateUrl));
		
		this._dataTypeName = "data";
	}
	
	get url() {
		return this._externalStorage.getValue("url");
	}
	
	set url(aUrl) {
		this._externalStorage.updateValue("url", aUrl);
		
		return aUrl;
	}
	
	get items() {
		return this._items;
	}
	
	setItems(aItems) {
		this._items = aItems;
		
		return this;
	}
	
	get status() {
		return this._externalStorage.getValue("status");
	}
	
	get ids() {
		return this._externalStorage.getValue("ids");
	}
	
	get externalStorage() {
		return this._externalStorage;
	}
	
	_updateUrl() {
		//console.log("ItemsLoader::_updateUrl");
		let url = this._externalStorage.getValue("url");
		
		if(url) {
			let loader = this.project.getSharedLoader(url);
			
			let status = loader.getStatus();
			
			if(loader.getStatus() === 1) {
				//MENOTE: add support for other API formats
				this._updateData(url, loader.getData()["data"])
			}
			else {
				this._externalStorage.updateValue("status", status);
				this._externalStorage.updateValue("ids", []);
			
				if(loader.getStatus() === -1 || loader.getStatus() === 3) {
					//MENOTE: do nothing
				}
				else {
					loader.addSuccessCommand(Wprr.commands.callFunction(this, this._updateData, [url, Wprr.source("event", "raw", "data")]));
					if(loader.getStatus() === 0) {
						loader.load();
					}
				}
			}
		}
		else {
			this._externalStorage.updateValue("status", 0);
			this._externalStorage.updateValue("ids", []);
		}
		
		return this;
	}
	
	_setupItem(aData) {
		//console.log("ItemsLoader::_setupItem");
		
		let currentId = aData["id"];
		let item = this._items.getItem(currentId);
		if(this._dataTypeName) {
			if(!item.hasType(this._dataTypeName)) {
				item.addType(this._dataTypeName, aData);
			}
		}
		
		//METODO: trigger setup command
		
		return this;
	}
	
	_setupItems(aData) {
		//console.log("ItemsLoader::_setupItems");
		let currentArray = aData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._setupItem(currentArray[i]);
		}
		
		console.log(this._items);
		
		return this;
	}
	
	_updateData(aUrl, aData) {
		//console.log("ItemsLoader::_updateData");
		this._setupItems(aData);
		
		this._setIdsFromData(aUrl, aData);
		
		return this;
	}
	
	_setIdsFromData(aUrl, aData) {
		if(this.url === aUrl) {
			let ids = Wprr.utils.array.mapField(aData, "id");
			
			this._externalStorage.updateValue("ids", ids);
			this._externalStorage.updateValue("status", 1);
		}
		
		return this;
	}
}