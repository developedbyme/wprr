import React from 'react';
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactImageUpdater from "wprr/imageloader/ReactImageUpdater";

//import LazyImage from "wprr/elements/image/LazyImage";
export default class LazyImage extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["imageStatus"] = 0;
		this.state["renderedImage"] = null;
		
		this._imageUpdater = null;
	}
	
	_getMainElementProps() {
		//console.log("_getMainElementProps");
		//console.log(this.state["imageStatus"], this.state["renderedImage"]);
		
		let returnObject = super._getMainElementProps();
		let elementType = this._getMainElementType();
		
		if(elementType === "img") {
			if(!returnObject["style"]) {
				returnObject["style"] = new Object();
			}
			if(!returnObject["style"]["backgroundImage"]) {
				returnObject["style"]["backgroundImage"] = "none";
			}
		}
		
		if(this.state["imageStatus"] === 1) {
			
			
			if(elementType === "img") {
				returnObject["src"] = this.state["renderedImage"];
			}
			else {
				if(!returnObject["style"]) {
					returnObject["style"] = new Object();
				}
				returnObject["style"]["backgroundImage"] = "url('" + this.state["renderedImage"] + "')";
			}
		}
		
		return returnObject;
	}
	
	_getImageData() {
		return this.getSourcedProp("sources");
	}
	
	_getSettings() {
		return this.getSourcedPropWithDefault("settings", {"type": "scale"});
	}
	
	componentDidMount() {
		//console.log("wprr/elements/image/OaBaseComponent.componentDidMount");
		
		let imageData = this._getImageData();
		
		if(imageData) {
			let imageLoaderManager = this.getReference("wprr/imageLoaderManager");
			
			if(imageLoaderManager) {
				this._imageUpdater = ReactImageUpdater.create(this, ReactDOM.findDOMNode(this), imageData, this._getSettings(), imageLoaderManager);
				imageLoaderManager.addUpdater(this._imageUpdater);
			}
			else {
				console.error("wprr/imageLoaderManager doesn't exist", this);
			}
		}
		else {
			console.warn("Image doesn't data", this);
		}
		
		super.componentDidMount();
	}

	componentWillUnmount() {
		//console.log("wprr/elements/image/OaBaseComponent.componentWillUnmount");
		
		let imageLoaderManager = this.getReference("wprr/imageLoaderManager");
		
		if(imageLoaderManager) {
			imageLoaderManager.removeUpdater(this._imageUpdater);
			this._imageUpdater = null;
		}
		
		super.componentWillUnmount();
	}
	
	_renderMainElement() {
		return React.createElement("wrapper", {}, this.props.children);
	}
}
