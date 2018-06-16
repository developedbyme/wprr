import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

//import UrlControl from "wprr/manipulation/adjustfunctions/control/browser/UrlControl";
export default class UrlControl extends ControlFunction {

	constructor() {
		super();
		
		this._url = null;
		
		this._callback_popStateBound = this._callback_popState.bind(this);
	}
	
	setInitialUrl() {
		//console.log("wprr/manipulation/adjustfunctions/control/browser/UrlControl::setInitialUrl");
		
		this._url = document.location.href;
		
		return this;
	}
	
	startListeners() {
		//console.log("wprr/manipulation/adjustfunctions/control/browser/UrlControl::startListeners");
		
		window.addEventListener("popstate", this._callback_popStateBound, false);
		
		return this;
	}
	
	_callback_popState(aEvent) {
		this.updateUrl(document.location.href);
	}
	
	trigger(aName, aValue) {
		//console.log("wprr/manipulation/adjustfunctions/control/browser/UrlControl::trigger");
		
		if(aName === "wprr/url") {
			this._changeUrl(aValue);
		}
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		if(aName === "wprr/url") {
			this._changeUrl(aValue);
		}
	}
	
	_changeUrl(aUrl) {
		this.updateUrl(aUrl);
		window.history.pushState({}, "", aUrl);
	}
	
	injectReferences(aReturnObject) {
		aReturnObject["trigger/wprr/url"] = this;
		
		aReturnObject["value/wprr/url"] = this;
		
		aReturnObject["control/url"] = this;
	}
	
	_getInitialState() {
		return {"url": this._url};
	}
	
	updateUrl(aUrl) {
		this._url = aUrl;
		
		let stateObject = {"url": this._url};
		
		this.setState(stateObject);
	}
	
	/**
	 * Adjusts data. This function should be overridden by classes extending from this base object.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		console.log("wprr/manipulation/adjustfunctions/control/browser/UrlControl::adjust");
		
		aData["url"] = this._url;
		
		return aData;
	}
	
	static create() {
		let newUrlControl = new UrlControl();
		
		newUrlControl.setInitialUrl();
		newUrlControl.startListeners();
		
		return newUrlControl;
	}
}

