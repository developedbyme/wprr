import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from 'react-dom';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

// import TermSelection from "wprr/elements/form/wp/TermSelection";
export default class TermSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._propsThatShouldNotCopy.push("taxonomy");
		this._propsThatShouldNotCopy.push("subtree");
		this._propsThatShouldNotCopy.push("valueField");
		this._propsThatShouldNotCopy.push("translationsPath");
		this._propsThatShouldNotCopy.push("filterAdjust");
		this._propsThatShouldNotCopy.push("sortAdjust");
		this._propsThatShouldNotCopy.push("noSelectionLabel");
		this._propsThatShouldNotCopy.push("skipNoSelection");
	}
	
	getValue() {
		let currentNode = ReactDOM.findDOMNode(this);
		
		return currentNode.options[currentNode.selectedIndex].value;
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
		
		let valueField = this.getSourcedPropWithDefault("valueField", "id");
		
		let translationsPath = this.getSourcedProp("translationsPath");
		adjusts.push(Wprr.adjusts.optionsFromHierarchyTerms(Wprr.sourceProp("input"), null, translationsPath).setInput("valueField", valueField));
		
		let filterAdjust = this.getSourcedProp("filterAdjust");
		if(filterAdjust) {
			adjusts.push(filterAdjust);
		}
		
		let sortAdjust = this.getSourcedProp("sortAdjust");
		if(sortAdjust) {
			adjusts.push(sortAdjust);
		}
		
		//METODO: get initial values
		
		let skipNoSelection = this.getSourcedProp("skipNoSelection");
		if(!skipNoSelection) {
			let text = this.getFirstValidSource(Wprr.sourceProp("noSelectionLabel"), Wprr.sourceTranslation("Choose"));
			adjusts.push(Wprr.adjusts.addToArray(Wprr.sourceProp("options"), [{"value": 0, "label": text}], true, "options"));
		}
		
		let children = super._getChildrenToClone();
		if(children.length === 0) {
			children = null;
		}
		
		let selection = this.getFirstValidSource(Wprr.sourceProp("selection"), children, Wprr.sourceReferenceIfExists("termSelection/selection"), React.createElement(Wprr.Selection, {}));
		
		return [
			React.createElement(Wprr.DataLoader, {"loadData": {"terms": "wprr/v1/taxonomy/" + taxonomy + "/terms"}},
				React.createElement(Wprr.Adjust, {"adjust": adjusts}, 
					selection
				)
			)
		]
	}
}
