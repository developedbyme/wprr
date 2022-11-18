import React from 'react';
import Wprr from "wprr";

//import RoleCondition from "./RoleCondition";
export default class RoleCondition extends Wprr.BaseObject {

	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("hasRole", null);
		
		let getItemProperty = this._elementTreeItem.addNode("getRoles", new Wprr.utils.data.nodes.GetItemProperty());
		getItemProperty.setPropertyPath("roles.value");
		getItemProperty.item.getValueSource("fromItem").input(this.getFirstInput(Wprr.sourceReference("wprr/project", "items.project.session.linkedItem.user")).idSource);
		
		let comparison = this._elementTreeItem.addNode("compare", new Wprr.utils.data.nodes.logic.Compare());
		
		let roles = Wprr.utils.array.arrayOrSeparatedString(this.getFirstInputWithDefault(Wprr.sourceReference("blockData", "roles"), []));
		roles = ["administrator"].concat(roles);
		
		comparison.sources.get("input1").input(getItemProperty.item.getValueSource("value"));
		comparison.input2 = roles;
		comparison.operation = "anyArrayOverlap";
		
		this._elementTreeItem.getValueSource("hasRole").input(comparison.sources.get("output"));
	}
	
	_renderMainElement() {
		//console.log("RoleCondition::_renderMainElement");
		
		let invert = this.getFirstInput(Wprr.sourceReference("blockData", "invert"));
		
		let checkType = "default";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return React.createElement(React.Fragment, null,
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("hasRole"), "checkType": checkType},
				React.createElement(Wprr.ContentsAndInjectedComponents, {content: Wprr.sourceReference("blockData", "innerMarkup")})
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null,
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", { className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("Role condition")),
				React.createElement("hr", {className: "line no-margin"})
			),
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing"},
				React.createElement(Wprr.EditableProps, {editableProps: "roles", externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")},
					React.createElement(Wprr.FormField, {valueName: "roles"})
				),
				React.createElement("div", null,
					React.createElement(Wprr.EditableProps, {editableProps: "invert", externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")},
						React.createElement(Wprr.Checkbox, {className: "full-width", valueName: "invert"})
					),
					React.createElement("label", null, Wprr.translateText("Invert match"))
				)
			),
			React.createElement(wp.editor.InnerBlocks, null),
			React.createElement(Wprr.FlexRow, {className: "small-item-spacing vertically-center-items", itemClasses: "flex-resize,flex-no-resize,flex-resize"},
				React.createElement("hr", {className: "line no-margin"}),
				React.createElement("div", null, Wprr.translateText("End:"), " ", Wprr.translateText("Role condition")),
				React.createElement("hr", {className: "line no-margin"})
			)
		);
	}
}
