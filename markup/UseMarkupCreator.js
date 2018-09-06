import React from 'react';

import UseMarkup from "wprr/markup/UseMarkup";
import MarkupPlacement from "wprr/markup/MarkupPlacement";

//import UseMarkupCreator from "wprr/markup/UseMarkupCreator";
export default class UseMarkupCreator {
	
	constructor() {
		this._markup = null;
		this._placements = new Array();
	}
	
	setMarkup(aMarkup) {
		//console.log("wprr/markup/UseMarkupCreator::setMarkup");
		this._markup = aMarkup;
		
		return this;
	}
	
	addElement(aPlacement, aElement) {
		this._placements.push({"placement": aPlacement, "element": aElement});
		
		return this;
	}
	
	getReactElements() {
		
		let placements = new Array();
		
		let currentArray = this._placements;
		let currentarrayLength = currentArray.length;
		for(let i = 0; i < currentarrayLength; i++) {
			let currentPlacementData = currentArray[i];
			
			if(currentPlacementData.placement) {
				placements.push(React.createElement(MarkupPlacement, {"key": "placement-" + i, "placement": currentPlacementData.placement}, currentPlacementData.element));
			}
			else {
				placements.push(currentPlacementData.element);
			}
		}
		
		return React.createElement(UseMarkup, {"markup": this._markup}, placements);
	}
}
