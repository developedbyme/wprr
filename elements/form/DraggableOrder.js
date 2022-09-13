import React from "react";
import Wprr from "wprr/Wprr";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

// import DraggableOrder from "wprr/elements/form/DraggableOrder";
export default class DraggableOrder extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._startCommand = Wprr.commands.callFunction(this, this._dragStart, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index"), Wprr.source("commandElement")]);
		this._overCommand = Wprr.commands.callFunction(this, this._dragOver, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index")]);
		this._endCommand = Wprr.commands.callFunction(this, this._dragEnd, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index")]);
		
		this._length = Wprr.sourceValue(0);
		this._displayedOrder = Wprr.sourceValue([]);
		this._draggedFromPosition = Wprr.sourceValue(-1);
		this._draggedToPosition = Wprr.sourceValue(-1);
		
		let children = ReactChildFunctions.getInputChildrenForComponent(this);
		this._length.value = children.length;
		
		this._updateOrder();
	}
	
	_prepareRender() {
		
		super._prepareRender();
		
		let children = ReactChildFunctions.getInputChildrenForComponent(this);
		this._length.value = children.length;
		this._updateOrder();
	}
	
	_dragStart(aEvent, aIndex, aElement) {
		//console.log("_dragStart");
		//console.log(aEvent, aIndex);
		
		this._draggedFromPosition.value = aIndex;
		this._draggedToPosition.value = aIndex;
		
		let currentNode = ReactDOM.findDOMNode(aElement);
		
		aEvent.dataTransfer.effectAllowed = "move";
		aEvent.dataTransfer.setDragImage(currentNode, 0, 0);
		
		//METODO: calculate the distance from the start drag to grab at the correct location
	}
	
	_dragOver(aEvent, aIndex) {
		//console.log("_dragOver");
		//console.log(aEvent, aIndex);
		
		aEvent.preventDefault();
		
		this._draggedToPosition.value = aIndex;
		this._updateOrder();
	}
	
	_dragEnd(aEvent, aIndex) {
		//console.log("_dragEnd");
		//console.log(aEvent, aIndex);
		
		if(aEvent.dataTransfer.dropEffect !== "none") {
			let currentOrder = this.getFirstInput("order");
			if(currentOrder) {
				let length = currentOrder.length;
				let newOrder = new Array(length);
				let currentArray = this._displayedOrder.value;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < length; i++) {
					newOrder[i] = currentOrder[currentArray[i]];
				}
				
				this.updateProp("order", newOrder);
			}
		}
		
		this._draggedFromPosition.value = -1;
		this._draggedToPosition.value = -1;
		this._updateOrder();
	}
	
	_getElementsInOrder(aElements, aDisplayedOrder) {
		//console.log("_getElementsInOrder");
		//console.log(aElements, aDisplayedOrder);
		
		let returnArray = new Array(aElements.length);
		let currentArray = aDisplayedOrder;
		let currentArrayLength = currentArray.length;
		for(let i = 0 ; i < currentArrayLength; i++) {
			let currentIndex = aDisplayedOrder[i];
			returnArray[i] = {"key": currentIndex, "element": aElements[currentIndex]};
		}
		
		return returnArray;
	}
	
	_updateOrder() {
		let range = Wprr.utils.array.createRange(0, this._length.value-1);
		
		if(this._draggedFromPosition.value >= 0 && this._draggedToPosition.value >= 0) {
			range[this._draggedToPosition.value] = this._draggedFromPosition.value;
			range[this._draggedFromPosition.value] = this._draggedToPosition.value;
		}
		
		if(this._displayedOrder.value.join(",") !== range.join(",")) {
			this._displayedOrder.value = range;
		}
	}
	
	_renderMainElement() {
		//console.log("DraggableOrder::_renderMainElement");
		
		let dragParent = this.getFirstInputWithDefault("dragParent", "true");
		if(dragParent === false || dragParent === "false") {
			dragParent = "false";
		}
		else {
			dragParent = "true";
		}
		
		let itemMarkup = React.createElement(Wprr.EventCommands,
			{"events": {"onDragStart": this._startCommand, "onDragOver": this._overCommand, "onDragEnd": this._endCommand}},
			React.createElement("div", {"draggable": dragParent},
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("loop/item", "element")})
			)
		);
		
		let children = ReactChildFunctions.getInputChildrenForComponent(this);
		
		return React.createElement("div", {},
			React.createElement(Wprr.AddProps, {"items": Wprr.sourceFunction(this, this._getElementsInOrder, [children, this._displayedOrder]), "sourceUpdates": this._displayedOrder},
				React.createElement(Wprr.Loop, {loop: Wprr.adjusts.markupLoop(Wprr.sourceProp("items"), itemMarkup).setInput("keyField", "key")})
			)
		);
	}
}
