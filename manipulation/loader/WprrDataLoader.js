import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

/*import {requestOaSiteDataMenu} from "oa/sitedata/store/actioncreators/oaSiteDataActionCreators";*/

//import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
export default class WprrDataLoader extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		this.state["status"] = 0;
		this.state["loadData"] = {};
		
		this._callback_reduxChangeBound = this._callback_reduxChange.bind(this);
		this._redux_unsubscribeFunction = null;
		
		this._propsThatShouldNotCopy.push("loadData");
	}
	
	/*
	_getMainElementClassNames() {
		var returnArray = super._getMainElementClassNames();
		
		if(this.state.status === 1) {
			returnArray.push("oa-loaded");
		}
		else if(this.state.status === 0 || this.state.status === 2) {
			returnArray.push("oa-loading");
		}
		else{
			returnArray.push("oa-loading-error");
		}
		
		return returnArray;
	}
	*/
	
	_getMainElementProps() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_getMainElementProps");
		var returnObject = super._getMainElementProps();
		
		for(var objectName in this.state["loadData"]) {
			
			var loadingData = this.state["loadData"][objectName];
			
			if(loadingData["status"] === 1) {
				returnObject[objectName] = loadingData["data"];
			}
			else {
				returnObject[objectName] = this.state["status"];
			}
		}
		
		if(this.props.nonBlocking) {
			returnObject["status"] = null;
		}
		
		return returnObject;
	}
	
	_callback_reduxChange() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_callback_reduxChange");
		
		var hasChange = false;
		var newStatus = 1;
		var currentState = this.state["loadData"];
		var newLoadDataState = new Object();
		
		for(var objectName in this.props.loadData) {
			
			var currentData = this.props.loadData[objectName];
			
			var loadingObject;
			if(typeof(currentData) === "string") {
				loadingObject = this._getData("M-ROUTER-API-DATA", currentData);
			}
			else {
				loadingObject = this._getData(currentData.type, currentData.path);
			}
			
			if(!currentState[objectName] || loadingObject["status"] !== currentState[objectName]["status"]) {
				hasChange = true;
			}
			
			newLoadDataState[objectName] = {"status": loadingObject["status"], "data": loadingObject["data"]};
			
			if(loadingObject["status"] !== 1) {
				newStatus = loadingObject["status"];
			}
		}
		
		if(hasChange) {
			this.setState({"status": newStatus, "loadData": newLoadDataState});
		}
	}
	
	_redux_subscribe() {
		if(this.getReferences()) {
			var store = this.getReferences().getObject("redux/store");
			if(store) {
				this._redux_unsubscribeFunction = store.subscribe(this._callback_reduxChangeBound);
			}
			else {
				console.error("Store found in references. Can't subscribe.", this);
			}
		}
		else {
			console.error("References not set. Can't subscribe.", this);
		}
	}
	
	_redux_unsubscribe() {
		//console.log("_redux_unsubscribe");
		
		if(this._redux_unsubscribeFunction) {
			this._redux_unsubscribeFunction();
			this._redux_unsubscribeFunction = null;
		}
	}
	
	_redux_dispatch(aDispatchData) {
		if(this.getReferences()) {
			var store = this.getReferences().getObject("redux/store");
			if(store) {
				store.dispatch(aDispatchData);
			}
			else {
				console.error("Store found in references. Can't dispatch.", this);
			}
		}
		else {
			console.error("References not set. Can't dispatch.", this);
		}
	};
	
	_requestData(aType, aPath) {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_requestData");
		//console.log(aType, aPath);
		//console.log(this);
		
		switch(aType) {
			case "M-ROUTER-POST-RANGE":
				var mRouterController = this.getReference("redux/store/mRouterController");
				if(mRouterController) {
					mRouterController.requestPostRange(aPath);
				}
				else {
					console.error("mRouterController doesn't exist, can't request data " + aPath, this);
				}
				break;
			case "M-ROUTER-POST-BY-ID":
				var mRouterController = this.getReference("redux/store/mRouterController");
				if(mRouterController) {
					mRouterController.requestPostById(aPath);
				}
				else {
					console.error("mRouterController doesn't exist, can't request data " + aPath, this);
				}
				break;
			case "M-ROUTER-MENU":
				this._redux_dispatch(requestOaSiteDataMenu(aPath));
				break;
			case "M-ROUTER-API-DATA":
				var mRouterController = this.getReference("redux/store/mRouterController");
				if(mRouterController) {
					mRouterController.requestApiData(aPath);
				}
				else {
					console.error("mRouterController doesn't exist, can't request data " + aPath, this);
				}
				break;
			case "M-ROUTER-URL":
				var mRouterController = this.getReference("redux/store/mRouterController");
				if(mRouterController) {
					var dataUrl = aPath;

					dataUrl += ((dataUrl.indexOf("?") === -1) ? "?" : "&");
					dataUrl += "mRouterData=json";
					
					mRouterController.requestUrlData(aPath, dataUrl);
				}
				else {
					console.error("mRouterController doesn't exist, can't request data " + aPath, this);
				}
				break;
			default:
				console.warn("Unknown type " + aType);
				break;
		}
	}
	
	_getData(aType, aPath) {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_getData");
		//console.log(aType, aPath);
		
		var store = null;
		if(this.getReferences()) {
			store = this.getReferences().getObject("redux/store");
			if(store) {
				//MENOTE: do nothing
			}
			else {
				console.error("Store found in references. Can't dispatch.", this);
			}
		}
		else {
			console.error("References not set. Can't dispatch.", this);
		}
		
		if(!store) {
			console.warn("No store. Can't get data " + aType + " " + aPath);
			return {"status": 0, "data": null};
		}
		
		var currentState = store.getState();
		
		switch(aType) {
			case "M-ROUTER-POST-RANGE":
				var apiPath = this.getReference("redux/store/mRouterController").getPostRangeApiPath(aPath);
				return currentState.mRouter.apiData[apiPath];
			case "M-ROUTER-POST-BY-ID":
				var apiPath = this.getReference("redux/store/mRouterController").getPostByIdApiPath(aPath);
				var loadData = currentState.mRouter.apiData[apiPath];
				var data = loadData.data ? loadData.data.data : null;
				return {"status": loadData.status, "data": data};
			case "M-ROUTER-MENU":
				return currentState.oaSiteData.menus[aPath];
			case "M-ROUTER-API-DATA":
			case "M-ROUTER-URL":
				//console.log(aPath, currentState.mRouter.apiData[aPath]);
				return currentState.mRouter.apiData[aPath];
			default:
				console.warn("Unknown type " + aType, this);
				console.log(currentState);
				break;
		}
		
		return {"status": 0, "data": null};
	}
	
	componentWillMount() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::componentWillMount");
		
		if(!this.props.loadData) {
			console.error("Loader doesn't have any load data.", this);
			this.setState({"status": -1});
			return;
		}
		
		var loadData = this.props.loadData;
		
		/* METODO: this needs to do a double split
		if(typeof(loadData) === "string") {
			loadData = loadData.split(";");
		}
		*/
		
		for(var objectName in loadData) {
			var currentData = loadData[objectName];
			
			if(typeof(currentData) === "string") {
				this._requestData("M-ROUTER-API-DATA", currentData);
			}
			else {
				this._requestData(currentData.type, currentData.path);
			}
			
			
		}
		
		this._callback_reduxChange();
		this._redux_subscribe();
	}

	componentDidMount() {
		//console.log("wprr/manipulation/loader/WprrDataLoader.componentDidMount");
	}

	componentWillUnmount() {
		//console.log("wprr/manipulation/loader/WprrDataLoader.componentWillUnmount");
		
		this._redux_unsubscribe();
	}
	
	_renderMainElement() {
		if(this.state["status"] === 1 || this.props.nonBlocking) {
			this._createClonedElement();
			return this._clonedElement;
		}
		else if(this.state["status"] === 0 || this.state["status"] === 2) {
			if(this.props.loadingComponent) {
				return React.createElement(this.props.loadingComponent, this._getMainElementProps(), this.props.children);
			}
			//console.warn("Loading component not set", this);
			return null;
		}
		
		if(this.props.errorComponent) {
			return React.createElement(this.props.errorComponent, this._getMainElementProps(), this.props.children);
		}
		console.warn("Error component not set", this);
		return null;
	}
	
	_prepareRender() {
		super._prepareRender();
	}
}
