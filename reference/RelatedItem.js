import React from "react";
import Wprr from "wprr/Wprr";

import SelectItem from "wprr/reference/SelectItem";

//import RelatedItem from "wprr/reference/RelatedItem";
export default class RelatedItem extends SelectItem {

	constructor(aProps) {
		super(aProps);
		
		this._defaultAs = "item";
		this._defaultFrom = "item";
	}
}
