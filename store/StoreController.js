import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";

// import StoreController from "wprr/store/StoreController";
export default class StoreController {
	
	constructor() {
		//console.log("wprr/store/StoreController::constructor");
		
		this._nextTransactionId = 0;
		
		this._loadingPaths = new Array();
		this._paths = new Array();
		
		this._store = null;
		this._userData = null;
		
		this._dynamicReducers = [];
		
		this._encodeLoadedDataBound = this._encodeLoadedData.bind(this);
		this.dynamicReduceBound = this.dynamicReduce.bind(this);
		
		this.apiFormat = "wprr";
		
		this._urlResolvers = new MultipleUrlResolver();
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
	
	setUser(aUserData) {
		this._userData = aUserData;
	}
	
	getPaths() {
		return this._paths;
	}
	
	getLoadingPaths() {
		return this._loadingPaths;
	}
	
	_performDispatch(aType, aPath, aData) {
		this._store.dispatch({
			"type": aType,
			"path": aPath,
			"data": aData,
			"timeStamp": Date.now()
		});
	}
	
	_load(aPath) {
		
		let currentState = this._store.getState();
		
		let headers = new Object();
		let options = new Object();
		
		if(this._userData && this._userData.restNonce) {
			headers["X-WP-Nonce"] = this._userData.restNonce;
			options["credentials"] = "include";
			options["headers"] = "headers";
		}
		
		let loadPromise = fetch(aPath, options);
		return loadPromise;
	}
	
	_post(aPath, aData) {
		var currentState = this._store.getState();
		var nonce = currentState.settings.nonce;
		
		var headers = new Object();
		headers["Content-Type"] = "application/json";
		
		if(nonce) {
			headers["X-WP-Nonce"] = nonce;
		}
		
		var loadPromise = fetch(aPath, {method: "POST", body: JSON.stringify(aData), "credentials": "include", "headers": headers});
		return loadPromise;
	}
	
	_encodeLoadedData(aResponse) {
		//console.log("wprr/store/StoreController::_encodeLoadedData");
		
		var returnObject = aResponse.json();
		
		return returnObject;
	}
	
	_removeLoadingPath(aPath) {
		var currentIndex = this._loadingPaths.indexOf(aPath);
		if(currentIndex !== -1) {
			this._loadingPaths.splice(currentIndex, 1);
		}
		//console.log(this._loadingPaths);
	}
	
	_dataLoaded(aPath, aData) {
		//console.log("wprr/store/StoreController::_dataLoaded");
		//console.log(aPath, aData);
		
		let data = null;
		switch(this.apiFormat) {
			case "wprr":
				data = aData.data;
				break;
			default:
				console.warn("No format named " + this.apiFormat + ". Using raw.");
			case "raw":
				data = aData;
				break;
		}
		
		this._performDispatch(StoreController.LOADED, aPath, data);
		this._removeLoadingPath(aPath);
	}
	
	_loadingError(aPath, aError) {
		//console.log("wprr/store/StoreController::_loadingError");
		
		this._performDispatch(StoreController.ERROR_LOADING, aPath, aError);
		this._removeLoadingPath(aPath);
	}
	
	_createLoader(aPath, aDataPath) {
		
		var loadPromise = this._load(aDataPath).then(this._encodeLoadedDataBound)
		.then( (data) => {
			this._dataLoaded(aPath, data);
			//dispatch({ type: StoreController.RECEIVE_API_DATA, data: data.data, timeStamp: Date.now(), path: aPath });
		})
		.catch( (error) => {
			console.error("Loading or setting data crashed.");
			console.log(error);
			this._loadingError(aPath, error);
			//dispatch({ type: StoreController.RECEIVE_API_DATA, error: error, timeStamp: Date.now(), path: aPath });
		});
		
		return loadPromise;
	}
	
	_performRequest(aPath, aDataPath) {
		//console.log("wprr/store/StoreController::_performRequest");
		//console.log(aPath, aDataPath);
		
		this._performDispatch(StoreController.ENSURE_LOAD_DATA_EXISTS, aPath, null);
		
		if(this._paths.indexOf(aPath) === -1) {
			this._paths.push(aPath);
		}
		
		var currentState = this._store.getState();
		
		var currentLoadData = currentState.mRouter.apiData[aPath];
		
		if(currentLoadData.status === 0) {
			
			this._performDispatch(StoreController.START_LOADING, aPath, null);
			
			this._loadingPaths.push(aPath);
			
			this._createLoader(aPath, aDataPath);
		}
	}
	
	requestApiData(aPath, aLocation) {
		console.log("wprr/store/StoreController::requestApiData");
		console.log(aPath, aLocation);
		console.log(this._urlResolvers);
		
		let currentState = this._store.getState();
		let dataUrl = this._urlResolvers.resolveUrl(aPath, aLocation);
		console.log(dataUrl);
		
		this._performRequest(aPath, dataUrl);
		
	}
	
	requestUrlData(aPath, aDataUrl) {
		//console.log("wprr/store/StoreController::requestUrlData");
		
		this._performRequest(aPath, aDataUrl);
		
	}
	
	getPostByIdApiPath(aId) {
		return "m-router-data/v1/post/" + aId;
	}
	
	requestPostById(aId) {
		
		var path = this.getPostByIdApiPath(aId);
		
		var currentState = this._store.getState();
		var apiBaseUrl = currentState.settings.wpApiUrlBase;
		var dataUrl = apiBaseUrl + path;
		
		this._performRequest(path, dataUrl);
	}
	
	getPostRangeApiPath(aPath) {
		return "m-router-data/v1/" + aPath;
	}
	
	requestPostRange(aPath) {
		
		var path = this.getPostRangeApiPath(aPath)
		
		var currentState = this._store.getState();
		var apiBaseUrl = currentState.settings.wpApiUrlBase;
		var dataUrl = apiBaseUrl + path;
		
		this._performRequest(path, dataUrl);
	}
	
	getMenuApiPath(aPath) {
		return "m-router-data/v1/menu/" + aPath;
	}
	
	requestMenuData(aPath) {
		let path = this.getMenuApiPath(aPath);
		
		let currentState = this._store.getState();
		let apiBaseUrl = currentState.settings.wpApiUrlBase;
		let dataUrl = apiBaseUrl + path;
		
		this._performRequest(path, dataUrl);
	}
	
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
	
	dynamicReduce(aState, aAction) {
		
		let newState = aState;
		
		let currentArray = this._dynamicReducers;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentReducer = currentArray[i];
			newState = currentReducer(aState, aAction);
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
	
		if(!newState["currentPage"]) newState["currentPage"] = null;
		if(!newState["data"]) newState["data"] = new Object();
		if(!newState["idLinks"]) newState["idLinks"] = new Object();
		if(!newState["postData"]) newState["postData"] = new Object();
		if(!newState["postRanges"]) newState["postRanges"] = new Object();
		if(!newState["customizerData"]) newState["customizerData"] = new Object();
		if(!newState["apiData"]) newState["apiData"] = new Object();
		if(!newState["dataAdjustments"]) newState["dataAdjustments"] = new Object();
		if(!newState["menus"]) newState["menus"] = new Object();

		switch (action.type) {
			case StoreController.SET_CURRENT_PAGE:
				newState["currentPage"] = action.url;
				return newState;
			case StoreController.REQUEST_URL:
				if(!newState.data[action.url]) {
					newState.data[action.url] = {"status": 2};
				}
				return newState;

			case StoreController.RECEIVE_URL:
				if(action.data) {
					newState.data[action.url] = {status: 1, data: action.data};
					//METODO: add id link
				}
				else {
					newState.data[action.url] = {status: -1};
				}
				return newState;
			case StoreController.ENSURE_LOAD_DATA_EXISTS:
				//console.log("case StoreController.ENSURE_LOAD_DATA_EXISTS");
				//console.log(action.path);
				if(!newState.apiData[action.path]) {
					newState.apiData[action.path] = {"status": 0};
				}
				return newState;
			case StoreController.START_LOADING:
				if(newState.apiData[action.path] && newState.apiData[action.path]["status"] === 0) {
					newState.apiData[action.path]["status"] = 2;
				}
				return newState;
			case StoreController.LOADED:
				//console.log(action.path, newState.apiData[action.path]);
				newState.apiData[action.path]["status"] = 1;
				newState.apiData[action.path]["data"] = action.data;
				return newState;
			case StoreController.ERROR_LOADING:
				//console.log(action.path, newState.apiData[action.path]);
				newState.apiData[action.path]["status"] = -1;
				newState.apiData[action.path]["error"] = action.data;
				return newState;
				
			case StoreController.REQUEST_API_DATA:
				if(!newState.apiData[action.path]) {
					newState.apiData[action.path] = {"status": 2};
				}
				return newState;

			case StoreController.RECEIVE_API_DATA:
				if(action.data) {
					newState.apiData[action.path] = {status: 1, data: action.data};
					//METODO: add id link
				}
				else {
					newState.apiData[action.path] = {status: -1};
				}
				return newState;
			case StoreController.REQUEST_POST_BY_ID:
				if(!newState.idLinks[action.id]) {
					newState.idLinks[action.id] = {"status": 2};
				}
				return newState;

			case StoreController.RECEIVE_POST_BY_ID:
				if(action.data) {
				
					newState.idLinks[action.id] = {status: 1, url: action.data.url};
					newState.postData[action.data.url] = {status: 1, data: action.data.data};
				}
				else {
					newState.idLinks[action.id] = {status: -1};
				}
				return newState;
			case StoreController.REQUEST_CUSTOMIZER_DATA:
				if(!newState.customizerData[action.options]) {
					newState.customizerData[action.options] = {"status": 2};
				}
				return newState;

			case StoreController.RECEIVE_CUSTOMIZER_DATA:
				if(action.data) {
					newState.customizerData[action.options] = {status: 1, data: action.data};
				}
				else {
					newState.customizerData[action.options] = {status: -1};
				}
				return newState;
			case StoreController.REQUEST_POST_RANGE:
				if(!newState.postRanges[action.path]) {
					newState.postRanges[action.path] = {"status": 2};
				}
				return newState;

			case StoreController.RECEIVE_POST_RANGE:
				if(action.data) {
					newState.postRanges[action.path] = {status: 1, data: action.data};
				}
				else {
					newState.postRanges[action.path] = {status: -1};
				}
				return newState;
			case StoreController.DATA_ADJUSTMENT:
				if(!newState.dataAdjustments[action.path]) {
					newState.dataAdjustments[action.path] = new Array();
				}
				var newArray = [].concat(newState.dataAdjustments[action.path]);
				newArray.push(action.data);
				
				newState.dataAdjustments[action.path] = newArray;
				
				return newState;
			default:
				return newState;
		}
	}
	
	reduceSettings(state, action) {

		var newState = new Object();
		for(var objectName in state) {
			newState[objectName] = state[objectName];
		}

		switch (action.type) {
		case 'setSetting': // MENOTE: move this to const
			newState.data[action.name] = action.value;
			return newState;
		default:
			return newState;
		}
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