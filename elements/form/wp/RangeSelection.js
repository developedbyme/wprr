import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from 'react-dom';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

// import RangeSelection from "wprr/elements/form/wp/RangeSelection";
export default class RangeSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	getValue() {
		let currentNode = ReactDOM.findDOMNode(this);
		
		return currentNode.options[currentNode.selectedIndex].value;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		
		delete aReturnObject["range"];
		delete aReturnObject["filterAdjust"];
		delete aReturnObject["sortAdjust"];
		delete aReturnObject["valueField"];
		delete aReturnObject["labelField"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("RangeSelection::_createClonedElement");
		
		let range = this.getSourcedProp("range");
		let adjusts = new Array();
		
		let valueField = this.getSourcedPropWithDefault("valueField", null);
		let labelField = this.getSourcedPropWithDefault("labelField", null);
		
		adjusts.push(Wprr.adjusts.optionsFromRange(Wprr.sourceProp("range")).setInputWithoutNull("valueField", valueField).setInputWithoutNull("labelField", labelField));
		
		let filterAdjust = this.getSourcedProp("filterAdjust");
		if(filterAdjust) {
			adjusts.push(filterAdjust);
		}
		
		let sortAdjust = this.getSourcedProp("sortAdjust");
		if(sortAdjust) {
			adjusts.push(sortAdjust);
		}
		
		let text = this.getFirstValidSource(Wprr.sourceProp("noSelectionLabel"), Wprr.sourceTranslation("Choose post"));
		//METODO: get initial values
		adjusts.push(Wprr.adjusts.addToArray(Wprr.sourceProp("options"), [{"value": 0, "label": text}], true, "options"));
		
		let children = super._getChildrenToClone();
		if(children.length === 0) {
			children = null;
		}
		
		let selection = this.getFirstValidSource(Wprr.sourceProp("selection"), children, Wprr.sourceReference("rangeSelection/selection"), React.createElement(Wprr.Selection, {}));
		
		return [
			React.createElement(Wprr.DataLoader, {"loadData": {"range": range}},
				React.createElement(Wprr.Adjust, {"adjust": adjusts}, 
					selection
				)
			)
		]
	}
}
