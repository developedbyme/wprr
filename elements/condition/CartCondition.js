import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import CartCondition from "./CartCondition";
export default class CartCondition extends Wprr.BaseObject {

	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		//console.log("CartCondition::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "sessionVariables", "purchase_type");
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		let invert = this.getFirstInput(Wprr.sourceReference("blockData", "invert"));
		
		let checkType = "equal";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return React.createElement(React.Fragment, null,
			React.createElement(Wprr.DataLoader, {loadData: {"originalCart": cartUrl}},
				React.createElement(Wprr.HasData, {check: Wprr.sourceProp("originalCart", "items"), checkType: "notEmpty"},
					React.createElement(Wprr.HasData, {check: Wprr.sourceProp("originalCart", "session.purchase_type"), checkType: checkType, compareValue: Wprr.sourceReference("blockData", "purchaseType")},
						React.createElement(Wprr.ContentsAndInjectedComponents, {content: Wprr.sourceReference("blockData", "innerMarkup")})
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null,
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", { className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("Cart condition")),
				React.createElement("hr", {className: "line no-margin"})
			),
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing"},
				React.createElement(Wprr.EditableProps, {editableProps: "purchaseType", externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")},
					React.createElement(Wprr.TermSelection, {valueName: "purchaseType", taxonomy: "dbm_relation", valueField: "slug", subtree: "purchase-type", noSelectionLabel: Wprr.sourceTranslation("Typ av varukorg")})
				),
				React.createElement("div", null,
					React.createElement(Wprr.EditableProps, {editableProps: "invert", externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")},
						React.createElement(Wprr.Checkbox, {className: "full-width", valueName: "invert"})
					),
					React.createElement("label", null, Wprr.translateText("Invertera matchning"))
				)
			),
			React.createElement(wp.editor.InnerBlocks, null),
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", {className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("End:"), " ", Wprr.translateText("Cart condition")),
				React.createElement("hr", {className: "line no-margin"})
			)
		);
	}
}
