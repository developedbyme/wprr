import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import CartCondition from "./CartCondition";
export default class CartCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CartCondition::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "sessionVariables", "purchase_type");
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let checkType = "equal";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: {
    "originalCart": cartUrl
  }
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("originalCart", "items"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("originalCart", "session.purchase_type"),
  checkType: checkType,
  compareValue: Wprr.sourceReference("blockData", "purchaseType")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ContentsAndInjectedComponents, {
  content: Wprr.sourceReference("blockData", "innerMarkup")
}))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Cart condition")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing"
}, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "purchaseType",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.TermSelection, {
  valueName: "purchaseType",
  taxonomy: "dbm_relation",
  valueField: "slug",
  subtree: "purchase-type",
  noSelectionLabel: Wprr.sourceTranslation("Typ av varukorg")
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "invert",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  className: "full-width",
  valueName: "invert"
})), /*#__PURE__*/React.createElement("label", null, Wprr.translateText("Invertera matchning")))), /*#__PURE__*/React.createElement(wp.editor.InnerBlocks, null), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("End:"), " ", Wprr.translateText("Cart condition")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})));
	}
}
