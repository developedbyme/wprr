import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import CheckoutPageCondition from "./CheckoutPageCondition";
export default class CheckoutPageCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CheckoutPageCondition::_renderMainElement");
		
		let pageType = objectPath.get(this.getReference("blockData"), "pageType");
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let pageData = this.getReference("wprr/pageData");
		
		let fieldToCheck = null;
		let isType = false;
		switch(pageType) {
			case "checkout":
				fieldToCheck = "is_checkout";
				isType = objectPath.get(pageData, "templateSelection.woocommerce." + fieldToCheck);
				isType &= !objectPath.get(pageData, "templateSelection.woocommerce.is_order_received_page");
				break;
			case "complete":
				fieldToCheck = "is_order_received_page";
				isType = objectPath.get(pageData, "templateSelection.woocommerce." + fieldToCheck);
				break;
		}
		
		let checkType = "default";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: isType,
  checkType: checkType
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ContentsAndInjectedComponents, {
  content: Wprr.sourceReference("blockData", "innerMarkup"),
  parsedContent: Wprr.sourceReference("blockData", "parsedContent")
}))));
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
  editableProps: "pageType",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Selection, {
  valueName: "pageType",
  options: [{
    "value": "none",
    "label": "None"
  }, {
    "value": "checkout",
    "label": "Checkout"
  }, {
    "value": "complete",
    "label": "Complete"
  }],
  noSelectionLabel: Wprr.sourceTranslation("Page")
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
