import React from 'react';
import Wprr from "wprr";

import objectPath from "object-path";

//import AddDiscountCodeExpandable from "./AddDiscountCodeExpandable";
export default class AddDiscountCodeExpandable extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._open = Wprr.sourceValue(false);
		
		this._addMainElementClassName("centered-content-text");
	}
	
	_applyResponse(aResponseData) {
		this.getRef("messages").updateValue("messages", objectPath.get(aResponseData, "data.notices"));
		
		let isValid = objectPath.get(aResponseData, "data.results.0.result");
		
		if(isValid) {
			document.location.reload();
		}
	}
	
	_addDiscountCode(aCode) {
		
		let body = {
			"code": aCode
		};
		
		let loader = new Wprr.utils.JsonLoader();
		loader.setupJsonPost(this.getReference("wprr/paths/rest") + Wprr.utils.wprrUrl.getActionUrl("woocommerce/apply-dicount-code"), body);
		
		let userData = this.getReference("wprr/userData");
		if(userData) {
			let nonce = userData.restNonce;
			loader.addHeader("X-WP-Nonce", nonce);
		}
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._applyResponse, [Wprr.source("event", "raw")]));
		loader.addErrorCommand(Wprr.commands.alert(this.translate("An error occured")));
		
		loader.load();
	}
	
	_renderMainElement() {
		//console.log("AddDiscountCodeExpandable::_renderMainElement");
		
		let messageMarkup = <div className="woocommerce-notices-wrapper">
			<Wprr.Adjust adjust={Wprr.adjusts.resolveSources("className")} className={Wprr.source("combine", ["woocommerce-message woocommerce-", Wprr.sourceReference("loop/item", "type")])}>
				<ul>
					<li>{Wprr.text(Wprr.sourceReference("loop/item", "message.notice"))}</li>
				</ul>
			</Wprr.Adjust>
		</div>;
		
		return <wrapper>
			<Wprr.FlexRow className="micro-item-spacing vertically-center-items">
				<Wprr.Checkbox checked={this._open} />
				{Wprr.idText("Do you have a discount code?", "site.checkout.doYouHaveADiscountCode")}
			</Wprr.FlexRow>
			<Wprr.OpenCloseExpandableArea open={this._open}>
				<div>
					<div className="spacing small" />
					<Wprr.ExternalStorageInjection initialValues={{"code": ""}}>
						<Wprr.FlexRow className="justify-between small-item-spacing" itemClasses="flex-resize,flex-no-resize">
							<div>
								<Wprr.EditableProps editableProps="code" externalStorage={Wprr.sourceReference("externalStorage")}>
									<Wprr.FormField valueName="code" className="standard-field standard-field-padding full-width" placeholder={Wprr.sourceTranslation("Add a dicount code", "site.checkout.discountCodeFieldPlaceholder")}/>
								</Wprr.EditableProps>
							</div>
							<Wprr.CommandButton commands={Wprr.commands.callFunction(this, this._addDiscountCode, [Wprr.sourceReference("externalStorage", "code")])}>
								<div name="applyDiscountCodeButton" className="standard-button match-field-size match-field-size-padding cursor-pointer">
									{Wprr.idText("Apply", "site.checkout.applyDiscountCode")}
								</div>
							</Wprr.CommandButton>
						</Wprr.FlexRow>
						<Wprr.EditableProps editableProps="messages" messages={[]} ref={this.createRef("messages")}>
							<Wprr.HasData check={Wprr.sourceProp("messages")} checkType="notEmpty">
								<div className="spacing small" />
								<Wprr.Loop loop={Wprr.adjusts.markupLoop(Wprr.sourceProp("messages"), messageMarkup, <div className="spacing small" />)} />
							</Wprr.HasData>
						</Wprr.EditableProps>
					</Wprr.ExternalStorageInjection>
				</div>
			</Wprr.OpenCloseExpandableArea>
		</wrapper>;
	}
}
