import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Options extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-options");
	}
	
	_publishItem(aItem) {
		let editStorage = aItem.getType("editStorage");
		
		let status = this.getFirstInputWithDefault("publishStatus", Wprr.sourceReferenceIfExists("publishStatus"), "private");
		
		editStorage.updateValue("status", status);
		
		let saveData = aItem.getType("postEditor").getSaveDataForField("status");
		if(saveData) {
			
			let projectName = this.getFirstInput("projectName", Wprr.sourceReference("wprr/projectName"));
			
			let loader = wprr.getProject(projectName).getLoader();
		
			loader.setupJsonPost(wprr.getProject(projectName).getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(saveData.id)), saveData.changes.getEditData());
			
			loader.addSuccessCommands(saveData.savedCommands);
			
			loader.load();
		}
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null, Wprr.DropdownSelection.createSelfContained( /*#__PURE__*/React.createElement(Wprr.Image, {
  src: "navigation-menu-horizontal.svg",
  className: "standard-icon image background-contain",
  location: "images"
}), /*#__PURE__*/React.createElement("div", {
  className: "custom-selection-menu custom-selection-menu-padding"
}, /*#__PURE__*/React.createElement(Wprr.Link, {
  href: Wprr.sourceCombine("/wp-admin/post.php?post=", Wprr.sourceReference("item", "id"), "&action=edit")
}, Wprr.translateText("Edit in WordPress")), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(this, this._publishItem, [Wprr.sourceReference("item")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]
}, /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Publish")))), {
  "className": "icon-dropdown dropdown-from-right"
}));
	}
}