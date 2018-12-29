import React from "react";
import objectPath from "object-path";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";
import LoadingGroup from "wprr/utils/loading/LoadingGroup";
import SetStateValueCommand from "wprr/commands/basic/SetStateValueCommand";
import SourceData from "wprr/reference/SourceData";
import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import WpPaginationLoader from "wprr/manipulation/loader/WpPaginationLoader";
export default class WpPaginationLoader extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		//this.state["status"] = 0;
		
		this.state["numberOfPagesToShow"] = 1;
		this.state["loadedPosts"] = [];
		
		this._addedPaginationLoaders = new Array();
		
		this._loadingGroup = new LoadingGroup();
		this._updateCommand = CallFunctionCommand.create(this, this.updateLoadedPosts);
		
		this._propsThatShouldNotCopy.push("noResultsElement");
	}
	
	_getMainElementProps() {
		//console.log("wprr/manipulation/loader/WpPaginationLoader::_getMainElementProps");
		let returnObject = super._getMainElementProps();
		
		let pageData = this.getReference("wprr/pageData");
		let numberOfResults = pageData.queryData.numberOfPosts;
		
		let posts = [].concat(pageData.posts);
		posts = posts.concat(this.state["loadedPosts"]);
		
		returnObject["postsData"] = posts;
		
		return returnObject;
	}
	
	_prepareInitialRender() {
		let storeController = this.getReference("redux/store/wprrController");
		this._loadingGroup.setStoreController(storeController);
	}
	
	updateLoadedPosts() {
		//console.log("wprr/manipulation/loader/WpPaginationLoader::updateLoadedPosts");
		
		let returnArray = new Array();
		
		let currentArray = this._addedPaginationLoaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			
			if(currentLoader.getStatus() === 1) {
				returnArray = returnArray.concat(objectPath.get(currentLoader.getData(), "data.posts"));
			}
		}
		
		this.setState({"loadedPosts": returnArray});
	}
	
	loadMore() {
		
		let pageData = this.getReference("wprr/pageData");
		let linkToAdd = this._getNextPageLink(pageData.queryData, document.location.href);
		
		let currentHref = linkToAdd;
		let anchorIndex = currentHref.indexOf("#");
		if(anchorIndex !== -1) {
			currentHref = currentHref.substring(0, anchorIndex);
		}
		
		if(currentHref.indexOf("?") !== -1) {
			currentHref += "&";
		}
		else {
			currentHref += "?";
		}
		
		currentHref += "mRouterData=json";
		
		let loader = this._loadingGroup.addLoaderByPath(currentHref);
		loader.addSuccessCommand(this._updateCommand);
		this._addedPaginationLoaders.push(loader);
		
		this.setState({"numberOfPagesToShow": this.state["numberOfPagesToShow"]+1});
		this._loadingGroup.load();
	}
	
	_getNextPageLink(aQueryData, aLocation) {
		
		let newUrl = null;
		
		let nextPageIndex = aQueryData.currentPaginationIndex+this.state["numberOfPagesToShow"];
		if(nextPageIndex > aQueryData.numberOfPaginationPages) {
			return newUrl;
		}
		
		let currentUrl = aLocation;
		let pageRegExp = new RegExp("^(.*/page)(/[0-9]+/?)(.*)$");
		
		if(pageRegExp.test(currentUrl)) {
			newUrl = currentUrl.replace(pageRegExp, "$1/" + nextPageIndex + "/$3");
		}
		else {
			let pageAddRegExp = new RegExp("^([^\\?#]*)(.*)$");
			newUrl = currentUrl.replace(pageAddRegExp, "$1page/" + nextPageIndex + "/$2");
		}
		
		return newUrl;
	}
	
	_renderMainElement() {
		
		let pageData = this.getReference("wprr/pageData");
		let numberOfResults = pageData.queryData.numberOfPosts;
		
		let posts = [].concat(pageData.posts);
		posts = posts.concat(this.state["loadedPosts"]);
		
		if(posts.length > 0) {
			
			let nextLink = this._getNextPageLink(pageData.queryData, document.location.href);
			
			let injectData = {
				"wprr/pagination/nextLink": nextLink,
				"wprr/pagination/loadMoreController": this
			};
			
			this._createClonedElement();
			return React.createElement(ReferenceInjection, {"injectData": injectData}, this._clonedElement);
		}
		else {
			let noResultsElement = this.getSourcedProp("noResultsElement");
			if(noResultsElement) {
				return React.createElement(ManipulationBaseObject, this._getMainElementProps(), noResultsElement);
			}
			return null;
		}
	}
}
