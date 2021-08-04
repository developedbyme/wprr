import React from 'react';
import Wprr from "wprr";

//import PriceSummary from "./PriceSummary";
export default class PriceSummary extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("./PriceSummary::_renderMainElement");
		
		let cart = this.getSourcedProp("cart");
		
		let currency = cart.currency;
		let totalDiscounts = cart.totals.discount_total;
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ReferenceInjection, {
  injectData: {
    "cartTotals": cart.totals
  }
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between small-item-spacing cart-price-summary-row"
}, /*#__PURE__*/React.createElement("div", {
  className: "table-title"
}, Wprr.text(this.getSourcedProp("title"))), /*#__PURE__*/React.createElement("div", {
  className: "table-title"
}, Wprr.text(PriceSummary.getFormattedPrice(1 * cart.totals.total, currency)))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: totalDiscounts
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between small-item-spacing cart-price-summary-row"
}, /*#__PURE__*/React.createElement("div", null, Wprr.idText("Regular price", "site.checkout.regularPrice")), /*#__PURE__*/React.createElement("div", null, Wprr.text(PriceSummary.getFormattedPrice(1 * cart.totals.subtotal + 1 * cart.totals.total_tax + 1 * cart.totals.fee_total, currency)))), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between small-item-spacing cart-price-summary-row"
}, /*#__PURE__*/React.createElement("div", {
  className: "price-table-discount"
}, Wprr.idText("Rabatt", "site.checkout.discount")), /*#__PURE__*/React.createElement("div", {
  className: "price-table-discount"
}, Wprr.text(PriceSummary.getFormattedPrice(-1 * totalDiscounts - 1 * cart.totals.discount_tax, currency)))))));
	}
	
	static getFormattedPrice(aPrice, aCurrency) {
		
		let roundedPrice = Math.round(100*aPrice)/100;
		
		let priceText = roundedPrice + "";
		switch(aCurrency) {
			case "SEK":
				priceText += " kr";
				break;
			case "NOK":
				priceText += " kr";
				break;
			case "DKK":
				priceText += " kr";
				break;
			case "EUR":
				priceText = "€ " + priceText;
				break;
			default:
				priceText = aCurrency + " " + priceText;
				break;
		}
		
		return priceText;
	}
}
