import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MetaPixelSingleAccountTracker extends MultiTypeItemConnection {
	
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
		aItem.requireValue("hasDoneInit", false);
		
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
		
		wprr.loadScript("https://connect.facebook.net/en_US/fbevents.js");
		
		return this;
	}
	
	startMarketingTracking() {
		
		this._setupFunction();
		this._loadScript();
		
		this.item.setValue("active", true);
		let pixelId = this.item.getValue("pixelId");
		
		console.log("pixelId", pixelId, this.item.getValue("hasDoneInit"));
		
		if(pixelId) {
			if(!this.item.getValue("hasDoneInit")) {
				window.fbq("init", pixelId);
				window.fbq.disablePushState = true; //MENOTE: this is dangourus
				this.item.setValue("hasDoneInit", true);
			}
			
			window.fbq("trackSingle", pixelId, "PageView");
		}
		
		return this;
	}
	
	stopTracking() {
		
		this.item.setValue("active", false);
		
		return this;
	}
	
	trackPage(aUrl) {
		
		if(this.item.getValue("active")) {
			let pixelId = this.item.getValue("pixelId");
			window.fbq("trackSingle", pixelId, "PageView");
		}
		
		return this;
	}
	
	trackEvent(aCategory, aAction, aLabel = null, aValue = null) {
		
		if(this.item.getValue("active")) {
			let pixelId = this.item.getValue("pixelId");
			window.fbq("trackSingleCustom", pixelId, aCategory + "_" + aAction, {"label": aLabel, "value": aValue});
		}
		
		return this;
	}
	
	trackEcommerce(aData) {
		
		//METODO
		
		return this;
	}
	
	trackConversion(aTransactionId, aItemName, aValue) {
		
		if(this.item.getValue("active")) {
			let pixelId = this.item.getValue("pixelId");
			window.fbq('track', pixelId, 'Purchase', {value: aValue, currency: this.item.getValue("currency")}, {eventID: aTransactionId});
		}
		
		return this;
	}
	
	toJSON() {
		return "[MetaPixelSingleAccountTracker id=" + this._id + "]";
	}
	
	static create(aItem, aPixelId = null) {
		let newMetaPixelSingleAccountTracker = new MetaPixelSingleAccountTracker();
		
		newMetaPixelSingleAccountTracker.setupForItem(aItem);
		if(aPixelId) {
			newMetaPixelSingleAccountTracker.item.setValue("pixelId", aPixelId);
		}
		
		return newMetaPixelSingleAccountTracker;
	}
}