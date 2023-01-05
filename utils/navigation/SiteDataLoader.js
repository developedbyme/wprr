import Wprr from "wprr/Wprr";

//import SiteDataLoader from "wprr/utils/navigation/SiteDataLoader";
export default class SiteDataLoader {

	constructor() {
		
		this._url = Wprr.sourceValue(null);
		this._loadedUrl = Wprr.sourceValue(null);
		this._loaded = Wprr.sourceValue(null);
		this._item = Wprr.sourceValue(null);
		
		this.disableInitialData = false;
		
		this._items = null;
		
		this._url.addChangeCommand(Wprr.commands.callFunction(this, this._updateUrl));
	}
	
	setItems(aItems) {
		this._items = aItems;
		
		return this;
	}
	
	get url() {
		return this._url.value;
	}
	
	set url(aValue) {
		this._url.value = aValue;
		
		return aValue;
	}
	
	get urlSource() {
		return this._url;
	}
	
	get loadedUrl() {
		return this._loadedUrl.value;
	}
	
	get loadedUrlSource() {
		return this._loadedUrl;
	}
	
	get loaded() {
		return this._loaded.value;
	}
	
	get loadedSource() {
		return this._loaded;
	}
	
	get item() {
		return this._item.value;
	}
	
	get itemSource() {
		return this._item;
	}
	
	_updateUrl() {
		//console.log("_updateUrl");
		
		let url = this._url.value;
		let urlItem = this._items.getItem(url);
		
		//console.log(url, urlItem, this);
		
		if(urlItem.hasType("canRender") && urlItem.getType("canRender")) {
			this._setLoadedUrl(url);
		}
		else {
			this._loaded.value = false;
			
			let loader;
			if(urlItem.hasType("loader")) {
				loader = urlItem.getType("loader");
			}
			else {
				//let wprrUrl = Wprr.utils.url.addQueryString(url, "mRouterData", "json");
				let wprrUrl = this._items.project.getWprrUrl("url/?url=" + encodeURIComponent(url), "wprrData");
				loader = this._items.project.getSharedLoader(wprrUrl);
			}
			
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._loaderLoaded, [urlItem, loader]));
			loader.load();
		}
	}
	
	loadUrl(aUrl) {
		
		let url = aUrl;
		let urlItem = this._items.getItem(aUrl);
		
		let loader;
		if(urlItem.hasType("loader")) {
			loader = urlItem.getType("loader");
		}
		else {
			//let wprrUrl = Wprr.utils.url.addQueryString(url, "mRouterData", "json");
			let wprrUrl = this._items.project.getWprrUrl("url/?url=" + encodeURIComponent(url), "wprrData");
			loader = this._items.project.getSharedLoader(wprrUrl);
		}
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._loaderLoaded, [urlItem, loader]));
		loader.load();
	}
	
	setupDataForUrl(aUrl, aData) {
		
		let addData = true;
		if(document.location.href.indexOf("debug_dataApi=1") >= 0) {
			addData = false;
		}
		
		if(addData && !this.disableInitialData) {
			this._setupItem(this._items.getItem(aUrl), aData);
		}
		
		return this;
	}
	
	_setupItem(aItem, aData) {
		//console.log("SiteDataLoader::_setupItem");
		//console.log(aItem, aData);
		
		let url = aItem.id;
		let items = aItem.group;
		
		let data = aData;
		
		aItem.addType("data", data);
		
		let posts = Wprr.objectPath(data, "posts");
		if(posts) {
			let postIds = new Array();
			let currentArray = posts;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentPostData = currentArray[i];
				let currentId = currentPostData["id"];
				let currentItem = items.getItem(currentId);
				postIds.push(currentId);
				
				if(!currentItem.hasType("postData")) {
					currentItem.addType("rawPostData", currentPostData);
					
					let postData = new Wprr.wp.postdata.PostData();
					postData.setData(currentPostData);
					currentItem.addType("postData", postData);
					currentItem.setValue("postType", postData.getType());
					
					//METODO: add post template
					//METODO: link up taxonomies
				}
			}
			
			aItem.getLinks("posts").addItems(postIds);
			
			if(postIds.length === 1) {
				aItem.addSingleLink("post", postIds[0]);
			}
		}
		
		//console.log(data);
		if(Wprr.objectPath(data, "templateSelection.is_singular")) {
			aItem.addType("pageType", "page");
		}
		else if(Wprr.objectPath(data, "templateSelection.is_archive")) {
			aItem.addType("pageType", "archive");
		}
		else if(Wprr.objectPath(data, "templateSelection.is_404")) {
			aItem.addType("pageType", "missing");
		}
		else if(Wprr.objectPath(data, "templateSelection.is_search")) {
			aItem.addType("pageType", "search");
		}
		
		aItem.addType("language", Wprr.objectPath(data, "queryData.language"));
		
		aItem.addType("canRender", true);
		
		//console.log(aItem);
	}
	
	_loaderLoaded(aItem, aLoader) {
		//console.log("_loaderLoaded");
		//console.log(aItem, aLoader);
		
		let group = aItem.group;
		
		//this._setupItem(aItem, aLoader.getData()["data"]);
		
		
		let loaderData = aLoader.getData()["data"];
		//console.log(loaderData);
		
		let data = loaderData["posts"];
		let items = Wprr.objectPath(data, "items");
		let encodings = Wprr.objectPath(data, "encodings");
		for(let objectName in encodings) {
			let ids = encodings[objectName];
			let currentArray = ids;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let item = group.getItem(currentId);
				group.prepareItem(item, objectName);
				group.setupItem(item, objectName, items[""+currentId]);
			}
		}
		
		aItem.addType("pageType", loaderData["pageType"]);
		aItem.addType("language", loaderData["language"]);
		
		let postIds = Wprr.objectPath(loaderData, "posts.ids");
		if(postIds) {
			aItem.getLinks("posts").addUniqueItems(postIds);
			if(postIds.length === 1) {
				aItem.addSingleLink("post", postIds[0]);
			}
			
			let currentArray = group.getItems(postIds);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentPostItem = currentArray[i];
				
				let postData = Wprr.wp.postdata.ItemPostData.create(currentPostItem);
				currentPostItem.addType("postData", postData);
			}
		}
		
		aItem.addType("canRender", true);
		
		//console.log(aItem);
		
		let url = aItem.id;
		if(this._url.value === url) {
			this._setLoadedUrl(url);
		}
	}
	
	_setLoadedUrl(aUrl) {
		//console.log("_setLoadedUrl");
		this._loadedUrl.value = aUrl;
		this._item.value = this._items.getItem(aUrl);
		this._loaded.value = true;
	}
}
