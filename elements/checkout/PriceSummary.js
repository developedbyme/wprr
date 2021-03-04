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
		
		return <div>
			<Wprr.ReferenceInjection injectData={{"cartTotals": cart.totals}}>
				<Wprr.FlexRow className="justify-between small-item-spacing">
					<div className="table-title">{Wprr.text(this.getSourcedProp("title"))}</div>
					<div className="table-title">{Wprr.text(PriceSummary.getFormattedPrice(1*cart.totals.total, currency))}</div>
				</Wprr.FlexRow>
		
				<Wprr.HasData check={totalDiscounts}>
					<Wprr.FlexRow className="justify-between small-item-spacing">
						<div>{Wprr.idText("Regular price", "site.checkout.regularPrice")}</div>
						<div>{Wprr.text(PriceSummary.getFormattedPrice(1*cart.totals.subtotal+1*cart.totals.subtotal_tax, currency))}</div>
					</Wprr.FlexRow>
					<Wprr.FlexRow className="justify-between small-item-spacing">
						<div className="price-table-discount">{Wprr.idText("Rabatt", "site.checkout.discount")}</div>
						<div className="price-table-discount">{Wprr.text(PriceSummary.getFormattedPrice(-1*totalDiscounts-1*cart.totals.discount_tax, currency))}</div>
					</Wprr.FlexRow>
				</Wprr.HasData>
			</Wprr.ReferenceInjection>
		</div>;
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
