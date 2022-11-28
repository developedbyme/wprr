import ImageUpdater from "wprr/imageloader/ImageUpdater";
import ImgImageUpdater from "wprr/imageloader/ImgImageUpdater";
import LibraryImage from "wprr/imageloader/LibraryImage";

//import ImageLoaderManager from "wprr/imageloader/ImageLoaderManager";
export default class ImageLoaderManager {
	
	constructor() {
		//console.log("wprr/imageloader/ImageLoaderManager::constructor");
		
		this._isStarted = false;
		this._resampleImages = false;
		
		this._numberOfSamplesPerPoint = 7;
		
		this._imageLibrary = new Object();
		this._sampleCanvas = document.createElement("canvas");
		this._canvas = document.createElement("canvas");
		
		this._imageUpdaters = new Array();
		this._uninitiatedImageUpdaters = new Array();
		this._willUpdateNextFrame = false;
		
		this._namedSizes = new Object();
		
		this._callback_resizeBound = this._callback_resize.bind(this);
		this._callback_scrollBound = this._callback_scroll.bind(this);
		
		this._callback_requestAnimationFrameBound = this._callback_requestAnimationFrame.bind(this);
	}
	
	setNamedSizes(aNamedSizes) {
		this._namedSizes = aNamedSizes;
	}
	
	getCropForNamedSize(aName) {
		if(this._namedSizes[aName]) {
			return this._namedSizes[aName]["crop"];
		}
		return null;
	}
	
	setUseResampleImages(aResample) {
		this._resampleImages = aResample;
	}
	
	getImage(aPath) {
		if(!this._imageLibrary[aPath]) {
			this._imageLibrary[aPath] = LibraryImage.create(aPath, this);
		}
		
		return this._imageLibrary[aPath];
	}
	
	_samplePoint(aSampleData, aX, aY, aSampleLengthX, aSampleLengthY, aReturnColor) {
		
		var data = aSampleData.data;
		
		var sampleWidth = aSampleData.width;
		var sampleHeight = aSampleData.height;
		
		var totalRed = 0;
		var totalGreen = 0;
		var totalBlue = 0;
		var totalAlpha = 0;
		var totalWeight = 0;
		
		var numberOfSamples = this._numberOfSamplesPerPoint;
		var halfNumberOfSamples = 0.5*numberOfSamples;
		
		var standardDeviation = Math.sqrt(-0.5*(Math.pow(halfNumberOfSamples, 2)/Math.log(0.5)));
		
		for(var i = 0; i < numberOfSamples; i++) {
			for(var j = 0; j < numberOfSamples; j++) {
				
				var iParameter = (i-halfNumberOfSamples)/numberOfSamples;
				var jParameter = (j-halfNumberOfSamples)/numberOfSamples;
				
				var x = Math.round(aX+iParameter*aSampleLengthX);
				var y = Math.round(aY+jParameter*aSampleLengthY);
				
				var distanceFromCenter = Math.sqrt(Math.pow(x-aX, 2)+Math.pow(y-aY, 2));
				
				var weight = Math.pow(Math.E, (-0.5*Math.pow(distanceFromCenter, 2)/(Math.pow(standardDeviation, 2))));
				
				if(x > 0 && y > 0 && x < sampleWidth && y < sampleHeight) {
					var position = 4*(x+y*sampleWidth);
				
					totalRed += weight*(data[position]/255);
					totalGreen += weight*(data[position+1]/255);
					totalBlue += weight*(data[position+2]/255);
					totalAlpha += weight*(data[position+3]/255);
					totalWeight += weight;
				}
			}
		}
		
		aReturnColor[0] = Math.round(255*totalRed/totalWeight);
		aReturnColor[1] = Math.round(255*totalGreen/totalWeight);
		aReturnColor[2] = Math.round(255*totalBlue/totalWeight);
		aReturnColor[3] = Math.round(255*totalAlpha/totalWeight);
	}
	
	renderImage(aImage, aWidth, aHeight, aFitType) {
		
		if(!this._resampleImages) {
			return aImage.getElement().src;
		}
		
		var deviceRatio =  window.devicePixelRatio;
		
		var width = Math.round(deviceRatio*aWidth);
		var height = Math.round(deviceRatio*aHeight);
		
		this._canvas.width = width;
		this._canvas.height = height;
		
		var canvasContext = this._canvas.getContext("2d");
		
		var imageElement = aImage.getElement();
		var imageWidth = imageElement.naturalWidth;
		var imageHeight = imageElement.naturalHeight;
		
		this._sampleCanvas.width = imageWidth;
		this._sampleCanvas.height = imageHeight;
		var sampleCanvasContext = this._sampleCanvas.getContext("2d");
		
		
		
		if(imageWidth === width && imageHeight === height) {
			canvasContext.drawImage(imageElement, 0, 0, imageWidth, imageHeight, 0, 0, width, height);
		}
		else {
			var samplePoint = new Array();
			var sourceRect = {"x": 0, "y": 0, "width": imageWidth, "height": imageHeight};
			var destinationRect = {"x": 0, "y": 0, "width": width, "height": height};
			
			sampleCanvasContext.drawImage(imageElement, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
			
			var imageRatio = imageWidth/imageHeight;
			var destinationRatio = width/height;
			
			switch(aFitType) {
				case "scale":
					//MENOTE: do nothing
					break;
				case "cover":
					if(imageRatio > destinationRatio) {
						sourceRect["width"] = destinationRatio*imageHeight;
						sourceRect["x"] = 0.5*(imageWidth-sourceRect["width"]);
					}
					else {
						sourceRect["height"] = imageWidth/destinationRatio;
						sourceRect["y"] = 0.5*(imageHeight-sourceRect["height"]);
					}
					break;
				case "contain":
					if(imageRatio > destinationRatio) {
						destinationRect["height"] = Math.round(width/imageRatio);
						destinationRect["y"] = Math.round(0.5*(height-destinationRect["height"]));
					}
					else {
						destinationRect["width"] = Math.round(height*imageRatio);
						destinationRect["x"] = Math.round(0.5*(width-destinationRect["width"]));
					}
					break;
			}
			
			
			
			//METODO: resample picture
			canvasContext.drawImage(imageElement, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destinationRect.x, destinationRect.y, destinationRect.width, destinationRect.height);
			
			var sampleLengthX = sourceRect.width/destinationRect.width;
			var sampleLengthY = sourceRect.height/destinationRect.height;
			
			var sampleData = sampleCanvasContext.getImageData(0, 0, imageWidth, imageHeight);
			
			var imageData = canvasContext.getImageData(destinationRect.x, destinationRect.y, destinationRect.width, destinationRect.height);
			
			var data = imageData.data;
			for (var i = 0; i < data.length; i += 4) {
				
				var x = (i/4)%destinationRect.width;
				var y = Math.floor((i/4)/destinationRect.width);
				
				var xParameter = x/destinationRect.width;
				var yParameter = y/destinationRect.height;
				
				
				this._samplePoint(sampleData, sourceRect.x+xParameter*sourceRect.width, sourceRect.y+yParameter*sourceRect.height, sampleLengthX, sampleLengthY, samplePoint);
				
				data[i] = samplePoint[0];
				data[i+1] = samplePoint[1];
				data[i+2] = samplePoint[2];
				data[i+3] = samplePoint[3];
				
			}

			canvasContext.putImageData(imageData, destinationRect.x, destinationRect.y);
		}
		
		
		
		
		var renderedData = this._canvas.toDataURL('image/png', 1.0);
		
		return renderedData;
	}
	
	updateAllInitiatedImages() {
		var currentArray = this._imageUpdaters;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			currentUpdater.update();
		}
	}
	
	updateAllUninitiatedImages() {
		var currentArray = this._uninitiatedImageUpdaters;
		var currentArrayLength = currentArray.length;
		
		let thePageXOffset = window.pageXOffset;
		let theInnerWidth = window.innerWidth;
		let thePageYOffset = window.pageYOffset;
		let theInnerHeight = window.innerHeight;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			
			if(currentUpdater.shouldActivate(thePageXOffset+theInnerWidth, thePageYOffset+theInnerHeight, 100)) {
				currentUpdater.update();
				
				this._imageUpdaters.push(currentUpdater);
				this._uninitiatedImageUpdaters.splice(i, 1);
				i--;
				currentArrayLength--;
			}
			else {
				currentUpdater.updateRatio();
			}
		}
	}
	
	updateUninitiatedImage(aUpdater) {
		let thePageXOffset = window.pageXOffset;
		let theInnerWidth = window.innerWidth;
		let thePageYOffset = window.pageYOffset;
		let theInnerHeight = window.innerHeight;
		
		if(aUpdater.shouldActivate(thePageXOffset+theInnerWidth, thePageYOffset+theInnerHeight, 100)) {
			aUpdater.update();
			
			this._imageUpdaters.push(aUpdater);
			return true;
		}
		else {
			aUpdater.updateRatio();
		}
		
		return false;
	}
	
	_callback_resize(aEvent) {
		//console.log("wprr/imageloader/ImageLoaderManager::_callback_resize");
		
		this.updateAllInitiatedImages();
	}
	
	_callback_scroll(aEvent) {
		//console.log("wprr/imageloader/ImageLoaderManager::_callback_scroll");
		
		this.updateAllUninitiatedImages();
	}
	
	findAndRegisterImages(aElement) {
		//console.log("wprr/imageloader/ImageLoaderManager::findAndRegisterImages");
		//console.log(aElement);
		
		aElement = aElement ? aElement : document;
		
		var currentArray = aElement.querySelectorAll("*[data-oa-lazy=image]");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			
			var data = null;
			var settings = null;
			
			try {
				var dataString = currentElement.getAttribute("data-oa-lazy-sources");
				var settingsString = currentElement.getAttribute("data-oa-lazy-settings");
				
				var data = JSON.parse(dataString);
				var settings = JSON.parse(settingsString);
				
				this.registerElement(currentElement, data, settings);
			}
			catch(theError) {
				console.error("Error getting data from element");
				//console.log(currentElement);
				//console.log(theError);
			}
		}
	}
	
	registerElement(aElement, aData, aSettings) {
		//console.log("wprr/imageloader/ImageLoaderManager::registerElement");
		//console.log(aElement, aData, aSettings);
		
		var newUpdater;
		if(aElement.localName === "img") {
			newUpdater = ImgImageUpdater.create(aElement, aData, aSettings, this);
		}
		else {
			newUpdater = ImageUpdater.create(aElement, aData, aSettings, this);
		}
		
		this.addUpdater(newUpdater);
	}
	
	_callback_requestAnimationFrame() {
		this._willUpdateNextFrame = false;
		this.updateAllUninitiatedImages();
	}
	
	addUpdater(aUpdater) {
		this._uninitiatedImageUpdaters.push(aUpdater);
		
		if(this._isStarted) {
			if(!this._willUpdateNextFrame) {
				this._willUpdateNextFrame = true;
				requestAnimationFrame(this._callback_requestAnimationFrameBound);
			}
		}
	}
	
	removeUpdater(aUpdater) {
		
		var currentArray = this._uninitiatedImageUpdaters;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			if(currentUpdater === aUpdater) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		var currentArray = this._imageUpdaters;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			if(currentUpdater === aUpdater) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
	}
	
	start() {
		//console.log("wprr/imageloader/ImageLoaderManager::start");
		
		if(this._isStarted) return;
		
		this.updateAllUninitiatedImages();
		window.addEventListener("resize", this._callback_resizeBound, false);
		window.addEventListener("scroll", this._callback_scrollBound, false);
		
		this._isStarted = true;
	}
}