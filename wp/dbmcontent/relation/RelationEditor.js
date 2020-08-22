import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import RelationEditor from "./RelationEditor";
export default class RelationEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._direction = null;
		this._connectionType = null;
		this._objectType = null;
		
	}
	
	setup(aDirection, aConnectionType, aObjectType) {
		this._direction = aDirection;
		this._connectionType = aConnectionType;
		this._objectType = aObjectType;
	}
}