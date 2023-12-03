import React from 'react';

import Wprr from "wprr/Wprr";
import WprrBaseObject from "wprr/WprrBaseObject";

import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";

//import Image from "wprr/elements/image/Image";
export default class Image extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._addMainElementClassName("image");
		
		this._urlResolver = new MultipleUrlResolver();
	}
	
	_getClassNameFromSource(aSource, aPrefix = "source") {
		if(!aSource) {
			console.warn("No source set", this);
			return "no-source";
		}
		
		let tempArray = aSource.split(".");
		tempArray.pop();
		let sourcePath = tempArray.join(".");
		
		let specialCharacterRegExp = new RegExp("[^a-zA-Z0-9\-\_]+", "g");
		sourcePath = sourcePath.replace(specialCharacterRegExp, "-");
		
		if(aPrefix) {
			sourcePath = aPrefix + "-" + sourcePath;
		}
		
		return sourcePath;
	}
	
	_getMainElementClassNames() {
		let returnArray = super._getMainElementClassNames();
		
		let imageSource = this.getFirstInput("src");
		let classPrefix = this.getFirstInputWithDefault("classPrefix", "source");
		
		returnArray.push(this._getClassNameFromSource(imageSource, classPrefix));
		
		return returnArray;
	}
	
	_getMainElementProps() {
		//console.log("_getMainElementProps");
		//console.log(this.state["imageStatus"], this.state["renderedImage"]);
		
		let returnObject = super._getMainElementProps();
		let elementType = this._getMainElementType();
		
		let fullPath = null;
		
		let imageSource = this.getFirstInput("src");
		let sourceLocation = this.getFirstInput("location");
		if(!sourceLocation) {
			sourceLocation = this.getFirstInput(Wprr.sourceReference("wprr/defaultImageLocation"));
			if(!sourceLocation) {
				sourceLocation = "theme";
			}
		}
		
		if(imageSource) {
			fullPath = this.getWprrUrl(imageSource, sourceLocation);
		}
		else {
			console.warn("No src set for image.", this);
		}
		
		
		if(elementType === "img") {
			returnObject["src"] = fullPath;
			let alt = this.getFirstInput("alt");
			if(alt) {
				returnObject["alt"] = alt;
			}
			let width = this.getFirstInput("width");
			if(width) {
				returnObject["width"] = width;
			}
			let height = this.getFirstInput("height");
			if(height) {
				returnObject["height"] = height;
			}
		}
		else {
			if(!returnObject["style"]) {
				returnObject["style"] = new Object();
			}
			returnObject["style"]["backgroundImage"] = "url('" + fullPath + "')";
		}
		
		return returnObject;
	}
	
	_renderMainElement() {
		return React.createElement("div", {}, this.props.children);
	}
}
