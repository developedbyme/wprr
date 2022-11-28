import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "address");
		
		let editor = this.getFirstInput(Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName]));
		
		this._elementTreeItem.getValueSource("address").input(editor.valueSource);
		
		let split = this._elementTreeItem.addNode("split", new Wprr.utils.data.nodes.SetObjectProperties());
		
		this._elementTreeItem.requireValue("address1", Wprr.objectPath(editor, "value.address1"));
		this._elementTreeItem.requireValue("address2", Wprr.objectPath(editor, "value.address2"));
		this._elementTreeItem.requireValue("postCode", Wprr.objectPath(editor, "value.postCode"));
		this._elementTreeItem.requireValue("city", Wprr.objectPath(editor, "value.city"));
		
		split.addPropertySource("address1", this._elementTreeItem.getValueSource("address1"));
		split.addPropertySource("address2", this._elementTreeItem.getValueSource("address2"));
		split.addPropertySource("postCode", this._elementTreeItem.getValueSource("postCode"));
		split.addPropertySource("city", this._elementTreeItem.getValueSource("city"));
		
		split.sources.get("object").input(this._elementTreeItem.getValueSource("address"));
	}
	
	
	
	_renderMainElement() {
		
		let fieldName = this.getFirstInputWithDefault("fieldName", "address");
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", [fieldName])} as="valueEditor">
				<Wprr.FormField className="standard-field standard-field-padding full-width" value={this._elementTreeItem.getValueSource("address1")} />
				<div className="spacing small" />
				<Wprr.FormField className="standard-field standard-field-padding full-width" value={this._elementTreeItem.getValueSource("address2")} />
				<div className="spacing small" />
				<Wprr.FlexRow className="small-item-spacing flex-no-wrap">
					<Wprr.FormField className="standard-field standard-field-padding full-width" value={this._elementTreeItem.getValueSource("postCode")} />
					<Wprr.FormField className="standard-field standard-field-padding full-width" value={this._elementTreeItem.getValueSource("city")} />
				</Wprr.FlexRow>
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>
		);
	}
}
