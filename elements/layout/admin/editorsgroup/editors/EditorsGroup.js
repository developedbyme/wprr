import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class EditorsGroup extends Layout {
	
	_construct() {
		super._construct();
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let parentGroup = this.getFirstInput(Wprr.sourceReferenceIfExists("editorsGroup"));
		if(parentGroup) {
			editorsGroup.setParent(parentGroup.item.id);
		}
		
		let projectItem = this._elementTreeItem.group.getItem("project");
		
		let lockItem = this._elementTreeItem.group.createInternalItem();
		lockItem.setValue("locked", false);
		lockItem.getValueSource("locked").input(editorsGroup.item.getValueSource("changed"));
		lockItem.addSingleLink("for", this._elementTreeItem.id);
		
		projectItem.getLinks("navigationLocks").addItem(lockItem.id);
		
		this._elementTreeItem.addSingleLink("lock", lockItem.id);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		
		let lockId = this._elementTreeItem.getType("lock").id;
		
		let projectItem = this._elementTreeItem.group.getItem("project");
		
		projectItem.getLinks("navigationLocks").removeItem(lockId);
	}
	
	_getLayout(aSlots) {
		//console.log("_getLayout");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return React.createElement(React.Fragment, null, 
			React.createElement(Wprr.ReferenceInjection, {injectData: {"editorsGroup": editorsGroup}},
				aSlots.default(React.createElement("div", null, "No element set"))
			)
		);
	}
}
