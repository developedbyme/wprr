import React from 'react';
import Wprr from "wprr";

import objectPath from "object-path";

//import AddDiscountCode from "./AddDiscountCode";
export default class AddDiscountCode extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
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
		//console.log("AddDiscountCode::_renderMainElement");
		
		let messageMarkup = React.createElement("div", {
  className: "woocommerce-notices-wrapper"
}, /*#__PURE__*/React.createElement(Wprr.Adjust, {
  adjust: Wprr.adjusts.resolveSources("className"),
  className: Wprr.source("combine", ["woocommerce-message woocommerce-", Wprr.sourceReference("loop/item", "type")])
}, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, Wprr.text(Wprr.sourceReference("loop/item", "message.notice"))))));
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.ExternalStorageInjection, {
  initialValues: {
    "code": ""
  }
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between small-item-spacing",
  itemClasses: "flex-resize,flex-no-resize"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "code",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "code",
  className: "standard-field standard-field-padding full-width",
  placeholder: Wprr.sourceTranslation("Add a dicount code", "site.checkout.discountCodeFieldPlaceholder")
}))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this._addDiscountCode, [Wprr.sourceReference("externalStorage", "code")])
}, /*#__PURE__*/React.createElement("div", {
  name: "applyDiscountCodeButton",
  className: "standard-button match-field-size match-field-size-padding cursor-pointer"
}, Wprr.idText("Apply", "site.checkout.applyDiscountCode")))), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "messages",
  messages: [],
  ref: this.createRef("messages")
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("messages"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.Loop, {
  loop: Wprr.adjusts.markupLoop(Wprr.sourceProp("messages"), messageMarkup, /*#__PURE__*/React.createElement("div", {
    className: "spacing small"
  }))
})))));
	}
}
