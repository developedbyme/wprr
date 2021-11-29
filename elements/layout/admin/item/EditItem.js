import React from "react";
import Wprr from "wprr/Wprr";

import ItemEditors from "./ItemEditors";

export default class EditItem extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		console.log("EditItem::_renderMainElement");
		
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
