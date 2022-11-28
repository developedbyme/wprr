import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

import PriceSummary from "./PriceSummary";

let cacheValue = (new Date()).valueOf();

//import PriceOverview from "./PriceOverview";
export default class PriceOverview extends Wprr.BaseObject {

	constructor(props) {
		super(props);
		
		this._addMainElementClassName("centered-content-text");
	}
	
	_renderMainElement() {
		//console.log("./PriceOverview::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		let initialTitle = this.getFirstInput(Wprr.sourceReference("blockData", "initialTitle"), Wprr.sourceTranslation("Initial payment", "site.cart.initialPaymentTitle"));
		let subscriptionTitle = this.getFirstInput(Wprr.sourceReference("blockData", "subscriptionTitle"), Wprr.sourceTranslation("Subscription", "site.cart.subscriptionPaymentTitle"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: {
    "originalCart": cartUrl
  }
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("originalCart", "items"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement(PriceSummary, {
  title: initialTitle,
  cart: Wprr.sourceProp("originalCart")
}), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("originalCart", "recurring"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.Loop, {
  loop: Wprr.adjusts.markupLoop(Wprr.sourceProp("originalCart", "recurring"), /*#__PURE__*/React.createElement(PriceSummary, {
    title: subscriptionTitle,
    cart: Wprr.sourceReference("loop/item", "cart")
  }), /*#__PURE__*/React.createElement("div", {
    className: "spacing standard"
  }))
}))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("cart", "items"),
  checkType: "invert/notEmpty"
}, /*#__PURE__*/React.createElement("div", null))));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "full-width",
  value: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "initialTitle")
}), /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "full-width",
  value: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "subscriptionTitle")
}));
	}
}
