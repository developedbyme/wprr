import ImageUpdater from "wprr/imageloader/ImageUpdater";

//import ReactImageUpdater from "wprr/imageloader/ReactImageUpdater";
export default class ReactImageUpdater extends ImageUpdater {
	
	constructor() {
		//console.log("wprr/imageloader/ReactImageUpdater::constructor");
		
		super();
		
		this._component = null;
	}
	
	setComponent(aComponent) {
		//console.log("wprr/imageloader/ReactImageUpdater::setComponent");
		
		this._component = aComponent;
		
		return this;
	}
	
	_setRenderData(aRenderedData) {
		//console.log("wprr/imageloader/ReactImageUpdater::_setRenderData");
		
		this._component.setState({
			"imageStatus": 1,
			"renderedImage": aRenderedData
		});
	}
	
	static create(aComponent, aElement, aData, aSettings, aOwner) {
		//console.log("wprr/imageloader/ReactImageUpdater::create");
		
		var newReactImageUpdater = new ReactImageUpdater();
		
		newReactImageUpdater.setComponent(aComponent);
		newReactImageUpdater.setupData(aElement, aData, aSettings);
		newReactImageUpdater.setOwner(aOwner);
		
		return newReactImageUpdater;
	}
}