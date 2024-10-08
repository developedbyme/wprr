import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import Cookies from "js-cookie";

export default class TrackingController extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.getLinks("trackers");
		
		this.item.setValue("allowStatistics", false);
		this.item.getType("allowStatistics").addChangeCommand(Wprr.commands.callFunction(this, this._allowStatisticsChanged));
		this.item.setValue("allowMarketing", false);
		this.item.getType("allowMarketing").addChangeCommand(Wprr.commands.callFunction(this, this._allowMarketingChanged));
		
		this.item.setValue("active", false);
		this.item.getType("active").addChangeCommand(Wprr.commands.callFunction(this, this._activeChanged));
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("trackingController", this);
		this.setup();
		
		return this;
	}
	
	setupAllowedTracking(aAllowStatistics, aAllowMarketing) {
		this.item.setValue("allowStatistics", aAllowStatistics);
		this.item.setValue("allowMarketing", aAllowMarketing);
		
		return this;
	}
	
	start() {
		//console.log("start");
		
		this.item.setValue("active", true);
		
		return this;
	}
	
	setupPermissionsFromCookies() {
		let allowStatistics = Cookies.get("cookie/allowStatistics") == 1;
		let allowMarketing = Cookies.get("cookie/allowMarketing") == 1;
		
		this.setupAllowedTracking(allowStatistics, allowMarketing);
		
		return this;
	}
	
	startIfCookiesAreSet() {
		let allowStatistics = Cookies.get("cookie/allowStatistics") == 1;
		let allowMarketing = Cookies.get("cookie/allowMarketing") == 1;
		
		let shouldStart = allowStatistics || allowMarketing;
		
		if(shouldStart) {
			this.setupAllowedTracking(allowStatistics, allowMarketing);
			this.start();
		}
		
		return this;
	}
	
	_activeChanged() {
		//console.log("_activeChanged");
		
		let active = this.item.getValue("active");
		if(active) {
			
			let allowStatistics = this.item.getValue("allowStatistics");
			let allowMarketing = this.item.getValue("allowMarketing");
			
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
				
				currentTracker.startTracking();
				
				try {
					if(allowStatistics) {
						currentTracker.startStatisticsTracking();
					}
					if(allowMarketing) {
						currentTracker.startMarketingTracking();
					}
				}
				catch(theError) {
					console.error("Error occured while stating tracking", currentTracker, theError);
				}
			}
		}
		else {
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
				
				//METODO: try catch
				currentTracker.stopTracking();
			}
		}
	}
	
	_allowStatisticsChanged() {
		let active = this.item.getValue("active");
		if(active) {
			let allowStatistics = this.item.getValue("allowStatistics");
			
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
				
				try {
					if(allowStatistics) {
						currentTracker.startStatisticsTracking();
					}
				}
				catch(theError) {
					console.error("Error occured while stating tracking", currentTracker, theError);
				}
			}
		}
	}
	
	_allowMarketingChanged() {
		let active = this.item.getValue("active");
		if(active) {
			let allowMarketing = this.item.getValue("allowMarketing");
			
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
				
				try {
					if(allowMarketing) {
						currentTracker.startMarketingTracking();
					}
				}
				catch(theError) {
					console.error("Error occured while stating tracking", currentTracker, theError);
				}
			}
		}
	}
	
	addTracker(aId) {
		this.item.getLinks("trackers").addUniqueItem(aId);
		
		let active = this.item.getValue("active");
		if(active) {
			let allowStatistics = this.item.getValue("allowStatistics");
			let allowMarketing = this.item.getValue("allowMarketing");
			
			let currentTracker = Wprr.objectPath(this.item.group.getItem(aId), "tracker");
			console.log("currentTracker", currentTracker);
			
			currentTracker.startTracking();
			
			try {
				if(allowStatistics) {
					currentTracker.startStatisticsTracking();
				}
				if(allowMarketing) {
					currentTracker.startMarketingTracking();
				}
			}
			catch(theError) {
				console.error("Error occured while stating tracking", currentTracker, theError);
			}
		}
		
		return this;
	}
	
	removeTracker(aId) {
		
		this.item.getLinks("trackers").removeItem(aId);
		
		let currentTracker = Wprr.objectPath(this.item.group.getItem(aId), "tracker");
		currentTracker.stopTracking();
	}
	
	get allowStatistics() {
		return this.item.getValue("allowStatistics");
	}
	
	get allowMarketing() {
		return this.item.getValue("allowMarketing");
	}
	
	trackPage(aUrl) {
		
		if(this.allowStatistics) {
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
			
				try {
					currentTracker.trackPage(aUrl);
				}
				catch(theError) {
					console.error("Error occured during trackPage", currentTracker, theError);
				}
			}
		}
	}
	
	trackEvent(aCategory, aAction, aLabel = null, aValue = null) {
		if(this.allowStatistics) {
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
			
				try {
					currentTracker.trackEvent(aCategory, aAction, aLabel, aValue);
				}
				catch(theError) {
					console.error("Error occured during trackEvent", currentTracker, theError);
				}
			}
		}
	}
	
	trackEcommerce(aData) {
		if(this.allowMarketing) {
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
			
				try {
					currentTracker.trackEcommerce(aData);
				}
				catch(theError) {
					console.error("Error occured during trackEcommerce", currentTracker, theError);
				}
			}
		}
	}
	
	trackConversion(aTransactionId, aItemName, aValue) {
		if(this.allowMarketing) {
			let currentArray = Wprr.objectPath(this.item, "trackers.items.(every).tracker");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTracker = currentArray[i];
			
				try {
					currentTracker.trackConversion(aTransactionId, aItemName, aValue);
				}
				catch(theError) {
					console.error("Error occured during trackConversion", currentTracker, theError);
				}
			}
		}
	}
	
	trackProductView(aName, aEcommerceData) {
		this.trackEvent("Product", "View", aName);
		
		this.trackEcommerce(aEcommerceData);
	}
	
	trackProductAddedToBasket(aName, aEcommerceData) {
		this.trackEvent("Product", "Added to basket", aName);
		
		this.trackEcommerce(aEcommerceData);
	}
	
	trackProductCheckout(aName, aStep, aEcommerceData) {
		this.trackEvent("Checkout", "Step " + aStep, aName);
		
		this.trackEcommerce(aEcommerceData);
	}
	
	trackProductPurchase(aName, aOrderId, aValue, aEcommerceData) {
		this.trackEvent("Purchase", "Order " + aOrderId, aName, aValue);
		this.trackConversion(aOrderId, aName, aValue);
		
		this.trackEcommerce(aEcommerceData);
	}
	
	toJSON() {
		return "[TrackingController id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newTrackingController = new TrackingController();
		
		newTrackingController.setupForItem(aItem);
		
		return newTrackingController;
	}
}