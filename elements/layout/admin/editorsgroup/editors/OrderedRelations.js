import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class OrderedRelations extends Layout {
	
	_construct() {
		super._construct();
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let orderEditor = itemEditor.getOrderEditor(orderName);
		
		let activeIdsSource = this.getRelationEditor().item.getLinks("activeRelations").idsSource;
		orderEditor.updateForActiveRelations(activeIdsSource.value);
		activeIdsSource.addChangeCommand(Wprr.commands.callFunction(orderEditor, "updateForActiveRelations", [activeIdsSource]));
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("OrderedRelations::_getLayout");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let orderName = this.getFirstInputWithDefault("orderName", "order");
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		let orderEditor = itemEditor.getOrderEditor(orderName);
		
		let removeButton = React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this.getRelationEditor(), "endRelation", [Wprr.sourceReference("relation", "id")])
}, /*#__PURE__*/React.createElement("div", {
  className: "cursor-pointer"
}, React.createElement(Wprr.Image, {
  "className": "field-icon background-contain",
  "src": "icons/remove-circle.svg"
})));
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: orderEditor,
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: Wprr.sourceReference("valueEditor", "valueSource"),
		  as: "relation"
		}, React.createElement(Wprr.DraggableOrder, {
		  "data-slot": "insertElements",
		  "order": Wprr.sourceReference("valueEditor", "valueSource"),
		  "dragParent": false,
		  "sourceUpdates": [Wprr.sourceReference("valueEditor", "valueSource")]
		}), React.createElement(Wprr.FlexRow, {
		  className: "micro-item-spacing vertically-center-items",
		  itemClasses: "flex-no-resize,flex-resize,flex-no-resize"
		}, React.createElement("div", {
		  "draggable": "true"
		}, React.createElement(Wprr.Image, {
		  "className": "standard-icon background-contain",
		  "src": "icons/change-order.svg"
		})), /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
		  id: relationName,
		  from: Wprr.sourceReference("relation")
		}, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id")),
		  as: "itemLoader"
		}, aSlots.default( /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "title")))))), aSlots.slot("removeButton", removeButton))), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))
		);
	}
}
