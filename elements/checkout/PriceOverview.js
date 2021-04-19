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
		
		return <div>
			<Wprr.DataLoader loadData={{"originalCart": cartUrl}}>
				<Wprr.HasData check={Wprr.sourceProp("originalCart", "items")} checkType="notEmpty">
					<PriceSummary title={initialTitle} cart={Wprr.sourceProp("originalCart")}/>
					<Wprr.HasData check={Wprr.sourceProp("originalCart", "recurring")} checkType="notEmpty">
						<div className="spacing standard" />
						<Wprr.Loop loop={
							Wprr.adjusts.markupLoop(
								Wprr.sourceProp("originalCart", "recurring"),
								<PriceSummary title={subscriptionTitle} cart={Wprr.sourceReference("loop/item", "cart")} />,
								<div className="spacing standard" />
							)
						} />
					</Wprr.HasData>
				</Wprr.HasData>
				<Wprr.HasData check={Wprr.sourceProp("cart", "items")} checkType="invert/notEmpty">
					<div></div>
				</Wprr.HasData>
			</Wprr.DataLoader>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <div>
			<Wprr.FormField className="full-width" value={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "initialTitle")} />
			<Wprr.FormField className="full-width" value={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "subscriptionTitle")} />
		</div>;
	}
}
