import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

// import DraggableOrder from "wprr/elements/form/DraggableOrder";
export default class DraggableOrder extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._startCommand = Wprr.commands.callFunction(this, this._dragStart, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index")]);
		this._overCommand = Wprr.commands.callFunction(this, this._dragOver, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index")]);
		this._endCommand = Wprr.commands.callFunction(this, this._dragEnd, [Wprr.sourceEvent(), Wprr.sourceReference("loop/index")]);
		
		this._length = Wprr.sourceValue(0);
		this._displayedOrder = Wprr.sourceValue([]);
		this._draggedFromPosition = Wprr.sourceValue(-1);
		this._draggedToPosition = Wprr.sourceValue(-1);
	}
	
	getValue() {
		//console.log("wprr/elements/form/DraggableOrder::getValue");
		
		return this.getFirstInput("value");
	}
	
	_dragStart(aEvent, aIndex) {
		//console.log("_dragStart");
		//console.log(aEvent, aIndex);
		
		this._draggedFromPosition.value = aIndex;
		this._draggedToPosition.value = aIndex;
		
		aEvent.dataTransfer.effectAllowed = "move";
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
	
	_prepareRender() {
		super._prepareRender();
		
		let children = ReactChildFunctions.getInputChildrenForComponent(this);
		this._length.value = children.length;
		
		this._updateOrder();
	}
	
	_renderMainElement() {
		//console.log("DraggableOrder::_renderMainElement");
		
		let order = this.getFirstInput("order");
		let value = this.getValue();
		
		let itemMarkup = React.createElement(Wprr.EventCommands,
			{"events": {"onDragStart": this._startCommand, "onDragOver": this._overCommand, "onDragEnd": this._endCommand}},
			React.createElement("div", {"draggable": "true"},
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
