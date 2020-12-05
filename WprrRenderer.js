import Wprr from "wprr/Wprr";

//import WprrRenderer from "wprr/WprrRenderer";
export default class WprrRenderer  {

	constructor() {
		
		this._pathCheckRegExps = new Array();
		
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
	
	setupInitialLoad(aInitialLoadPath, aPermalink, aBasePath = null) {
		this._initialLoadPath = aInitialLoadPath;
		
		this._permalink = aPermalink;
		
		if(aBasePath) {
			this._pathCheckRegExps.push(new RegExp(aBasePath.split(".").join("\\.") + ".*"));
		}
		
		this._shouldSaveInitialLoad = true;
	}
	
	setupSeoRender(aRenderPath, aPath, aKey) {
		this._seoRenderPath = aRenderPath;
		this._seoPath = aPath;
		this._seoKey = aKey;
		
		this._shouldSaveSeoRender = true;
		
		return this;
	}
	
	_checkForRender() {
		//console.log("_checkForRender");
		let isDone = this._storeController.loadingIsDone();
		
		if(!isDone) {
			this._timeoutId = setTimeout(this._checkForRenderBound, 1);
		}
		else {
			if(this._shouldSaveInitialLoad) {
				let paths = this._storeController.getPaths();
				
				let currentArray2 = this._pathCheckRegExps;
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					
				}
				
				let validPaths = new Array();
				
				let currentArray = paths;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentPath = currentArray[i];
					
					let isValid = true;
					for(let j = 0; j < currentArray2Length; j++) {
						if(!currentArray2[j].test(currentPath)) {
							isValid = false;
							break;
						}
					}
					
					if(isValid) {
						validPaths.push(currentPath);
					}
				}
				
				let loader = new Wprr.utils.JsonLoader();
				loader.setupJsonPost(this._initialLoadPath, {"paths": validPaths, "permalink": this._permalink});
				loader.load();
			}
			
			
			if(this._shouldSaveSeoRender) {
				let seoRender = this._rootNode.innerHTML;
				
				let loader = new Wprr.utils.JsonLoader();
				loader.setupJsonPost(this._seoRenderPath, {"path": this._seoPath, "key": this._seoKey, "seoRender": seoRender});
				loader.load();
			}
		}
	}
	
	startCheckingForRender() {
		console.log("WprrRenderer::startCheckingForRender");
		
		this._timeoutId = setTimeout(this._checkForRenderBound, 1);
	}
}
