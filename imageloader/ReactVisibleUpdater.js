import offset from 'document-offset';

//import ReactVisibleUpdater from "wprr/imageloader/ReactVisibleUpdater";
export default class ReactVisibleUpdater {
	
	constructor() {
		//console.log("wprr/imageloader/ReactVisibleUpdater::constructor");
		
		this._element = null;
		this._component = null;
		this._owner = null;
	}
	
	setupData(aElement) {
		//console.log("wprr/imageloader/ReactVisibleUpdater::setupData");
		//console.log(aElement, aData, aSettings);
		
		this._element = aElement;
		
		return this;
	}
	
	setComponent(aComponent) {
		//console.log("wprr/imageloader/ReactVisibleUpdater::setComponent");
		
		this._component = aComponent;
		
		return this;
	}
	
	setOwner(aOwner) {
		//console.log("wprr/imageloader/ReactVisibleUpdater::setOwner");
		this._owner = aOwner;
		
		return this;
	}
	
	shouldActivate(aScrollX, aScrollY, aPreparationLength) {
		//console.log("wprr/imageloader/ReactVisibleUpdater::shouldActivate");
		
		let currentOffset = offset(this._element);
		
		if(currentOffset.top <= aScrollY+aPreparationLength) {
			return true;
		}
		
		return false;
	}
	
	update() {
		//console.log("wprr/imageloader/ReactVisibleUpdater::update");
		
		this.updateRatio();
		
		this._component.setState({
			"isVisible": true
		});
	}
	
	updateRatio() {
		//console.log("wprr/imageloader/ReactVisibleUpdater::updateRatio");
		
		//MENOTE: do nothing
	}
	
	static create(aComponent, aElement, aOwner) {
		//console.log("wprr/imageloader/ReactVisibleUpdater::create");
		
		let newReactVisibleUpdater = new ReactVisibleUpdater();
		
		newReactVisibleUpdater.setComponent(aComponent);
		newReactVisibleUpdater.setupData(aElement);
		newReactVisibleUpdater.setOwner(aOwner);
		
		return newReactVisibleUpdater;
	}
}