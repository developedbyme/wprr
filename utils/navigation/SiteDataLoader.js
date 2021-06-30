import Wprr from "wprr/Wprr";

//import SiteDataLoader from "wprr/utils/navigation/SiteDataLoader";
export default class SiteDataLoader {

	constructor() {
		
		this._url = Wprr.sourceValue(null);
		this._loadedUrl = Wprr.sourceValue(null);
		this._loaded = Wprr.sourceValue(null);
		this._item = Wprr.sourceValue(null);
		
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
		console.log("_updateUrl");
		
		let url = this._url.value;
		let urlItem = this._items.getItem(url);
		
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
				let wprrUrl = Wprr.utils.url.addQueryString(url, "mRouterData", "json");
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
			let wprrUrl = Wprr.utils.url.addQueryString(url, "mRouterData", "json");
			loader = this._items.project.getSharedLoader(wprrUrl);
		}
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._loaderLoaded, [urlItem, loader]));
		loader.load();
	}
	
	setupDataForUrl(aUrl, aData) {
		this._setupItem(this._items.getItem(aUrl), aData);
		
		return this;
	}
	
	_setupItem(aItem, aData) {
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
					currentItem.addType("postType", postData.getType());
				}
			}
			
			aItem.getLinks("posts").addItems(postIds);
			
			if(postIds.length === 1) {
				aItem.addSingleLink("post", postIds[0]);
			}
		}
		
		console.log(data);
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
		
		aItem.addType("canRender", true);
		
		console.log(aItem);
	}
	
	_loaderLoaded(aItem, aLoader) {
		console.log("_loaderLoaded");
		console.log(aItem, aLoader);
		
		this._setupItem(aItem, aLoader.getData()["data"]);
		
		console.log(aItem);
		
		let url = aItem.id;
		if(this._url.value === url) {
			this._setLoadedUrl(url);
		}
	}
	
	_setLoadedUrl(aUrl) {
		console.log("_setLoadedUrl");
		this._loadedUrl.value = aUrl;
		this._item.value = this._items.getItem(aUrl);
		this._loaded.value = true;
	}
}
