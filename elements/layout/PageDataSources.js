import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import objectPath from "object-path";

//import PageDataSources from "wprr/elements/layout/PageDataSources";
export default class PageDataSources extends Layout {

	constructor() {
		
		super();
		
		this._layoutName = "pageDataSources";
		
		this._externalData = new Wprr.utils.DataStorage();
		this._externalData.updateValue("loaded", false);
		this._externalData.updateValue("injectData", {});
		
		this._loadingGroup = new Wprr.utils.loading.LoadingGroup();
		this._loadingGroup.addStatusCommand(Wprr.commands.callFunction(this, this._statusChanged, [Wprr.sourceEvent()]));
	}
	
	_getReplacements(aData) {
		let returnArray = new Array();
		
		for(let objectName in aData) {
			returnArray.push({"key": objectName, "value": this.resolveSourcedData(Wprr.sourceFromJson(aData[objectName]))});
		}
		
		return returnArray;
	}
	
	_replaceText(aText, aReplacements) {
		
		let text = aText;
		
		let currentArray = aReplacements;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			
			let currentReplacement = currentArray[i];
			let key = currentReplacement["key"];
			let value = currentReplacement["value"];
		
			text = text.split(key).join(value);
		}
		
		return text;
	}
	
	_statusChanged(aStatus) {
		//console.log("PageDataSources::_statusChanged");
		//console.log(aStatus);
		
		if(aStatus === 1) {
			
			let loadData = this._getLoadData();
			
			let currentArray = loadData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentLoadData = currentArray[i];
				let currentData = this._loadingGroup.getData(currentLoadData["value"]);
				
				switch(currentLoadData["format"]) {
					case "itemRange":
						{
							let rawData = currentData["data"];
							//METODO
						}
						break;
					case "item":
						{
							let rawData = currentData["data"];
							//METODO
						}
						break;
					case "raw":
						//MENOTE: do nothing
						break;
					default:
					case "wprr":
						currentData = currentData["data"];
						break;
				}
				
				this._externalData.updateValue("injectData." + currentLoadData["key"], currentData);
			}
			
			this._externalData.updateValue("loaded", true);
		}
	}
	
	_getLoadData() {
		let dataSources = this.getFirstInput("dataSources", Wprr.sourceReference("wprr/postData", "addOns.dataSources"));
		
		console.log(">>>>>>>>", dataSources);
		
		let returnArray = new Array();
		
		if(dataSources) {
			let currentArray = dataSources;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentDataSource = currentArray[i];
				if(currentDataSource["sourceType"] === "loaded-data-source") {
					let currentLoadData = currentDataSource["data"];
					let path = currentLoadData.value;
					let replacements = this._getReplacements(currentLoadData.replacements);
					let requestOrigin = currentLoadData.origin ? currentLoadData.origin : "rest";
					let finalPath = this.getWprrUrl(this._replaceText(path, replacements), requestOrigin);
					
					returnArray.push({"key": currentDataSource["dataName"], "value": finalPath, "format": currentLoadData.format})
				}
				if(currentDataSource["sourceType"] === "static-data-source") {
					this._externalData.updateValue("injectData." + currentDataSource["dataName"], currentDataSource["data"]);
				}
			}
		}
		
		return returnArray;
	}
	
	_prepareInitialRender() {
		//console.log("PageDataSources::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		this._loadingGroup.setStoreController(this.getReference("redux/store/wprrController"));
		
		let loadData = this._getLoadData();
		
		if(loadData.length > 0) {
			let currentArray = loadData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				this._loadingGroup.addLoaderByPath(currentArray[i]["value"]);
			}
			
			console.log(this._loadingGroup);
			
			this._loadingGroup.load();
		}
		else {
			this._externalData.updateValue("loaded", true);
		}
	}
	
	_getLayout(aSlots) {
		//console.log("PageDataSources::_getLayout");
		
		//METODO: add separate layout for the loader
		
		return React.createElement(Wprr.AddReference, {"data": this._externalData, "as": "loadingData"},
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("loadingData", "loaded")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": Wprr.sourceReference("loadingData", "injectData")},
					aSlots.default(React.createElement("div", {}, "No block element"))
				)
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("loadingData", "loaded"), "checkType": "invert/default"},
				aSlots.slot("loader", React.createElement(Wprr.layout.loader.LoaderDisplay, null))
			)
		);
	}
}