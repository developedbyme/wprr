//import LibraryImage from "wprr/imageloader/LibraryImage";
export default class LibraryImage {
	
	constructor() {
		//console.log("wprr/imageloader/LibraryImage::constructor");
		
		this._status = 0;
		this._path = null;
		
		this._callback_imageLoadedBound = this._callback_imageLoaded.bind(this);
		this._image = new Image();
		this._image.addEventListener("load", this._callback_imageLoadedBound, false);
	}
	
	_callback_imageLoaded(aEvent) {
		//console.log("wprr/imageloader/LibraryImage::_callback_imageLoaded");
		
		this._status = 1;
		this._owner.updateAllInitiatedImages();
	}
	
	setupData(aPath) {
		//console.log("wprr/imageloader/LibraryImage::setupData");
		this._path = aPath;
	}
	
	setOwner(aOwner) {
		//console.log("wprr/imageloader/LibraryImage::setOwner");
		this._owner = aOwner;
		
		return this;
	}
	
	getElement() {
		return this._image;
	}
	
	getStatus() {
		return this._status;
	}
	
	load() {
		//console.log("wprr/imageloader/LibraryImage::load");
		
		if(this._status !== 0) {
			return;
		}
		
		this._image.src = this._path;
	}
	
	static create(aPath, aOwner) {
		//console.log("wprr/imageloader/LibraryImage::create");
		
		var newLibraryImage = new LibraryImage();
		
		newLibraryImage.setupData(aPath);
		newLibraryImage.setOwner(aOwner);
		
		return newLibraryImage;
	}
}