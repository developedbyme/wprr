import offset from 'document-offset';

//import ImageUpdater from "wprr/imageloader/ImageUpdater";
export default class ImageUpdater {
	
	constructor() {
		//console.log("wprr/imageloader/ImageUpdater::constructor");
		
		this._element = null;
		this._data = null;
		this._settings = null;
		
		this._imageRatio = 0;
		
		this._owner = null;
	}
	
	setupData(aElement, aData, aSettings) {
		//console.log("wprr/imageloader/ImageUpdater::setupData");
		//console.log(aElement, aData, aSettings);
		
		this._element = aElement;
		this._data = aData;
		this._settings = aSettings;
		
		this._imageRatio = aData["full"]["width"]/aData["full"]["height"];
		
		this._lastWidth = -1;
		this._lastHeight = -1;
		
		return this;
	}
	
	_getBestImageData(aWidth, aHeight, aCrop) {
		//console.log("wprr/imageloader/ImageUpdater::_getBestImageData");
		//console.log(aWidth, aHeight);
		
		var deviceRatio =  window.devicePixelRatio;
		
		var width = deviceRatio*aWidth;
		var height = deviceRatio*aHeight;
		
		var bestObject = this._data["full"];
		var bestWidth = bestObject["width"];
		
		for(var objectName in this._data) {
			var currentData = this._data[objectName];
			
			var currentCrop = currentData["crop"];
			if(currentCrop === undefined || currentCrop === null) {
				currentCrop = this._owner.getCropForNamedSize(objectName);
				if(currentCrop === null) {
					console.warn("Unknown crop size " + objectName);
					continue;
				}
			}
			
			if(currentCrop === undefined || currentCrop === null || currentCrop === aCrop) {
				var currentWidth = currentData["width"];
				if(currentWidth >= width && currentWidth < bestWidth) {
					bestObject = currentData;
					bestWidth = currentWidth;
				}
			}
		}
		
		return bestObject;
	}
	
	_getBestImage(aWidth, aHeight) {
		
		var selectedPath = this._getBestImageData(aWidth, aHeight, false)["url"];
		
		var currentImage = this._owner.getImage(selectedPath);
		
		return currentImage;
	}
	
	setOwner(aOwner) {
		//console.log("wprr/imageloader/ImageUpdater::setOwner");
		this._owner = aOwner;
		
		return this;
	}
	
	shouldActivate(aScrollX, aScrollY, aPreparationLength) {
		//console.log("wprr/imageloader/ImageUpdater::shouldActivate");
		
		var currentOffset = offset(this._element);
		
		if(currentOffset.top <= aScrollY+aPreparationLength) {
			return true;
		}
		
		return false;
	}
	
	_setRenderData(aRenderedData) {
		if(this._element.localName === "img") {
			this._element.src = aRenderedData;
		}
		else {
			this._element.style.setProperty("background-image", "url('" + aRenderedData + "')", "");
		}
	}
	
	_getFitType() {
		
		switch(this._settings["type"]) {
			case "contain":
			case "cover":
				return this._settings["type"];
		}
		
		return "scale";
	}
	
	_render(aImage) {
		//console.log("wprr/imageloader/ImageUpdater::_render");
		
		var width = this._element.clientWidth;
		var height = this._element.clientHeight;
		
		var renderedData = this._owner.renderImage(aImage, width, height, this._getFitType());
		
		this._setRenderData(renderedData);
		
		this._lastWidth = this._element.clientWidth;
		this._lastHeight = this._element.clientHeight;
	}
	
	update() {
		//console.log("wprr/imageloader/ImageUpdater::update");
		
		this.updateRatio();
		
		if(this._element.clientWidth !== this._lastWidth || this._element.clientHeight !== this._lastHeight) {
			var currentImage = this._getBestImage(this._element.clientWidth, this._element.clientHeight);
			
			var loadStatus = currentImage.getStatus();
		
			if(loadStatus === 1) {
				this._render(currentImage);
			}
			else if(loadStatus === 0) {
				currentImage.load();
			}
		}
	}
	
	updateRatio() {
		//console.log("wprr/imageloader/ImageUpdater::updateRatio");
		
		//MENOTE: should be overridden
	}
	
	static create(aElement, aData, aSettings, aOwner) {
		//console.log("wprr/imageloader/ImageUpdater::create");
		
		var newImageUpdater = new ImageUpdater();
		
		newImageUpdater.setupData(aElement, aData, aSettings);
		newImageUpdater.setOwner(aOwner);
		
		return newImageUpdater;
	}
}