import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import objectPath from "object-path";

//import PageDataSources from "wprr/elements/layout/PageDataSources";
export default class PageDataSources extends Layout {

	_construct() {
		
		super._construct();
		
		this._layoutName = "pageDataSources";
		
		this._externalData = new Wprr.utils.DataStorage();
		this._externalData.updateValue("loaded", false);
		this._externalData.updateValue("injectData", {});
		
		this._loadingGroup = new Wprr.utils.loading.LoadingGroup();
		this._loadingGroup.addStatusCommand(Wprr.commands.callFunction(this, this._statusChanged, [Wprr.sourceEvent()]));
		
		let project = this.getReference("wprr/project");
		
		
		
		let meLoaded = this._elementTreeItem.addNode("me/skippedOrLoaded", new Wprr.utils.data.nodes.logic.Any()).addValues(
			this._elementTreeItem.getValueSource("me/skipped"),
			this._elementTreeItem.getValueSource("me/loaded"),
		);
		
		let sourcesLoaded = this._elementTreeItem.addNode("sources/skippedOrLoaded", new Wprr.utils.data.nodes.logic.Any()).addValues(
			this._elementTreeItem.getValueSource("sources/skipped"),
			this._elementTreeItem.getValueSource("sources/loaded"),
		);
		
		let allLoaded = this._elementTreeItem.addNode("all/done", new Wprr.utils.data.nodes.logic.All()).addValues(
			meLoaded.sources.get("output"),
			sourcesLoaded.sources.get("output"),
		);
		
		this._elementTreeItem.getValueSource("loaded").input(allLoaded.sources.get("output"));
		
		let terms = this.getFirstInput(Wprr.sourceReference("wprr/pageItem", "post.linkedItem.terms.ids"));
		if(terms && terms.indexOf("dbm_relation:restrict-access/require-signed-in") !== -1) {
			let project = Wprr.objectPath(this._elementTreeItem.group, "project.controller");
			let checkedLogin = Wprr.objectPath(project, "item.session.linkedItem.checkedLoginStatus.value");
		
			if(!checkedLogin) {
				let loader = project.getSharedLoader(this.getWprrUrl("me/", "wprrData"));
			
				if(loader.getStatus() === 1) {
					let data = loader.getData();
					this._setUserData(data["data"]);
					this._checkRestrictedAccess();
				}
				else {
					loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setUserData, [Wprr.sourceEvent("data")]));
					loader.addSuccessCommand(Wprr.commands.callFunction(this, this._checkRestrictedAccess, [Wprr.sourceEvent("data")]));
					loader.load();
				}
			}
			else {
				this._checkRestrictedAccess();
			}
		}
		else if(this.getFirstInput("loadUser")) {
			let project = Wprr.objectPath(this._elementTreeItem.group, "project.controller");
			let checkedLogin = Wprr.objectPath(project, "item.session.linkedItem.checkedLoginStatus.value");
		
			if(checkedLogin) {
				this._elementTreeItem.setValue("me/loaded", true);
			}
			else {
				let loader = project.getSharedLoader(this.getWprrUrl("me/", "wprrData"));
			
				if(loader.getStatus() === 1) {
					let data = loader.getData();
					this._setUserData(data["data"]);
					this._elementTreeItem.setValue("me/loaded", true);
				}
				else {
					loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setUserData, [Wprr.sourceEvent("data")]));
					loader.addSuccessCommand(Wprr.commands.setValue(this._elementTreeItem.getValueSource("me/loaded").reSource(), "value", true));
					loader.load();
				}
			}
		}
		else {
			this._elementTreeItem.setValue("me/skipped", true);
		}
		
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
			this._elementTreeItem.setValue("sources/skipped", true);
		}
	}
	
	_setUserData(aData) {
		let project = Wprr.objectPath(this._elementTreeItem.group, "project.controller");

		if(aData) {
			project.setUser(aData["user"], aData["restNonce"]);
		}
		else {
			project.setUserData(null);
		}
	}
	
	_checkRestrictedAccess() {
		//console.log("_checkRestrictedAccess");
		
		let project = Wprr.objectPath(this._elementTreeItem.group, "project.controller");
		let terms = this.getFirstInput(Wprr.sourceReference("wprr/pageItem", "post.linkedItem.terms.ids"));
		
		let isOk = true;
		
		let user = Wprr.objectPath(project, "item.session.linkedItem.user.linkedItem");
		
		if(user) {
			
			let roles = user.getValue("roles");
			
			if(roles.indexOf("administrator") === -1) {
				let hasRoleRequirement = false;
				let hasRole = false;
			
				let currentArray = terms;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentTerm = currentArray[i];
				
					if(currentTerm.indexOf("dbm_relation:require-role/") === 0) {
						hasRoleRequirement = true;
					
						let currentRole = currentTerm.substring("dbm_relation:require-role/".length, currentTerm.length);
						if(roles.indexOf(currentRole) !== -1) {
							hasRole = true;
						}
						else {
							//console.log("Missing role " + currentRole);
						}
					}
				}
			
				if(hasRoleRequirement && !hasRole) {
					isOk = false;
				
					let url = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/sign-in/no-access/"));
					wprr.navigate(url);
				}
			}
		}
		else {
			isOk = false;
			
			let url = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/sign-in/"));
			url = Wprr.utils.url.addQueryString(url, "redirect_to", encodeURIComponent(document.location.href));
			wprr.navigate(url);
		}
		
		if(isOk) {
			this._elementTreeItem.setValue("me/loaded", true);
		}
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
			
			let items = this.getFirstInput(Wprr.sourceReference("wprr/project", "items"));
			
			let loadData = this._getLoadData();
			
			let currentArray = loadData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentLoadData = currentArray[i];
				let currentData = this._loadingGroup.getData(currentLoadData["value"]);
				
				switch(currentLoadData["format"]) {
					case "itemRange":
						{
							let item = items.getItem(currentLoadData["value"]);
							
							currentData = Wprr.objectPath(item, "range.items");
						}
						break;
					case "item":
						{
							let item = items.getItem(currentLoadData["value"]);
							
							currentData = Wprr.objectPath(item, "range.items.0");
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
			this._elementTreeItem.setValue("sources/loaded", true);
		}
	}
	
	_getLoadData() {
		//console.log("PageDataSoruces::_getLoadData");
		
		let items = this.getFirstInput(Wprr.sourceReference("wprr/project", "items"));
		
		let itemSources = this.getFirstInput(Wprr.sourceReference("wprr/pageItem", "post.linkedItem.dataSources.items"));
		
		let returnArray = new Array();
		
		if(itemSources) {
			let currentArray = itemSources;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				
				let objectTypes = currentItem.getLinks("objectTypes").ids;
				
				let dataName = currentItem.getValue("dataName");
				let currentData = currentItem.getValue("data");
				
				if(objectTypes.indexOf("dbm_type:settings/data-source/loaded-data-source") !== -1) {
					let currentLoadData = currentData;
					let path = currentLoadData.value;
					let replacements = this._getReplacements(currentLoadData.replacements);
					let requestOrigin = currentLoadData.origin ? currentLoadData.origin : "rest";
					let finalPath = this.getWprrUrl(this._replaceText(path, replacements), requestOrigin);
					let format = currentLoadData.format;
				
					let item = items.getItem(finalPath);
					if(format === "itemRange" || format === "item") {
						items.prepareItem(item, "dataRangeLoader");
					}
				
					returnArray.push({"key": dataName, "value": finalPath, "format": format});
				
				}
				if(objectTypes.indexOf("dbm_type:settings/data-source/static-data-source") !== -1) {
					this._externalData.updateValue("injectData." + dataName, Wprr.sourceFromExplicitJson(currentData));
				}
			}
		}
		else {
			let dataSources = this.getFirstInput("dataSources", Wprr.sourceReference("wprr/postData", "addOns.dataSources"));
			
			if(dataSources) {
				let currentArray = dataSources;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentDataSource = currentArray[i];
				
					let sourceType = currentDataSource["sourceType"];
					let dataName = currentDataSource["dataName"];
					let currentData = currentDataSource["data"];
				
					if(sourceType === "loaded-data-source") {
						let currentLoadData = currentData;
						let path = currentLoadData.value;
						let replacements = this._getReplacements(currentLoadData.replacements);
						let requestOrigin = currentLoadData.origin ? currentLoadData.origin : "rest";
						let finalPath = this.getWprrUrl(this._replaceText(path, replacements), requestOrigin);
						let format = currentLoadData.format;
					
						let item = items.getItem(finalPath);
						if(format === "itemRange" || format === "item") {
							items.prepareItem(item, "dataRangeLoader");
						}
					
						returnArray.push({"key": dataName, "value": finalPath, "format": format});
					
					}
					if(sourceType === "static-data-source") {
						this._externalData.updateValue("injectData." + dataName, Wprr.sourceFromExplicitJson(currentData));
					}
				}
			}
		}
		
		return returnArray;
	}
	
	_getLayout(aSlots) {
		//console.log("PageDataSources::_getLayout");
		
		//METODO: add separate layout for the loader
		
		return React.createElement(Wprr.AddReference, {"data": this._externalData, "as": "loadingData"},
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("loaded")},
				React.createElement(Wprr.ReferenceInjection, {"injectData": Wprr.sourceReference("loadingData", "injectData"), "canBeEmpty": true},
					aSlots.default(React.createElement("div", {}, "No block element"))
				)
			),
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("loaded"), "checkType": "invert/default"},
				aSlots.slot("loader", React.createElement(Wprr.layout.loader.LoaderDisplay, null))
			)
		);
	}
}