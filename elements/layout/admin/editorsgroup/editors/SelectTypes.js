import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import SelectRelations from "./SelectRelations";

export default class SelectTypes extends SelectRelations {
	
	_construct() {
		super._construct();
	}
	
	_createItem() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let itemId = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		let search = this._elementTreeItem.getValue("search");
		creator.setTitle(search);
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		creator.setDataType(objectType);
		
		creator.addType("type");
		
		let identifier = Wprr.utils.programmingLanguage.convertToCamelCase(search);
		creator.changeData.setDataField("identifier", identifier);
		creator.changeData.setDataField("name", search);
		
		let postStatus = this.getFirstInputWithDefault("newItemStatus", "publish");
		creator.changeData.setStatus(postStatus);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "title", search));
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", postStatus));
		
		let relationEditor = this.getRelationEditor();
		creator.addCreatedCommand(Wprr.commands.callFunction(relationEditor, relationEditor.createRelation, [Wprr.sourceEvent("createdItem.id")]));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this._elementTreeItem.getLinks("creatingRows"), "removeItem", [creator.item.id]));
		this._elementTreeItem.getLinks("creatingRows").addItem(creator.item.id);
		
		creator.create();
	}
}
