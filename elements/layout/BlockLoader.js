import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import objectPath from "object-path";

//import BlockLoader from "wprr/elements/layout/BlockLoader";
export default class BlockLoader extends Layout {

	constructor() {
		
		super();
		
		this._layoutName = "blockLoader";
		
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
		//console.log("BlockLoader::_statusChanged");
		//console.log(aStatus);
		
		if(aStatus === 1) {
			
			let loadData = this._getLoadData();
			
			let currentArray = loadData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentLoadData = currentArray[i];
				let currentData = this._loadingGroup.getData(currentLoadData["value"]);
				
				switch(currentLoadData["format"]) {
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
		let loadData = this.getFirstInput("loadData", Wprr.sourceReference("blockData", "blockLoadData"));
		
		let returnArray = new Array();
		
		if(loadData) {
			for(let objectName in loadData) {
				let currentLoadData = loadData[objectName];
				if(currentLoadData && currentLoadData.value) {
					let path = currentLoadData.value;
					let replacements = this._getReplacements(currentLoadData.replacements);
					let finalPath = this.getWprrUrl(this._replaceText(path, replacements));
					
					returnArray.push({"key": objectName, "value": finalPath, "format": currentLoadData.format})
				}
			}
		}
		
		return returnArray;
	}
	
	_prepareInitialRender() {
		//console.log("BlockLoader::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let project = this.getReference("wprr/project");
		
		let loadData = this._getLoadData();
		
		if(loadData.length > 0) {
			let currentArray = loadData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let loader = project.getSharedLoader(currentArray[i]["value"]);
				this._loadingGroup.addLoader(loader);
			}
			
			this._loadingGroup.load();
		}
		else {
			this._externalData.updateValue("loaded", true);
		}
	}
	
	_getLayout(aSlots) {
		//console.log("BlockLoader::_getLayout");
		
		//METODO: add separate layout for the loader
		
		return React.createElement(Wprr.AddReference, {"data": this._externalData, "as": "loadingData"},
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("loadingData", "loaded")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": Wprr.sourceReference("loadingData", "injectData"), "canBeEmpty": true},
					aSlots.default(React.createElement("div", {}, "No block element test"))
				)
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("loadingData", "loaded"), "checkType": "invert/default"},
				aSlots.slot("loader", React.createElement(Wprr.layout.loader.LoaderDisplay, {}))
			)
		);
	}
}