import React from "react";
import Wprr from "wprr/Wprr";

import ItemEditors from "./ItemEditors";

export default class EditItem extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput("item", Wprr.sourceReference("item"));
		let items = item.group;
		
		let objectTypes = Wprr.objectPath(item, "objectTypes.items");
		console.log(objectTypes);
		
		return React.createElement("div", null,
			React.createElement(ItemEditors, null)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}
