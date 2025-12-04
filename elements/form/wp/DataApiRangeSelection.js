import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

export default class DataApiRangeSelection extends WprrBaseObject {

	_construct() {
		super._construct();

		let range = this.getFirstInput("range");
		this._elementTreeItem.requireValue("loaded", false);
		this._elementTreeItem.requireValue("options", []);

		let fullUrl = this.getWprrUrl(range, "wprrData");
				
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		loader.setUrl(fullUrl);
		
		this._elementTreeItem.getType("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._loaded));
		this._elementTreeItem.getType("loaded").input(loader.item.getType("loaded"));
		
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
	}

	_loaded() {
		console.log("_loaded");
		let items = this._elementTreeItem.getLinks("items").items;
		console.log(items);

		let valueField = this.getSourcedPropWithDefault("valueField", "id");
		let labelField = this.getSourcedPropWithDefault("labelField", "title.value");

		let options = [];
		let currentArray = items;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let option = {
				"value": Wprr.objectPath(currentItem, valueField),
				"label": Wprr.objectPath(currentItem, labelField)
			}
			options.push(option);
		}
		console.log("options");
		console.log(options);

		//METODO: sort on label

		let skipNoSelection = this.getSourcedProp("skipNoSelection");
		if(!skipNoSelection) {
			let text = this.getFirstValidSource(Wprr.sourceProp("noSelectionLabel"), Wprr.sourceTranslation("Choose", "site.choose"));
			options.unshift({"value": 0, "label": text});
		}

		this._elementTreeItem.setValue("options", options);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		
		delete aReturnObject["range"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		//console.log("RangeSelection::_createClonedElement");
		
		let range = this.getSourcedProp("range");
		let adjusts = new Array();
		
		let valueField = this.getSourcedPropWithDefault("valueField", null);
		let labelField = this.getSourcedPropWithDefault("labelField", null);
		
		adjusts.push(Wprr.adjusts.optionsFromRange(Wprr.sourceProp("range")).setInputWithoutNull("keyField", valueField).setInputWithoutNull("labelField", labelField));
		
		//METODO: get initial values
		let skipNoSelection = this.getSourcedProp("skipNoSelection");
		if(!skipNoSelection) {
			let text = this.getFirstValidSource(Wprr.sourceProp("noSelectionLabel"), Wprr.sourceTranslation("Choose", "site.choose"));
			adjusts.push(Wprr.adjusts.addToArray(Wprr.sourceProp("options"), [{"value": 0, "label": text}], true, "options"));
		}
		
		let children = this.getFirstInput("children");
		if(children && children.length === 0) {
			children = null;
		}
		
		let selection = this.getFirstValidSource(children, React.createElement(Wprr.Selection, {}));
		
		return React.createElement(Wprr.AddProps, {"options": this._elementTreeItem.getType("options")}, 
			selection
		);
	}
}
