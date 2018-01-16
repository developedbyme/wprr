"use strict";

import objectPath from "object-path";

import AcfFunctions from "wprr/wp/AcfFunctions";

// import SourceData from "wprr/reference/SourceData";
export default class SourceData {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/SourceData::constructor");
		
		this._type = null;
		this._path = null;
	}
	
	setup(aType, aPath) {
		
		this._type = aType;
		this._path = aPath;
		
		return this;
	}
	
	getSource(aFromObject) {
		return SourceData.getSource(this._type, this._path, aFromObject, aFromObject);
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		//console.log("wprr/reference/SourceData::getSourceInStateChange");
		return SourceData.getSource(this._type, this._path, aFromObject, aNewPropsAndState);
	}
	
	removeUsedProps(aProps) {
		if(this._type === "prop") {
			let propName = this._path;
			let dotIndex = propName.indexOf(".");
			if(dotIndex !== -1) {
				propName = propName.substring(dotIndex);
			}
			
			delete aProps[propName];
		}
	}
	
	static create(aType, aPath) {
		let newSourceData = new SourceData();
		
		newSourceData.setup(aType, aPath);
		
		return newSourceData;
	}
	
	static getSource(aType, aPath, aFromObject, aPropsAndState) {
		//console.log("wprr/reference/SourceData::getSource");
		
		const references = aFromObject.getReferences();
		
		switch(aType) {
			case "prop":
				let returnData = objectPath.get(aPropsAndState.props, aPath);
				if(returnData instanceof SourceData) {
					returnData = returnData.getSourceInStateChange(aFromObject, aPropsAndState);
				}
				return returnData;
			case "acf":
				return references.getObject("wprr/postData").getAcfData(aPath);
			case "acfRow":
				let rowObject = references.getObject("wprr/postData/acfRow");
				return AcfFunctions.getAcfSubfieldData(rowObject, aPath);
			case "text":
				return references.getObject("wprr/textManager").getText(aPath);
			case "postData":
				let dataObject = references.getObject("wprr/postData");
				switch(aPath) {
					case "title":
						return dataObject.getTitle();
					case "excerpt":
						return dataObject.getExcerpt();
					case "content":
						return dataObject.getContent();
					case "permalink":
						return dataObject.getPermalink();
					case "image":
						return dataObject.getImage();
					default:
						console.error("Unknown postData type " + aPath);
						break;
				}
				break;
			case "reference":
				return references.getObject(aPath);
			default:
				console.error("Unknown type " + aType);
				break;
		}
		
		return null;
	}
	
	static getSourceWithType(aPrefixedPath, aFromObject) {
		if(!aPrefixedPath) {
			console.error("Path is not set");
			console.log(aFromObject);
			
			return null;
		}
		
		let type = "prop";
		let path = aPrefixedPath;
		let colonIndex = path.indexOf(":");
		
		if(colonIndex !== -1) {
			type = path.substring(0, colonIndex);
			path = path.substring(colonIndex+1, path.length);
		}
		
		return SourceData.getSource(type, path, aFromObject, aFromObject);
	}
}