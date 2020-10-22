import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import objectPath from "object-path";

//import PathRouter from "wprr/elements/area/PathRouter";
export default class PathRouter extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new Wprr.utils.DataStorage();
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["path"];
		delete aReturnObject["routes"];
	}
	
	getRoute(aPath, aRoutes) {
		let currentArray = aRoutes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRoute = currentArray[i];
			let regExp = new RegExp(currentRoute["test"]);
			
			let match = aPath.match(regExp);
			if(match) {
				if(currentRoute.children) {
					let childRoute = this.getRoute(aPath, currentRoute.children);
					if(childRoute) {
						childRoute.parents.unshift(currentRoute);
						return childRoute;
					}
				}
				
				return {"value": currentRoute, "parents": []};
			}
		}
		
		return null;
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let path = this.getFirstInput("path");
		let routes = Wprr.utils.array.singleOrArray(this.getFirstInput("routes"));
		
		let currentRoute = this.getRoute(path, routes);
		console.log(">>>", path, currentRoute, routes)
		
		this._externalStorage.updateValue("path", path);
		
		//METODO: move these to be in a change data command
		this._externalStorage.updateValue("type", this.resolveSourcedData(objectPath.get(currentRoute, "value.type")));
		this._externalStorage.updateValue("data", this.resolveSourcedData(objectPath.get(currentRoute, "value.data")));
		this._externalStorage.updateValue("parents", objectPath.get(currentRoute, "parent"));
	}
	
	_renderMainElement() {
		
		let storageName = this.getFirstInputWithDefault("storageName", "pathRouter/externalStorage");
		//let externalStorage = this.getFirstInput("externalStorage");
		
		let props = this.getProps();
		
		return React.createElement(Wprr.ExternalStorageInjection, {"storageName": storageName, "initialExternalStorage": this._externalStorage}, props.children);
	}
}
