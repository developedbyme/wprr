import React from 'react';

import WprrBaseObject from "wprr/WprrBaseObject";

//import Image from "wprr/elements/image/Image";
export default class Image extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("image");
	}
	
	_getClassNameFromSource(aSource, aPrefix = "source") {
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
		
		returnArray.push(this._getClassNameFromSource(classPrefix));
		
		return returnArray;
	}
	
	_getMainElementProps() {
		//console.log("_getMainElementProps");
		//console.log(this.state["imageStatus"], this.state["renderedImage"]);
		
		let returnObject = super._getMainElementProps();
		let elementType = this._getMainElementType();
		
		let imageSource = this.getSourcedProp("src");
		
		if(elementType === "img") {
			returnObject["src"] = imageSource;
		}
		else {
			if(!returnObject["style"]) {
				returnObject["style"] = new Object();
			}
			returnObject["style"]["backgroundImage"] = "url('" + imageSource + "')";
		}
		
		return returnObject;
	}
	
	_renderMainElement() {
		return React.createElement("wrapper", {}, this.props.children);
	}
}
