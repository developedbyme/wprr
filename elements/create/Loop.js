import React from "react";
import Wprr from "wprr/Wprr";

import Adjust from "wprr/manipulation/Adjust";

import ContentCreatorLoop from "wprr/manipulation/adjustfunctions/loop/ContentCreatorLoop";
import InjectChildren from "wprr/manipulation/InjectChildren";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import Loop from "wprr/elements/create/Loop";
export default class Loop extends Adjust {
	
	constructor(props) {
		super(props);
		
		this._loopAdjustFunction = ContentCreatorLoop.create();
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aReturnObject	Object	The props object that should be adjusted
	 */
	_removeUsedProps(aReturnObject) {
		//METODO: change this to actual source cleanup
		aReturnObject = super._removeUsedProps(aReturnObject);
		delete aReturnObject["loop"];
		delete aReturnObject["loopName"];
		
		return aReturnObject;
	}
	
	_addAdjustFunctions(aReturnArray) {
		
		let loop = this.getSourcedPropWithDefault("loop", this._loopAdjustFunction);
		
		aReturnArray.push(loop);
	}
	
	_getAdjustFunctions() {
		let returnArray = super._getAdjustFunctions();
		
		this._addAdjustFunctions(returnArray);
		
		return returnArray;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = [React.createElement(InjectChildren)];
		}
		
		return children;
	}
	
	_renderMainElement() {
		console.log("Loop::_renderMainElement", this);
		
		let clonedElementes = super._renderMainElement();
		let injectData = new Object();
		
		let loopLength = 0;
		let input = this.getSourcedProp("input");
		if(input) {
			loopLength = input.length;
		}
		
		let loopName = this.getSourcedPropWithDefault("loopName", "");
		if(loopName !== "") {
			loopName += "/";
		}
		
		injectData["loop/name"] = loopName;
		injectData["loop/" + loopName + "allItems"] = input;
		injectData["loop/" + loopName + "length"] = loopLength;
		
		if(clonedElementes === undefined || (clonedElementes && clonedElementes.type === undefined)) {
			console.error("Loop has undefined children");
			clonedElementes = React.createElement("div", {className: "react-error"},
				React.createElement("div", {}, "Loop has undefined children")
			);
		} 
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElementes);
	}
	
	static createMarkupLoop(aArray, aItemMarkup, aSpacingMarkup = null, aChildren = null) {
		return React.createElement(Loop, {"loop": Wprr.adjusts.markupLoop(aArray, aItemMarkup, aSpacingMarkup), "sourceUpdates": aArray}, aChildren);
	}
}