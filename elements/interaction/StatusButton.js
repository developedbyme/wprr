import React from "react";
import Wprr from "wprr/Wprr";
import objectPath  from "object-path";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";
import StatusSection from "wprr/elements/area/selectsections/StatusSection";

//import StatusButton from "wprr/elements/interaction/StatusButton";
export default class StatusButton extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/StatusGroup::_removeUsedProps");
		
		delete aReturnObject["commands"];
		delete aReturnObject["activeOnDone"];
		delete aReturnObject["activeOnError"];
		
		return aReturnObject;
	}
	
	_getChildForSection(aName, aChildren) {
		
		let currentArray = aChildren;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			let sectionName = objectPath.get(currentChild, "props.data-section-name");
			if(sectionName === aName) {
				return currentChild;
			}
		}
		
		return null;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/elements/area/selectsections/StatusSection::_renderClonedElement");
		
		let commands = this.getSourcedProp("commands");
		let children = Wprr.utils.reactChildren.getInputChildrenForComponent(this);
		
		let waitingOriginalChild = this._getChildForSection("waiting", children);
		let waitingChild = React.createElement(Wprr.CommandButton, {"commands": commands}, waitingOriginalChild);
		
		let processingOriginalChild = this._getChildForSection("processing", children);
		let processingChild = processingOriginalChild ? processingOriginalChild : waitingOriginalChild;
		
		let doneOriginalChild = this._getChildForSection("done", children);
		let doneChild = doneOriginalChild ? doneOriginalChild : waitingOriginalChild;
		let activeOnDone = this.getSourcedPropWithDefault("activeOnDone", false);
		if(activeOnDone) {
			doneChild = React.createElement(Wprr.CommandButton, {"commands": commands}, doneChild);
		}
		
		let errorOriginalChild = this._getChildForSection("done", children);
		let errorChild = errorOriginalChild ? errorOriginalChild : waitingOriginalChild;
		let activeOnError = this.getSourcedPropWithDefault("activeOnError", true);
		if(activeOnError) {
			errorChild = React.createElement(Wprr.CommandButton, {"commands": commands}, errorChild);
		}
		
		return [React.createElement(Wprr.StatusSection, {},
			React.createElement(ManipulationBaseObject, {"data-section-name": "waiting"}, waitingChild),
			React.createElement(ManipulationBaseObject, {"data-section-name": "processing"}, processingChild),
			React.createElement(ManipulationBaseObject, {"data-section-name": "done"}, doneChild),
			React.createElement(ManipulationBaseObject, {"data-section-name": "error"}, errorChild)
		)];
	}
}