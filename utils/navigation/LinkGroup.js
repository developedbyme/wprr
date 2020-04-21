import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

import objectPath from "object-path";

// import LinkGroup from "wprr/utils/navigation/LinkGroup";
export default class LinkGroup {
	
	constructor() {
		this._inputs = new Object();
		this._links = new Object();
		this._postsMap = new Object();
	}
	
	/**
	 * Sets an input of this function, and skipping null values.
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	BaseCommand	self
	 */
	setInputWithoutNull(aName, aValue) {
		if(aValue !== null && aValue !== undefined) {
			this.setInput(aName, aValue);
		}
		
		return this;
	}
	
	/**
	 * Sets an input of this function
	 *
	 * @param	aName	String			The name of the input.
	 * @param	aValue	SourceData|*	The value of the input
	 *
	 * @return	BaseCommand	self
	 */
	setInput(aName, aValue) {
		console.log("setInput");
		console.log(aName, aValue);
		
		this._inputs[aName] = aValue;
		
		return this;
	}
	
	/**
	 * Gets the input without resolving sources
	 *
	 * @param	aName	String	The name of the input.
	 *
	 * @return	*	The raw value of the input
	 */
	getRawInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		return this._inputs[aName];
	}
	
	/**
	 * Gets an input for this function.
	 *
	 * @param	aName				String			The name of the input.
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The value of the input
	 */
	getInput(aName) {
		if(this._inputs[aName] === undefined) {
			console.warn("Input " + aName + " doesn't exist.", this);
			return null;
		}
		
		return this.resolveSource(this._inputs[aName]);
	}
	
	/**
	 * Resolves a source
	 * 
	 * @param	aData				*				The data to resolve
	 * @param	aProps				Object			The object with the current props.
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 */
	resolveSource(aData) {
		//console.log("wprr/commands/BaseCommand::resolveSource");
		
		if(aData instanceof SourceData) {
			
			let props = this._triggerElement ? this._triggerElement.props : {};
			let state = this._triggerElement ? this._triggerElement.state : {};
			
			let changePropsAndStateObject = {"props": props, "state": state, "event": this._eventData};
			
			return aData.getSourceInStateChange(this._triggerElement, changePropsAndStateObject);
		}
		
		return aData;
	}
	
	addLinks(aLinks, aParent = "") {
		console.log("LinkGroup::setLinks");
		console.log(aLinks);
		
		let currentArray = aLinks;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let fullPath = aParent + currentItem["fieldId"];
			this._links[fullPath] = currentItem;
			this.addLinks(currentItem.childPaths, fullPath + "/");
		}
		
		return this;
	}
	
	addPostsMap(aPostsMap) {
		for(let objectName in aPostsMap) {
			this._postsMap[objectName] = aPostsMap[objectName];
		}
		
		return this;
	}
	
	setLinks(aLinksData) {
		console.log("LinkGroup::setLinks");
		console.log(aLinksData);
		
		let currentArray = aLinksData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			this.addLinks(currentData.links);
			this.addPostsMap(currentData.postsMap);
		}
		
		console.log(this._links);
		
		return this;
	}
	
	resolvePart(aPart, aFromPath) {
		console.log("resolvePart");
		console.log(aPart);
		let type = aPart.type;
		switch(type) {
			case "internal":
				return null; //METODO
			case "postUrl":
				return objectPath.get(this._postsMap, "post" + aPart.value + ".permalink");
			case "variable":
				return this.getInput(aPart.value);
		}
		
		return aPart.value;
	}
	
	resolveLink(aLink, aFromPath) {
		let urlParts = aLink.urlParts;
		let parameters = aLink.parameters;
		
		let urlString = aLink.value;
		let parametersString = null;
		
		let questionMarkPosition = urlString.indexOf("?");
		if(questionMarkPosition !== -1) {
			parametersString = urlString.substring(questionMarkPosition+1, urlString.length);
			urlString = urlString.substring(0, questionMarkPosition);
		}
		
		{
			let currentArray = urlParts;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentPart = currentArray[i];
				let keyword = currentPart["fieldId"];
				let value = this.resolvePart(currentPart, aFromPath);
				urlString = urlString.split("{" + keyword + "}").join(value);
			}
		}
		
		if(parametersString) {
			let currentArray = parameters;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentPart = currentArray[i];
				let keyword = currentPart["fieldId"];
				let value = this.resolvePart(currentPart, aFromPath);
				parametersString = parametersString.split("{" + keyword + "}").join(keyword + "=" + value);
			}
			urlString += "?" + parametersString;
		}
		
		return urlString;
	}
	
	getLink(aPath) {
		console.log("LinkGroup::getLink");
		console.log(aPath, this);
		
		let currentLink = this._links[aPath];
		if(!currentLink) {
			console.error("No link for path " + aPath);
			return null;
		}
		
		let link = this.resolveLink(currentLink, aPath);
		console.log(link);
		
		return link;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		switch(aPath) {
			case "getLink":
				return this.getLink;
		}
		
		return this.getLink(aPath);
	}
}