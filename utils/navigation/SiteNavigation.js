import Wprr from "wprr/Wprr";

//import SiteNavigation from "wprr/utils/navigation/SiteNavigation";
export default class SiteNavigation {

	constructor() {
		
		this._url = Wprr.sourceValue("url");
		
		this._handleLinkBound = this._handleLink.bind(this);
		this._handleNavigationChangeBound = this._handleNavigationChange.bind(this);
		
		this._ignoredPaths = new Array();
		
		this._ignoredPaths.push(new RegExp("/wp-admin/.*$"));
	}
	
	get url() {
		return this._url.value;
	}
	
	get urlSource() {
		return this._url;
	}
	
	_hasSpecialKey(aEvent) {
		return aEvent.altKey || aEvent.ctrlKey || aEvent.metaKey || aEvent.shiftKey;
	}
	
	_shouldHandle(aLink) {
		let currentArray = this._ignoredPaths;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentIgnoredPattern = currentArray[i];
			if(currentIgnoredPattern.test(aLink)) {
				return false;
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
					break;
				}
			}
			currentNode = currentNode.parentNode;
		}
		
		if(!link) {
			return true;
		}
		
		let orinalUrl = new URL(document.location.href);
		let finalUrl = new URL(link, document.location.href);
		
		if(orinalUrl.hostname !== finalUrl.hostname) {
			return true;
		}
		
		//METODO: add exclusions
		if(!this._shouldHandle(finalUrl.href)) {
			return false;
		}
		
		//console.log(finalUrl);
		
		aEvent.preventDefault();
		
		history.pushState({}, "Page", finalUrl.href);
		this._url.value = finalUrl.href;
		
		//METODO: trigger analytics
		
		return false;
	}
	
	_handleNavigationChange(aEvent) {
		//console.log("_handleNavigationChange");
		
		this._url.value = document.location.href;
		
		//METODO: trigger analytics
	}
	
	setUrlFromLocation() {
		this._url.value = document.location.href;
		
		return this;
	}
	
	start() {
		window.addEventListener("click", this._handleLinkBound, false);
		window.addEventListener("popstate", this._handleNavigationChangeBound, false);
		
		return this;
	}
	
	stop() {
		window.removeEventListener("click", this._handleLinkBound, false);
		window.removeEventListener("popstate", this._handleNavigationChangeBound, false);
		
		return this;
	}
}
