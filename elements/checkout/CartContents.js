import React from 'react';
import Wprr from "wprr";


let cacheValue = (new Date()).valueOf();

//import CartContents from "./CartContents";
export default class CartContents extends Wprr.BaseObject {

	constructor(props) {
		super(props);
		
		this._addMainElementClassName("centered-content-text");
	}
	
	_removeItem(aKey) {
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("woocommerce/remove-from-cart");
		
		loader.setJsonPostBody({
			"key": aKey
		});
		
		loader.addSuccessCommand(Wprr.commands.reload());
		
		loader.load();
	}
	
	_renderMainElement() {
		//console.log("./CartContents::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: {
    "originalCart": cartUrl
  }
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("originalCart", "items"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement(Wprr.layout.List, {
  items: Wprr.sourceProp("originalCart", "items")
}, /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: {
    "product": Wprr.sourceCombine("wprr/v1/range-item/product/idSelection/preview,product?ids=", Wprr.sourceReference("loop/item", "product.id"))
  }
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceProp("product"),
  as: "product"
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-box standard-box-padding"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize"
}, /*#__PURE__*/React.createElement(Wprr.Link, {
  href: Wprr.sourceReference("loop/item", "product.permalink"),
  target: "_blank"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("div", {
  className: "product__img-container small overflow-hidden"
}, /*#__PURE__*/React.createElement(Wprr.WprrLazyImage, {
  className: "image background-contain full-size",
  data: Wprr.sourceReference("product", "image")
})), /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("loop/item", "product.title")), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement("div", {
  className: "small-description result-line-height no-paragraph-margins-around"
}, Wprr.text(Wprr.sourceReference("product", "shortDescription"), "html"))))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this._removeItem, Wprr.sourceReference("loop/item", "key"))
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  overrideMainElementType: "img",
  src: "icons/remove.svg",
  location: "images"
})))))), /*#__PURE__*/React.createElement("div", {
  className: "spacing small",
  "data-slot": "spacing"
}))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("cart", "items"),
  checkType: "invert/notEmpty"
}, /*#__PURE__*/React.createElement("div", null))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null));
	}
}
