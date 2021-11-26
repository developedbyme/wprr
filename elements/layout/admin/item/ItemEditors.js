import React from "react";
import Wprr from "wprr/Wprr";

export default class ItemEditors extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let item = this.getFirstInput("item", Wprr.sourceReference("item"));
		let items = item.group;
		
		let objectTypes = Wprr.objectPath(item, "objectTypes.items");
		console.log(objectTypes);
		
		return React.createElement("div", null,
			"test"
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}
