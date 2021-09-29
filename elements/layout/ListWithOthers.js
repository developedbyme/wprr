"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "./Layout";

// import List from "./List";
export default class List extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("List::constructor");

		super();
		
		this._layoutName = "listWithOther";
	}
	
	getElements(aItems, aShowNumberOfItems, aItemElement, aSpacingElement, aLastSpacingElement, aOthersElement) {
		let elements = new Array();
		let lastItem = null;
		
		if(aItems.length === 1) {
			elements.push(React.createElement(Wprr.AddReference, {data: aItems[0], as: "loop/item"},
				React.createElement(Wprr.InsertElement, {element: aItemElement})
			));
		}
		else if(aItems.length <= aShowNumberOfItems+1) {
			let currentArray = aItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				elements.push(React.createElement(Wprr.AddReference, {data: currentItem, as: "loop/item"},
					React.createElement(Wprr.InsertElement, {element: aItemElement})
				));
			}
			lastItem = elements.pop();
		}
		else {
			let remainingItems = [].concat(aItems);
			let currentArray = remainingItems.splice(0, aShowNumberOfItems);
			for(let i = 0; i < aShowNumberOfItems; i++) {
				let currentItem = currentArray[i];
				elements.push(React.createElement(Wprr.AddReference, {data: currentItem, as: "loop/item"},
					React.createElement(Wprr.InsertElement, {element: aItemElement})
				));
			}
			
			lastItem = React.createElement(Wprr.AddReference, { data: remainingItems, as: "remainingItems"}, React.createElement(Wprr.InsertElement, {element: aOthersElement}));
		}
		
		elements = Wprr.utils.array.insertBetween(elements, React.createElement(Wprr.InsertElement, {element: aSpacingElement}));
		
		if(lastItem) {
			elements.push(React.createElement(Wprr.InsertElement, {element: aLastSpacingElement}));
			elements.push(lastItem);
		}
		
		return elements;
	}
	
	_getLayout(aSlots) {
		
		let itemsProp = aSlots.prop("items", []);
		let showNumberOfItemsProp = aSlots.prop("showNumberOfItems", 3);
		let nameField = aSlots.prop("nameField", "title");
		let itemElementProp = aSlots.prop("itemElement", Wprr.text(Wprr.sourceReference("loop/item", nameField)));
		let spacingElementProp = aSlots.prop("spacingElement", React.createElement("span", null, ", "));
		let lastSpacingElementProp = aSlots.prop("lastSpacingElement", React.createElement("span", null, " ", Wprr.idText("and", "site.admin.listWithOther.lastSpacingWord"), " "));
		let othersElementProp = aSlots.prop("othersElement",
			React.createElement(Wprr.TextWithReplacements, {
				text: Wprr.sourceTranslation("{numberOfItmes} others", "site.admin.listWithOther.othersText"),
				replacements: {"{numberOfItmes}": Wprr.sourceReference("remainingItems", "length")}
			})
		);
		
		return React.createElement("div", {},
			React.createElement(Wprr.InsertElement, {
			  element: Wprr.sourceFunction(this, this.getElements, [itemsProp, showNumberOfItemsProp, itemElementProp, spacingElementProp, lastSpacingElementProp, othersElementProp]),
			  sourceUpdates: [itemsProp, showNumberOfItemsProp, itemElementProp, spacingElementProp, lastSpacingElementProp, othersElementProp]
			})
		);
	}
}