import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";

//import SiteNavigation from "wprr/utils/navigation/SiteNavigation";
export default class SiteNavigation extends ProjectRelatedItem {

	constructor() {
		
		super();
		
		this.createSource("url", null);
		this.createSource("active", false);
		this.createSource("travelPaths", []);
		
		this.dataLoader = null;
		
		this._handleLinkBound = this._handleLink.bind(this);
		this._handleNavigationChangeBound = this._handleNavigationChange.bind(this);
		this._checkNavigationLocksBound = this._checkNavigationLocks.bind(this);
		
		this.createSource("allowedPaths", []);
		
		this.createSource("ignoredPaths", [
			new RegExp("/wp-admin/.*$"),
			new RegExp("/wp-content/.*$"),
			new RegExp("/wp-login\\.php.*$")
		]);
	}
	
	get urlSource() {
		return this.sources.get("url");
	}
	
	_hasSpecialKey(aEvent) {
		return aEvent.altKey || aEvent.ctrlKey || aEvent.metaKey || aEvent.shiftKey;
	}
	
	_shouldHandle(aLink) {
		let shouldHandle = false
		{
			let currentArray = this.allowedPaths;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentIgnoredPattern = currentArray[i];
				if(currentIgnoredPattern.test(aLink)) {
					shouldHandle = true;
					break;
				}
			}
		}
		
		if(!shouldHandle) {
			return false;
		}
		
		{
			let currentArray = this.ignoredPaths;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentIgnoredPattern = currentArray[i];
				if(currentIgnoredPattern.test(aLink)) {
					return false;
				}
			}
		}
		
		
		return true;
	}
	
	_handleLink(aEvent) {
		//console.log("_handleLink");
		
		if(aEvent.defaultPrevented) {
			return true;
		}
		if(this._hasSpecialKey(aEvent)) {
			return true;
		}
		
		let link = null;
		let currentNode = aEvent.target;
		let debugCounter = 0;
		while(currentNode) {
			if(debugCounter++ > 10000) {
				console.error("Loop has run for too long");
				break;
			}
			if(currentNode.localName === "a") {
				let hrefAttribute = currentNode.getAttribute("href");
				if(hrefAttribute) {
					link = hrefAttribute.toString();
					let hardNavigation = currentNode.getAttribute("data-not-spa-link");
					if(hardNavigation) {
						return true;
					}
					break;
				}
			}
			currentNode = currentNode.parentNode;
		}
		
		if(!link) {
			return true;
		}
		
		let originalUrl = new URL(document.location.href);
		let finalUrl = new URL(link, document.location.href);
		
		if(originalUrl.hostname !== finalUrl.hostname) {
			return true;
		}
		
		if(!this._shouldHandle(finalUrl.href)) {
			return false;
		}
		
		//console.log(finalUrl);
		
		aEvent.preventDefault();
		
		this._internalNavigation(finalUrl.href);
		window.scrollTo(0, 0);
		
		return false;
	}
	
	_addUrlToPath(aUrl) {
		let paths = [].concat(this.travelPaths);
			
		paths.push(aUrl);
		
		this.travelPaths = paths;
	}
	
	_trackPage(aUrl) {
		//console.log("_trackPage");
		//console.log(aUrl, this.project);
		
		let trackingController = Wprr.objectPath(this.project.items, "project.tracking.linkedItem.trackingController");
		if(trackingController) {
			trackingController.trackPage(aUrl);
		}
	}
	
	_internalNavigation(aUrl) {
		
		let locks = this.getLockedNavigationLocks();
		if(locks.length > 0) {
			if(!confirm("Leave without saving changes?")) {
				return;
			}
		}
		
		history.pushState({}, "Page", aUrl);
		this.url = aUrl;
		
		this._trackPage(aUrl);
		
		this._addUrlToPath(aUrl);
	}
	
	_handleNavigationChange(aEvent) {
		//console.log("_handleNavigationChange");
		
		let url = document.location.href;;
		this.url = url;
		
		this._trackPage(url);
		
		let paths = [].concat(this.travelPaths);
		paths.pop();
		this.travelPaths = paths;
	}
	
	getLockedNavigationLocks() {
		console.log("getLockedNavigationLocks");
		let locks = this.project.item.getLinks("navigationLocks").items;
		
		let lockedLocks = Wprr.utils.array.getItemsBy("locked.value", true, locks);
		
		return lockedLocks;
	}
	
	hasNavigationLock() {
		
		let locks = this.getLockedNavigationLocks();
		
		return (locks.length > 0);
	}
	
	_checkNavigationLocks(aEvent) {
		console.log("_checkNavigationLocks");
		
		let isLocked = this.hasNavigationLock();
		
		if(isLocked) {
			aEvent.preventDefault();
			aEvent.returnValue = "";
		
			return true;
		}
		
		return false;
	}
	
	setUrlFromLocation() {
		let url = document.location.href;
		this.url = url
		
		this._addUrlToPath(url);
		
		return this;
	}
	
	start() {
		
		//METODO: move this to a change event on active
		window.addEventListener("beforeunload", this._checkNavigationLocksBound, true);
		window.addEventListener("click", this._handleLinkBound, false);
		window.addEventListener("popstate", this._handleNavigationChangeBound, false);
		
		this.active = true;
		
		return this;
	}
	
	stop() {
		
		//METODO: move this to a change event on active
		window.removeEventListener("beforeunload", this._checkNavigationLocksBound, true);
		window.removeEventListener("click", this._handleLinkBound, false);
		window.removeEventListener("popstate", this._handleNavigationChangeBound, false);
		
		this.active = false;
		
		return this;
	}
	
	navigate(aUrl) {
		//console.log("SiteNavigation::navigate");
		//console.log(aUrl);
		
		let originalUrl = new URL(document.location.href);
		let finalUrl = new URL(aUrl, document.location.href);
		//console.log(finalUrl);
		
		if(this.active && originalUrl.hostname === finalUrl.hostname && this._shouldHandle(finalUrl.href)) {
			this._internalNavigation(finalUrl.href);
			window.scrollTo(0, 0);
		}
		else {
			document.location.href = aUrl;
		}
	}
	
	preload(aUrl) {
		let originalUrl = new URL(document.location.href);
		let finalUrl = new URL(aUrl, document.location.href);
		
		if(this.active && originalUrl.hostname === finalUrl.hostname && this._shouldHandle(finalUrl.href)) {
			this.dataLoader.loadUrl(finalUrl.href);
		}
	}
}
