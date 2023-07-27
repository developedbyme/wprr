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
			this._urlResolver.setBasePaths({"default": this.getFirstInput(Wprr.sourceReference("wprr/paths/" + sourceLocation))});
		
			fullPath = this._urlResolver.resolveUrl(imageSource, "default");
		}
		else {
			console.warn("No src set for image.", this);
		}
		
		
		if(elementType === "img") {
			returnObject["src"] = fullPath;
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
