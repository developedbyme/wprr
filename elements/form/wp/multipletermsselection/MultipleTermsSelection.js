import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from 'react-dom';

import * as Parts from "./parts/parts.js";

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
			adjusts.push(Wprr.adjusts.selectTermsSubtree(Wprr.sourceProp("input"), subtree, "termsTree"));
		}
		
		//METODO: use these
		let valueField = this.getSourcedPropWithDefault("valueField", "id");
		let translationsPath = this.getSourcedProp("translationsPath");
		
		let filterAdjust = this.getSourcedProp("filterAdjust");
		if(filterAdjust) {
			adjusts.push(filterAdjust);
		}
		
		let sortAdjust = this.getSourcedProp("sortAdjust");
		if(sortAdjust) {
			adjusts.push(sortAdjust);
		}
		
		let children = super._getChildrenToClone();
		if(children.length === 0) {
			children = null;
		}
		
		let defaultElement = React.createElement(Parts.TermLoop);
		let selection = this.getFirstValidSource(Wprr.sourceProp("selection"), children, Wprr.sourceReference("multipleTermsSelection/selection"), defaultElement);
		
		let externalStorage = this.getFirstInput("externalStorage");
		
		return [
			React.createElement(Wprr.DataLoader, {"loadData": {"terms": "wprr/v1/taxonomy/" + taxonomy + "/terms"}},
				React.createElement(Wprr.Adjust, {"adjust": adjusts},
					React.createElement(Wprr.ReferenceInjection, {"injectData": {
						"termsTree": Wprr.sourceProp("termsTree"),
						"parentTerms": [],
						"indent": 0,
						"termTranslationPath": translationsPath
					}},
						React.createElement(Wprr.ExternalStorageInjection, {"initialExternalStorage": externalStorage},
							selection
						)
					)
				)
			)
		]
	}
}
