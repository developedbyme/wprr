import objectPath from "object-path";

import JsonLoader from "wprr/utils/loading/JsonLoader";
import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";

// import StoreController from "wprr/store/StoreController";
export default class StoreController {
	
	constructor() {
		//console.log("wprr/store/StoreController::constructor");
		
		this._nextTransactionId = 0;
		
		this._loaders = new Object();
		
		this._store = null;
		this._userData = null;
		
		this._dynamicReducers = [];
		
		//this._encodeLoadedDataBound = this._encodeLoadedData.bind(this);
		this.dynamicReduceBound = this.dynamicReduce.bind(this);
		
		//this.apiFormat = "wprr";
		
		this._urlResolvers = new MultipleUrlResolver();
	}
	
	loadingIsDone() {
		let hasLoader = false;
		let allDone = true;
		
		for(let objectName in this._loaders) {
			hasLoader = true;
			let currentLoader = this._loaders[objectName];
			if(currentLoader.getStatus() !== 1) {
				allDone = false;
				break;
			}
		}
		
		return (hasLoader && allDone)
	}
	
	getPaths() {
		
		let returnArray = new Array();
		
		for(let objectName in this._loaders) {
			returnArray.push(objectName);
		}
		
		return returnArray;
	}
	
	getUrlResolvers() {
		return this._urlResolvers;
	}
	
	addDynamicReducer(aReducer) {
		this._dynamicReducers.push(aReducer);
		
		return this._dynamicReducers;
	}
	
	setStore(aStore) {
		this._store = aStore;
		
		//this._performDispatch("wprr_StoreController_setup", null, null);
		
		return  this;
	}
	
	getStore() {
		return this._store;
	}
	
	setUser(aUserData) {
		this._userData = aUserData;
	}
	
	_performDispatch(aType, aPath, aData) {
		this._store.dispatch({
			"type": aType,
			"path": aPath,
			"data": aData,
			"timeStamp": Date.now()
		});
	}
	
	getLoader(aPath) {
		let loader = this._loaders[aPath];
		if(!loader) {
			loader = new JsonLoader();
			loader.setUrl(aPath);
			
			let currentState = this._store.getState();
			
			if(false) {
				//METODO: check
			}
			else {
				if(this._userData && this._userData.restNonce) {
					loader.addHeader("X-WP-Nonce", this._userData.restNonce);
				}
				loader.addSuccessCommand(CallFunctionCommand.create(this, this._loaderLoaded, [aPath, loader]));
				loader.addErrorCommand(CallFunctionCommand.create(this, this._loaderError, [aPath, loader]));
			}
			this._loaders[aPath] = loader;
		}
		
		return loader;
	}
	
	addLoader(aPath, aLoader) {
		this._loaders[aPath] = aLoader;
		
		return this;
	}
	
	getLoaderByRelativePath(aPath, aLocation = "default") {
		let absolutePath = this.getAbsolutePath("M-ROUTER-API-DATA", aPath, aLocation);
		return this.getLoader(absolutePath);
	}
	
	invalidateAllSubPaths(aPath) {
		//console.log("wprr/store/StoreController::invalidateAllSubPaths");
		
		for(let path in this._loaders) {
			if(path.indexOf(aPath) === 0) {
				this._loaders[path].invalidate();
			}
		}
	}
	
	_loaderLoaded(aPath, aLoader) {
		this._dataLoaded(aPath, aLoader.getData());
	}
	
	_loaderError(aPath, aLoader) {
		this._loadingError(aPath, null);
	}
	
	_load(aPath) {
		let loader = this.getLoader(aPath);
		if(loader.getStatus() === 0) {
			loader.load();
		}
		return loader;
	}
	
	_dataLoaded(aPath, aData) {
		//console.log("wprr/store/StoreController::_dataLoaded");
		//console.log(aPath, aData);
		
		this._performDispatch(StoreController.LOADED, aPath, aData);
	}
	
	_loadingError(aPath, aError) {
		//console.log("wprr/store/StoreController::_loadingError");
		
		this._performDispatch(StoreController.ERROR_LOADING, aPath, aError);
	}
	
	_performRequest(aPath) {
		//console.log("wprr/store/StoreController::_performRequest");
		//console.log(aPath);
		
		this._load(aPath);
	}
	
	requestApiData(aPath, aLocation) {
		//console.log("wprr/store/StoreController::requestApiData");
		//console.log(aPath, aLocation);
		
		let currentState = this._store.getState();
		let dataUrl = this._urlResolvers.resolveUrl(aPath, aLocation);
		
		this._performRequest(dataUrl);
		
	}
	
	requestUrlData(aPath, aDataUrl) {
		//console.log("wprr/store/StoreController::requestUrlData");
		
		this._performRequest(aDataUrl);
		
	}
	
	getPostByIdApiPath(aId) {
		return "m-router-data/v1/post/" + aId;
	}
	
	requestPostById(aId) {
		
		var path = this.getPostByIdApiPath(aId);
		
		var currentState = this._store.getState();
		var apiBaseUrl = currentState.settings.wpApiUrlBase;
		var dataUrl = apiBaseUrl + path;
		
		this._performRequest(dataUrl);
	}
	
	getPostRangeApiPath(aPath) {
		return "m-router-data/v1/" + aPath;
	}
	
	requestPostRange(aPath) {
		
		var path = this.getPostRangeApiPath(aPath)
		
		var currentState = this._store.getState();
		var apiBaseUrl = currentState.settings.wpApiUrlBase;
		var dataUrl = apiBaseUrl + path;
		
		this._performRequest(dataUrl);
	}
	
	getMenuApiPath(aPath) {
		return "m-router-data/v1/menu/" + aPath;
	}
	
	requestMenuData(aPath) {
		let path = this.getMenuApiPath(aPath);
		
		let currentState = this._store.getState();
		let apiBaseUrl = currentState.settings.wpApiUrlBase;
		let dataUrl = apiBaseUrl + path;
		
		this._performRequest(dataUrl);
	}
	
	
	
	setGlobalVariable(aPath, aValue) {
		//console.log("setGlobalVariable");
		//console.log(aPath, aValue);
		
		this._performDispatch(StoreController.SET_GLOBAL_VARIABLE, aPath, aValue);
	}
	
	getGlobalVariable(aPath) {
		let currentState = this._store.getState();
		
		return objectPath.get(currentState.globalVariables, aPath);
	}
	
	/*
	adjustData(aId, aData) {
		this._performDispatch(StoreController.DATA_ADJUSTMENT, aId, aData);
	}
	
	postWithAdjustTransaction(aUrl, aData, aAdjustId, aInitialStatus = "loading", aSuccessStatus = "done", aErrorStatus = "failed") {
		
		var currentState = this._store.getState();
		var apiBaseUrl = currentState.settings.wpApiUrlBase;
		var dataUrl = apiBaseUrl + aUrl;
		
		var transactionId = this._nextTransactionId++;
		
		this.adjustData(aAdjustId, {"status": aInitialStatus, "transactionId": transactionId});
		
		var loadPromise = this._post(dataUrl, aData);
		
		loadPromise.then(this._encodeLoadedDataBound)
		.then( (data) => {
			this.adjustData(aAdjustId, {"status": aSuccessStatus, "transactionId": transactionId});
		})
		.catch( (error) => {
			this.adjustData(aAdjustId, {"status": aErrorStatus, "transactionId": transactionId});
		});
	}
	*/
	
	dynamicReduce(aState, aAction) {
		
		let newState = aState;
		
		let currentArray = this._dynamicReducers;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentReducer = currentArray[i];
			newState = currentReducer(newState, aAction);
		}
		
		return newState;
	}
	
	reduce(state, action) {
		//console.log("wprr/store/StoreController::reduce");
		//console.log(action);
		
		var newState = new Object();
		for(var objectName in state) {
			newState[objectName] = state[objectName];
		}
		
		if(!newState["loadedData"]) newState["loadedData"] = new Object();
	
		if(!newState["currentPage"]) newState["currentPage"] = null;
		//if(!newState["dataAdjustments"]) newState["dataAdjustments"] = new Object();

		switch (action.type) {
			case StoreController.SET_CURRENT_PAGE:
				newState["currentPage"] = action.url;
				return newState;
			case StoreController.LOADED:
				//console.log(action.path, newState.apiData[action.path]);
				newState["loadedData"][action.path] = action.data;
				return newState;
			case StoreController.ERROR_LOADING:
				//console.log(action.path, newState.apiData[action.path]);
				newState["loadedData"][action.path] = null;
				return newState;
			/*
			case StoreController.DATA_ADJUSTMENT:
				if(!newState.dataAdjustments[action.path]) {
					newState.dataAdjustments[action.path] = new Array();
				}
				var newArray = [].concat(newState.dataAdjustments[action.path]);
				newArray.push(action.data);
				
				newState.dataAdjustments[action.path] = newArray;
				
				return newState;
				*/
			default:
				return newState;
		}
	}
	
	reduceSettings(state, action) {
		
		let newState = new Object();
		for(let objectName in state) {
			newState[objectName] = state[objectName];
		}
		
		switch(action.type) {
			case StoreController.SET_SETTING:
				newState.data[action.name] = action.value;
				return newState;
			default:
				return newState;
			}
	}
	
	reduceGlobalVariables(aState, aAction) {
		//console.log("wprr/store/StoreController::reduceGlobalVariables");
		//console.log(aState, aAction);
		
		let newState = StoreController.copyState(aState);
		
		switch(aAction.type) {
			case StoreController.SET_GLOBAL_VARIABLE:
				objectPath.set(newState, aAction.path, aAction.data);
				break;
			default:
				if(!aState) {
					return new Object();
				}
				return aState;
		}
		
		return newState;
	}
	
	localReduce(aPath, aReducer, aState, aAction) {
		let newState = StoreController.copyState(aState);
		
		let localState = objectPath.get(newState, aPath);
		let newLocalState = aReducer(localState, aAction);
		objectPath.set(newState, aPath, newLocalState);
		
		return newState;
	}
	
	createLocalReducer(aPath, aReducer) {
		return this.localReduce.bind(this, aPath, aReducer);
	}
	
	getAbsolutePath(aType, aPath, aLocation) {
		
		switch(aType) {
			case "M-ROUTER-POST-RANGE":
				return this._urlResolvers.resolveUrl(this.getPostRangeApiPath(aPath), aLocation);
			case "M-ROUTER-POST-BY-ID":
				return this._urlResolvers.resolveUrl(this.getPostByIdApiPath(aPath), aLocation);
			case "M-ROUTER-MENU":
				return this._urlResolvers.resolveUrl(this.getMenuApiPath(aPath), aLocation);
			case "M-ROUTER-API-DATA":
				return this._urlResolvers.resolveUrl(aPath, aLocation);
			case "M-ROUTER-URL":
				{
					let dataUrl = aPath;
					
					dataUrl += ((dataUrl.indexOf("?") === -1) ? "?" : "&");
					dataUrl += "mRouterData=json";
					
					return this._urlResolvers.resolveUrl(dataUrl, aLocation);
				}
			default:
				console.warn("Unknown type " + aType);
				break;
		}
		
		return aPath;
	}
	
	static copyState(aState) {
		let newState = new Object();
		for(let objectName in aState) {
			newState[objectName] = aState[objectName];
		}
		
		return newState;
	}
}

StoreController.SET_CURRENT_PAGE = "M_ROUTER_SET_CURRENT_PAGE";
StoreController.REQUEST_URL = "M_ROUTER_REQUEST_URL";
StoreController.RECEIVE_URL = "M_ROUTER_RECEIVE_URL";
StoreController.REQUEST_POST_BY_ID = "M_ROUTER_REQUEST_POST_BY_ID";
StoreController.RECEIVE_POST_BY_ID = "M_ROUTER_RECEIVE_POST_BY_ID";
StoreController.REQUEST_CUSTOMIZER_DATA = "M_ROUTER_REQUEST_CUSTOMIZER_DATA";
StoreController.RECEIVE_CUSTOMIZER_DATA = "M_ROUTER_RECEIVE_CUSTOMIZER_DATA";
StoreController.REQUEST_POST_RANGE = "M_ROUTER_REQUEST_POST_RANGE";
StoreController.RECEIVE_POST_RANGE = "M_ROUTER_RECEIVE_POST_RANGE";
StoreController.REQUEST_API_DATA = "M_ROUTER_REQUEST_API_DATA";
StoreController.RECEIVE_API_DATA = "M_ROUTER_RECEIVE_API_DATA";

StoreController.ENSURE_LOAD_DATA_EXISTS = "M_ROUTER_ENSURE_LOAD_DATA_EXISTS";
StoreController.START_LOADING = "M_ROUTER_START_LOADING";
StoreController.LOADED = "M_ROUTER_LOADED";
StoreController.ERROR_LOADING = "M_ROUTER_ERROR_LOADING";

StoreController.DATA_ADJUSTMENT = "M_ROUTER_DATA_ADJUSTMENT";

StoreController.SET_SETTING = "setSetting";
StoreController.SET_GLOBAL_VARIABLE = "wprr/setGlobalVariable";