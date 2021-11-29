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
		
		let elements = new Array();
		
		let currentArray = objectTypes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentType = currentArray[i].getValue("slug");
			let currentElements = items.getItem("admin/editorsForType/" + currentType).getLinks("elements").items;
			if(currentElements) {
				elements = elements.concat(currentElements);
			}
		}
		
		if(!elements.length) {
			let currentElements = items.getItem("admin/defaultItemEditors").getLinks("elements").items;
			if(currentElements) {
				elements = elements.concat(currentElements);
			}
		}
		console.log(elements);
		let realElements = Wprr.utils.array.mapField(elements, "element.value");
		console.log(realElements);
			
		return React.createElement("div", null,
			React.createElement(Wprr.InsertElement, {"element": realElements})
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}
