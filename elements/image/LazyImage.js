import React from 'react';
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactImageUpdater from "wprr/imageloader/ReactImageUpdater";

//import LazyImage from "wprr/elements/image/LazyImage";
export default class LazyImage extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this.state["imageStatus"] = 0;
		this.state["renderedImage"] = null;
		
		this._imageUpdater = null;
	}
	
	_getMainElementProps() {
		//console.log("_getMainElementProps");
		//console.log(this.state["imageStatus"], this.state["renderedImage"]);
		
		var returnObject = super._getMainElementProps();
		if(!returnObject["style"]) {
			returnObject["style"] = new Object();
		}
		if(!returnObject["style"]["backgroundImage"]) {
			returnObject["style"]["backgroundImage"] = "none";
		}
		
		if(this.state["imageStatus"] === 1) {
			if(this._mainElementType === "img") {
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
		
		var imageData = this._getImageData();
		
		//METODO: change window.wprr to reference
		
		if(imageData) {
			this._imageUpdater = ReactImageUpdater.create(this, ReactDOM.findDOMNode(this), imageData, this._getSettings(), window.wprr.imageLoaderManager);
			window.wprr.imageLoaderManager.addUpdater(this._imageUpdater);
		}
		else {
			console.warn("Image doesn't data", this);
		}
		
		super.componentDidMount();
	}

	componentWillUnmount() {
		//console.log("wprr/elements/image/OaBaseComponent.componentWillUnmount");
		
		window.wprr.imageLoaderManager.removeUpdater(this._imageUpdater);
		this._imageUpdater = null;
		
		super.componentWillUnmount();
	}
	
	_renderMainElement() {
		return React.createElement("wrapper", {}, this.props.children);
	}
}
