import React from "react";
import Wprr from "wprr/Wprr";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

// import DraggableItem from "wprr/elements/form/DraggableItem";
export default class DraggableItem extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._startCommand = Wprr.commands.callFunction(this, this._dragStart, [Wprr.sourceEvent(), Wprr.source("commandElement")]);
		this._overCommand = Wprr.commands.callFunction(this, this._dragOver, [Wprr.sourceEvent()]);
		this._outCommand = Wprr.commands.callFunction(this, this._dragOut, [Wprr.sourceEvent()]);
		this._endCommand = Wprr.commands.callFunction(this, this._dragEnd, [Wprr.sourceEvent()]);
		this._dropCommand = Wprr.commands.callFunction(this, this._drop, [Wprr.sourceEvent()]);
		
		this._dragged = Wprr.sourceValue(false);
		this._over = Wprr.sourceValue(false);
	}
	
	_dragStart(aEvent, aElement) {
		//console.log("_dragStart");
		//console.log(aEvent, aIndex);
		
		let currentNode = ReactDOM.findDOMNode(aElement);
		
		aEvent.dataTransfer.effectAllowed = "move";
		aEvent.dataTransfer.setDragImage(currentNode, 0, 0);
		
		this._dragged.value = true;
		
		let dragController = this.getFirstInput("dragController", Wprr.sourceReference("dragController"));
		if(dragController) {
			dragController.startDrag(this);
		}
	}
	
	_dragOver(aEvent) {
		//console.log("_dragOver");
		//console.log(aEvent, aIndex);
		
		aEvent.preventDefault();
		
		this._over.value = true;
	}
	
	_dragOut(aEvent) {
		//console.log("_dragOver");
		//console.log(aEvent, aIndex);
		
		aEvent.preventDefault();
		
		this._over.value = false;
	}
	
	_dragEnd(aEvent) {
		//console.log("_dragEnd");
		//console.log(aEvent, aIndex);
		
		this._dragged.value = false;
	}
	
	_drop(aEvent) {
		this._over.value = false;
		
		let dragController = this.getFirstInput("dragController", Wprr.sourceReference("dragController"));
		if(dragController) {
			dragController.itemDroppedOn(this);
		}
	}
	
	_renderMainElement() {
		//console.log("DraggableItem::_renderMainElement");
		
		let dragParent = this.getFirstInputWithDefault("dragParent", "true");
		if(dragParent === false || dragParent === "false") {
			dragParent = "false";
		}
		else {
			dragParent = "true";
		}
		
		let children = ReactChildFunctions.getInputChildrenForComponent(this);
		
		return React.createElement("div", {},
			React.createElement(Wprr.EventCommands,
				{"events": {"onDragStart": this._startCommand, "onDragOver": this._overCommand, "onDragLeave": this._outCommand, "onDragEnd": this._endCommand, "onDrop": this._dropCommand}},
				React.createElement(Wprr.Adjust, {adjust: Wprr.adjusts.classFromComparison(this._over, true, "===", "over"), sourceUpdates: this._over},
					React.createElement(Wprr.Adjust, {adjust: Wprr.adjusts.classFromComparison(this._dragged, true, "===", "dragging"), sourceUpdates: this._dragged},
						React.createElement("div", {"draggable": dragParent, "className": "draggable-item"},
							children
						)
					)
				)
			)
		);
	}
}
