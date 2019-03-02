import React from 'react';

import WprrBaseObject from "wprr/WprrBaseObject";

//import Image from "wprr/elements/image/Image";
export default class Image extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("image");
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
		
		let imageSource = this.getSourcedProp("src");
		let classPrefix = this.getSourcedPropWithDefault("classPrefix", "source");
		
		returnArray.push(this._getClassNameFromSource(imageSource, classPrefix));
		
		return returnArray;
	}
	
	_getMainElementProps() {
		//console.log("_getMainElementProps");
		//console.log(this.state["imageStatus"], this.state["renderedImage"]);
		
		let returnObject = super._getMainElementProps();
		let elementType = this._getMainElementType();
		
		let imageSource = this.getSourcedProp("src");
		let sourceLocation = this.getSourcedProp("location");
		if(!sourceLocation) {
			sourceLocation = this.getReference("wprr/defaultImageLocation");
			if(!sourceLocation) {
				sourceLocation = "theme";
			}
		}
		
		//METODO: resolve location instead of append
		let fullPath = this.getReference("wprr/paths/" + sourceLocation) + "/" + imageSource;
		
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
		return React.createElement("wrapper", {}, this.props.children);
	}
}
