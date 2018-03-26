import React from "react";

import Loop from "wprr/elements/create/Loop";

import GetPostTerms from "wprr/manipulation/adjustfunctions/wp/GetPostTerms";

//import PostTermsLoop from "wprr/elements/create/PostTermsLoop";
export default class PostTermsLoop extends Loop {
	
	constructor(props) {
		super(props);
		
		this._setInputPropAdjustFunction = GetPostTerms.create(null, null, "input");
	}
	
	_addAdjustFunctions(aReturnArray) {
		
		aReturnArray.push(this._setInputPropAdjustFunction);
		
		super._addAdjustFunctions(aReturnArray);
	}
}