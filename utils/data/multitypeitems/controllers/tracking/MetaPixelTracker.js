import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MetaPixelTracker extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("tracker", this);
		aItem.requireValue("pixelId");
		aItem.requireValue("currency", "EUR");
		aItem.requireValue("active", false);
		this.setup();
		
		return this;
	}
	
	startStatisticsTracking() {
		
		
		return this;
	}
	
	_setupFunction() {
		if(window.fbq) return;
		
		let fbq = function() {
			fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
		}
		window.fbq = fbq;
		
		if(!window._fbq) {
			window._fbq = fbq;
		}
		
		fbq.push = fbq;
		fbq.loaded = true;
		fbq.version = "2.0";
		fbq.queue= [];
	}
	
	_loadScript() {
		
		let scriptElement = document.createElement('script');
		scriptElement.async = true;
		scriptElement.src = "https://connect.facebook.net/en_US/fbevents.js";
		
		let headElement = document.querySelector('head');
		headElement.appendChild(scriptElement);
		
	}
	
	startMarketingTracking() {
		
		this._setupFunction();
		this._loadScript();
		
		this.item.setValue("active", true);
		let pixelId = this.item.getValue("pixelId");
		
		console.log("pixelId", pixelId);
		
		if(pixelId) {
			window.fbq("init", pixelId);
			window.fbq("track", "PageView");
		}
		
		return this;
	}
	
	stopTracking() {
		
		
		return this;
	}
	
	trackPage(aUrl) {
		
		if(this.item.getValue("active")) {
			window.fbq("track", "PageView");
		}
		
		return this;
	}
	
	trackEvent(aCategory, aAction, aLabel = null, aValue = null) {
		
		if(this.item.getValue("active")) {
			window.fbq("trackCustom", aCategory + "_" + aAction, {"label": aLabel, "value": aValue});
		}
		
		return this;
	}
	
	trackEcommerce(aData) {
		
		//METODO
		
		return this;
	}
	
	trackConversion(aTransactionId, aItemName, aValue) {
		
		if(this.item.getValue("active")) {
			window.fbq('track', 'Purchase', {value: aValue, currency: this.item.getValue("currency")}, {eventID: aTransactionId});
		}
		
		return this;
	}
	
	toJSON() {
		return "[MetaPixelTracker id=" + this._id + "]";
	}
	
	static create(aItem, aPixelId = null) {
		let newMetaPixelTracker = new MetaPixelTracker();
		
		newMetaPixelTracker.setupForItem(aItem);
		if(aPixelId) {
			newMetaPixelTracker.item.setValue("pixelId", aPixelId);
		}
		
		return newMetaPixelTracker;
	}
}