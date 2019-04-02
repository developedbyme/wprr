import Wprr from "wprr/Wprr";
import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

// import TermSelection from "wprr/elements/form/wp/TermSelection";
export default class TermSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_getChildrenToClone() {
		//console.log("TermSelection::_createClonedElement");
		
		let taxonomy = this.getSourcedProp("taxonomy");
		let adjusts = new Array();
		
		adjusts.push(Wprr.adjusts.createHierarchyTerms(Wprr.sourceProp("terms"), "input"));
		
		let subtree = this.getSourcedProp("subtree");
		if(subtree) {
			adjusts.push(Wprr.adjusts.selectTermsSubtree(Wprr.sourceProp("input"), subtree, "input"));
		}
		
		let translationsPath = this.getSourcedProp("translationsPath");
		adjusts.push(Wprr.adjusts.optionsFromHierarchyTerms(Wprr.sourceProp("input"), null, translationsPath));
		
		let sortAdjust = this.getSourcedProp("sortAdjust");
		if(sortAdjust) {
			adjusts.push(sortAdjust);
		}
		
		//METODO: get initial values
		adjusts.push(Wprr.adjusts.addToArray(Wprr.sourceProp("options"), [{"value": 0, "label": this.translate("Choose term")}], true, "options"));
		
		let children = super._getChildrenToClone();
		if(children.length === 0) {
			children = null;
		}
		
		let selection = this.getFirstValidSource(Wprr.sourceProp("selection"), children, Wprr.sourceReference("termSelection/selection"), React.createElement(Wprr.Selection, {}));
		
		return [
			React.createElement(Wprr.DataLoader, {"loadData": {"terms": "wprr/v1/taxonomy/" + taxonomy + "/terms"}},
				React.createElement(Wprr.Adjust, {"adjust": adjusts}, 
					selection
				)
			)
		]
	}
}
