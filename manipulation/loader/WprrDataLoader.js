import React from "react";
import objectPath from "object-path";
import queryString from "query-string";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";
import LoadingGroup from "wprr/utils/loading/LoadingGroup";
import SetStateValueCommand from "wprr/commands/basic/SetStateValueCommand";
import SourceData from "wprr/reference/SourceData";
import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

//import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
export default class WprrDataLoader extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		this.state["status"] = 0;
		
		this._loadingGroup = new LoadingGroup();
		this._loadingGroup.addStatusCommand(SetStateValueCommand.create(this, "status", SourceData.create("event", "raw")));
		this._loadingGroup.addStatusCommand(CallFunctionCommand.create(this, this._runStatusCommands, [SourceData.create("event", "raw")]));
		
		this._propsThatShouldNotCopy.push("loadData");
		this._propsThatShouldNotCopy.push("loadingElement");
		this._propsThatShouldNotCopy.push("loadingComponent");
		this._propsThatShouldNotCopy.push("errorComponent");
		this._propsThatShouldNotCopy.push("errorElement");
		this._propsThatShouldNotCopy.push("nonBlocking");
		this._propsThatShouldNotCopy.push("exposeStatus");
		this._propsThatShouldNotCopy.push("loadedCommands");
		this._propsThatShouldNotCopy.push("apiFormat");
		this._propsThatShouldNotCopy.push("skipLanguageParameter");
		
	}
	
	_runStatusCommands(aStatus) {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_runStatusCommands");
		//console.log(aStatus);
		
		if(aStatus === 1) {
			let commands = this.getSourcedProp("loadedCommands");
			
			if(commands) {
				let commandData = new Object();
				
				this._getLoadedData(commandData);
				
				CommandPerformer.perform(commands, commandData, this);
			}
		}
	}
	
	_formatData(aData, aFormat) {
		let data = null;
		switch(aFormat) {
			case "wprr":
				data = objectPath.get(aData, "data");
				break;
			case "wprrById":
				data = objectPath.get(aData, "data.data");
				break;
			default:
				console.warn("No format named " + aFormat + ". Using raw.");
			case "raw":
				data = aData;
				break;
		}
		
		return data;
	}
	
	_getLoadedData(aReturnObject) {
		let loadData = this.getSourcedProp("loadData");
		let storeController = this.getReference("redux/store/wprrController");
		
		//METODO: check taht we have load data and storeController
		
		let skipLanguageParameter = this.getSourcedPropWithDefault("skipLanguageParameter", false);
		let language = objectPath.get(this.getReferenceIfExists("wprr/pageData"), "queryData.language");
		let hasLanguageParameterRegExp = new RegExp("[\\?&]language=");
		
		let locationBase = this.getSourcedPropWithDefault("location", "default");
		let defaultApiFormat = this.getSourcedPropWithDefault("apiFormat", WprrDataLoader.DEFAULT_API_FORMAT);
		
		for(let objectName in loadData) {
			let currentData = this.resolveSourcedData(loadData[objectName]);
			let currentPath = null;
			let currentApiFormat = defaultApiFormat;
			
			if(typeof(currentData) === "string") {
				currentPath = storeController.getAbsolutePath("M-ROUTER-API-DATA", currentData, locationBase);
			}
			else {
				let currentLocationBase = currentData.location ? currentData.location : locationBase;
				if(currentData.apiFormat) {
					currentApiFormat = currentData.apiFormat;
				}
				else if(currentData.type === "M-ROUTER-POST-BY-ID") {
					currentApiFormat = "wprrById";
				}
				currentPath = storeController.getAbsolutePath(currentData.type, currentData.path, currentLocationBase);
			}
			
			if(!skipLanguageParameter && language && !hasLanguageParameterRegExp.test(currentPath)) {
				let separator = (currentPath.indexOf("?") === -1) ? "?" : "&";
				currentPath += separator + "language=" + language;
			}
			
			aReturnObject[objectName] = this._formatData(this._loadingGroup.getData(currentPath), currentApiFormat);
		}
	}
	
	_getMainElementProps() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_getMainElementProps");
		let returnObject = super._getMainElementProps();
		
		this._getLoadedData(returnObject);
		
		let nonBlocking = this.getSourcedPropWithDefault("nonBlocking", false);
		let exposeStatus = this.getSourcedPropWithDefault("exposeStatus", false);
		if(nonBlocking || exposeStatus) {
			returnObject["status"] = this.state["status"];
		}
		
		return returnObject;
	}

	componentDidMount() {
		//console.log("wprr/manipulation/loader/WprrDataLoader.componentDidMount");
		this.updateLoad();
	}
	
	componentDidUpdate() {
		//console.log("wprr/manipulation/loader/WprrDataLoader.componentDidUpdate");
		this.updateLoad();
	}
	
	componenetWillUnmount() {
		//METODO: remove the loading group
	}
	
	_setupLoading() {
		let storeController = this.getReference("redux/store/wprrController");
		if(!storeController) {
			console.error("Store controller doesn't exist, can't request data.", this);
			return;
		}
		
		let loadData = this.getSourcedProp("loadData");
		
		if(!loadData) {
			console.error("Loader doesn't have any load data.", this);
			this.setState({"status": -1});
			return;
		}
		
		let locationBase = this.getSourcedPropWithDefault("location", "default");
		
		this._loadingGroup.setStoreController(storeController);
		this._loadingGroup.removeAllLoaders();
		
		let skipLanguageParameter = this.getSourcedPropWithDefault("skipLanguageParameter", false);
		let language = objectPath.get(this.getReferenceIfExists("wprr/pageData"), "queryData.language");
		let hasLanguageParameterRegExp = new RegExp("[\\?&]language=");
		
		for(let objectName in loadData) {
			let currentData = this.resolveSourcedData(loadData[objectName]);
			let currentLocationBase = locationBase;
			let currentType = "M-ROUTER-API-DATA";
			let currentPath;
			
			if(typeof(currentData) === "string") {
				currentPath = currentData;
			}
			else {
				if(currentData.location) {
					currentLocationBase = currentData.location;
				}
				currentType = currentData.type;
				currentPath = currentData.path;
			}
			
			let absolutePath = storeController.getAbsolutePath(currentType, currentPath, currentLocationBase);
			
			if(!skipLanguageParameter && language && !hasLanguageParameterRegExp.test(absolutePath)) {
				let separator = (absolutePath.indexOf("?") === -1) ? "?" : "&";
				absolutePath += separator + "language=" + language;
			}
			
			this._loadingGroup.addLoaderByPath(absolutePath);
		}
	}
	
	updateLoad() {
		this._setupLoading();
		this._loadingGroup.updateStatus();
		this._loadingGroup.load();
	}
	
	_prepareInitialRender() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_prepareInitialRender");
		this.updateLoad();
	}
	
	_prepareRender() {
		//console.log("wprr/manipulation/loader/WprrDataLoader::_prepareRender");
		super._prepareRender();
		this._setupLoading();
	}
	
	_renderMainElement() {
		
		let status = this._loadingGroup.getStatus();
		
		if(status === 1 || status === 3 || status === 4 || this.getSourcedPropWithDefault("nonBlocking", false)) {
			this._createClonedElement();
			return this._clonedElement;
		}
		else if(status === 0 || status === 2) {
			let loadingComponent = this.getSourcedProp("loadingComponent");
			if(loadingComponent) {
				return React.createElement(loadingComponent, this._getMainElementProps(), this.props.children);
			}
			let loadingElement = this.getSourcedProp("loadingElement");
			if(loadingElement) {
				return loadingElement;
			}
			//console.warn("Loading component not set", this);
			return null;
		}
		
		let errorComponent = this.getSourcedProp("errorComponent");
		if(errorComponent) {
			return React.createElement(errorComponent, this._getMainElementProps(), this.props.children);
		}
		console.warn("Error component not set", this);
		return null;
	}
}

WprrDataLoader.DEFAULT_API_FORMAT = "wprr";
