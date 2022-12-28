import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class CreateRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_createItem() {
		console.log("_createItem");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let id = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		let name = this.getFirstInputWithDefault("name", "New item");
		creator.setTitle(name);
		
		let types = Wprr.utils.array.arrayOrSeparatedString(this.getFirstInput("types"));
		
		let currentArray = types;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(i === 0) {
				creator.setDataType(currentArray[i]);
			}
			else {
				creator.addType(currentArray[i]);
			}
			
		}
		
		let direction = this.getFirstInputWithDefault("direction", "outgoing");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		
		//MENOTE: reverse order for new item
		if(direction === "outgoing") {
			creator.addIncomingRelation(id, relationType, false);
		}
		else {
			creator.addOutgoingRelation(id, relationType, false);
		}
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", "draft"));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdItem.id")]));
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._makePrivate, [Wprr.sourceEvent("createdRelations.relation0.id")]));
		
		creator.create();
	}
	
	_makePrivate(aId) {
		console.log("_makePrivate");
		console.log(aId);
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		editorsGroup.getItemEditor(aId).getPostStatusEditor().item.setValue("value", "private");
	}
	
	_renderMainElement() {
		//console.log("CreateRelation::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		return React.createElement("div", null,
			React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._createItem)},
				React.createElement("div", {className: "button edit-button edit-button-padding create-button"},
					Wprr.idText("Create", "site.create")
				)
			)
		);
	}
}
