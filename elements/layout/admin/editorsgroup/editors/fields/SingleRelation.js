import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SingleRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "name");
		
		let fieldEditor = this.getFirstInput(Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName]));
		
		this._elementTreeItem.getLinks("options");
		this._elementTreeItem.requireSingleLink("selectedRelation").idSource.input(fieldEditor.valueSource);
		
		let loader = this._elementTreeItem.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		
		loader.setUrl(this.getWprrUrl("taxonomy/?id=dbm_relation", "wprrData"));
		
		this._elementTreeItem.requireValue("loaded", false);
		this._elementTreeItem.getValueSource("loaded").addChangeCommand(Wprr.commands.callFunction(this, this._setupList));
		this._elementTreeItem.getValueSource("loaded").input(loader.item.getValueSource("loaded"));
		
	}
	
	_setupList() {
		//console.log("SingleRelation::_setupList");
		let taxonomy = this._elementTreeItem.group.getItem("taxonomy:dbm_relation");
		Wprr.utils.data.multitypeitems.setup.Taxonomy.calculate_termHierarcy(taxonomy);
		
		let path = this.getFirstInput("path");
		let parentItem = Wprr.utils.array.getItemBy("id", "dbm_relation:" + path, taxonomy.getLinks("terms").items);
		
		
		this._elementTreeItem.getLinks("options").input(parentItem.getLinks("children"));
		
	}
	
	_renderMainElement() {
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "name");
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName]), as: "valueEditor"},
				Wprr.DropdownSelection.createSelfContained(
					React.createElement(Wprr.layout.form.DropdownButton, {"className": "cursor-pointer"},
						React.createElement(React.Fragment, {}, 
							React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getType("selectedRelation").idSource},
								React.createElement(Wprr.SelectItem, {"id": this._elementTreeItem.getType("selectedRelation").idSource},
									Wprr.text(Wprr.sourceReference("item", "name"))
								)
							),
							React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getType("selectedRelation").idSource, "checkType": "invert/default"},
								Wprr.idText("Select", "site.select")
							)
						)
						
					), 
					React.createElement("div", {className: "custom-selection-container custom-selection-menu"},
						React.createElement(Wprr.layout.ItemList, {"ids": this._elementTreeItem.getLinks("options").idsSource}, 
							React.createElement(Wprr.CommandButton, {"commands": [Wprr.commands.setValue(this._elementTreeItem.getType("selectedRelation").idSource.reSource(), "value", Wprr.sourceReference("item", "id")), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
								React.createElement("div", {"className": "hover-row cursor-pointer standard-row-padding"}, Wprr.text(Wprr.sourceReference("item", "name")))
							)
						)
					)
				),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			)
		);
	}
}
