import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import PartRenderFunction from "wprr/elements/create/PartRenderFunction";
export default class PartRenderFunction extends WprrBaseObject {
	
	constructor(props) {
		super(props);
	}
	
	useElementReplacement() {
		return false;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/create/PartRenderFunction::_renderMainElement");
		
		let renderFunction = this.getSourcedProp("renderFunction");
		if(!renderFunction) {
			console.error("No render function", this);
			return null;
		}
		
		let owner = this.getSourcedProp("owner");
		
		let returnValue = renderFunction.call(this, this, owner);
		
		if(returnValue === undefined) {
			console.error("Render function did not return anything", this);
			return React.createElement("div", {}, "Render function did not return anything");
		}
		
		return returnValue;
	}
	
	static createElement(aFunction, aOwner) {
		let newPartRenderFunction = React.createElement(PartRenderFunction, {"renderFunction": aFunction, "owner": aOwner});
		
		return newPartRenderFunction;
	}
}