//import WprrRenderer from "wprr/WprrRenderer";
export default class WprrRenderer  {

	constructor() {
		
		this._seoRenderPath = null;
		this._seoPath = null;
		this._seoKey = null;
		
		this._initialLoadPath = null;
		this._permalink = null;
		this._storeController = null;
		this._rootNode = null;
		
		this._shouldSaveInitialLoad = false;
		this._shouldSaveSeoRender = false;
		
		this._timeoutId = -1;
		this._checkForRenderBound = this._checkForRender.bind(this);
	}
	
	setup(aStoreController, aRootNode) {
		
		this._storeController = aStoreController;
		this._rootNode = aRootNode;
		
		return this;
	}
	
	setupInitialLoad(aInitialLoadPath, aPermalink) {
		this._initialLoadPath = aInitialLoadPath;
		
		this._permalink = aPermalink;
		this._shouldSaveInitialLoad = true
	}
	
	setupSeoRender(aRenderPath, aPath, aKey) {
		this._seoRenderPath = aRenderPath;
		this._seoPath = aPath;
		this._seoKey = aKey;
		
		this._shouldSaveSeoRender = true;
		
		return this;
	}
	
	_checkForRender() {
		if(this._storeController.getLoadingPaths().length > 0) {
			this._timeoutId = setTimeout(this._checkForRenderBound, 1);
		}
		else {
			
			if(this._shouldSaveInitialLoad) {
				let paths = this._storeController.getPaths();
				
				let loadPromise = fetch(this._initialLoadPath, {
					"method": "POST",
					"body": JSON.stringify({"paths": paths, "permalink": this._permalink}),
					"credentials": "include", 
					"headers": {
						"X-WP-Nonce": window.oaWpConfiguration.nonce,
						'Content-Type': 'application/json'
					}
				});
			}
			
			
			if(this._shouldSaveSeoRender) {
				let seoRender = this._rootNode.innerHTML;
				
				let loadPromise = fetch(this._seoRenderPath, {
					"method": "POST",
					"body": JSON.stringify({"path": this._seoPath, "key": this._seoKey, "seoRender": seoRender}),
					"credentials": "include", 
					"headers": {
						"X-WP-Nonce": window.oaWpConfiguration.nonce,
						'Content-Type': 'application/json'
					}
				});
			}
		}
	}
	
	startCheckingForRender() {
		console.log("oa/mrouter/WprrRenderer::startCheckingForRender");
		
		this._timeoutId = setTimeout(this._checkForRenderBound, 1);
	}
}
