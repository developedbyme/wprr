import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class DataLayerTracker extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("tracker", this);
		this.setup();
		
		return this;
	}
	
	addToDataLayer(aData) {
		window.dataLayer = window.dataLayer || [];
		
		window.dataLayer.push(aData);
		
		return this;
	}
	
	_createDataLayerEvent(aType, aData) {
		return {"event": aType, "value": aData};
	}
	
	_createDataLayerEcommerceEvent(aType, aData) {
		return {"event": aType, "ecommerce": aData};
	}
	
	startStatisticsTracking() {
		
		this.addToDataLayer({"event": "enableStatistics"});
		this.addToDataLayer({"event": "trackCurrentPage"});
		
		return this;
	}
	
	startMarketingTracking() {
		
		this.addToDataLayer({"event": "enableMarketing"});
		
		return this;
	}
	
	stopTracking() {
		this.addToDataLayer({"event": "stopTracking"});
		
		return this;
	}
	
	trackPage(aUrl) {
		this.addToDataLayer(this._createDataLayerEvent("trackPage", aUrl));
		
		return this;
	}
	
	trackEvent(aCategory, aAction, aLabel = null, aValue = null) {
		
		let data = {
			"category": aCategory,
			"action": aAction
		};
		
		if(aLabel !== null) {
			data["label"] = aLabel;
		}
		
		if(aValue !== null) {
			data["value"] = aValue;
		}
		
		this.addToDataLayer(this._createDataLayerEvent("trackEvent", data));
		
		return this;
	}
	
	trackEcommerce(aType, aData) {
		
		this.addToDataLayer(this._createDataLayerEcommerceEvent(aType, aData));
		
		return this;
	}
	
	toJSON() {
		return "[DataLayerTracker id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newDataLayerTracker = new DataLayerTracker();
		
		newDataLayerTracker.setupForItem(aItem);
		
		return newDataLayerTracker;
	}
}