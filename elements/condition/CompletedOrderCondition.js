import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';
import queryString from "query-string";

//import CompletedOrderCondition from "./CompletedOrderCondition";
export default class CompletedOrderCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CompletedOrderCondition::_renderMainElement");
		
		let parts = window.location.pathname.split('/');
		let id = parts.pop() || parts.pop(); //MENOTE: remove trailing slash
		
		if(isNaN(id)) {
			
			//MENOTE: klarna url structure is different than woo
			let parsedQueryString = queryString.parse(location.search);
			if(parsedQueryString["sid"]) {
				id = parsedQueryString["sid"];
			}
			
			if(isNaN(id)) {
				return null;
			}
		}
		
		let orderUrl = Wprr.utils.wprrUrl.getGlobalItemUrl("orderCondition");
		orderUrl = Wprr.utils.url.addQueryString(orderUrl, "id", id);
		
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let checkType = "equal";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: {
    "order": orderUrl
  }
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("order", "purchaseType"),
  checkType: checkType,
  compareValue: Wprr.sourceReference("blockData", "purchaseType")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ContentsAndInjectedComponents, {
  content: Wprr.sourceReference("blockData", "innerMarkup")
})))));
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
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Completed order condition")), /*#__PURE__*/React.createElement("hr", {
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
  noSelectionLabel: Wprr.sourceTranslation("Typ av köp")
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
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Slut:"), " ", Wprr.translateText("Completed order condition")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})));
	}
}
