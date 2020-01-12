import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import ExpandableMenuItem from "wprr/elements/interaction/ExpandableMenuItem";
export default class ExpandableMenuItem extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let menuItem = this.getFirstInput("menuItem", Wprr.sourceReference("loop/item"));
		if(!menuItem) {
			console.error("No menu item", this);
			return null;
		}
		
		let defaultItemContentMarkup = Wprr.text(Wprr.sourceReference("currentMenuItem", "title"));
		let itemContentMarkup = this.getFirstInputWithDefault("itemContentMarkup", Wprr.sourceReference("menuItem/itemContentMarkup"), defaultItemContentMarkup);
		
		let defaultLinkClasses = this.getFirstInputWithDefault("linkClasses", Wprr.sourceReference("menuItem/linkClasses"), "menu-item");
		
		let defaultLinkMarkup = React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.isUrlAtPath(Wprr.sourceReference("currentMenuItem", "link"), null, {"not": "not-active", "at": "active", "in": "child-active"}, "className")},
			React.createElement("div", {"className": defaultLinkClasses},
				React.createElement(Wprr.Link, {"href": Wprr.sourceReference("currentMenuItem", "link"), "className": "custom-styled-link"},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("menuItem/itemContentMarkup")})
				)
			)
		);
		let linkMarkup = this.getFirstInputWithDefault("linkMarkup", Wprr.sourceReference("menuItem/linkMarkup"), defaultLinkMarkup);
		
		let defaultExpandButtonContentMarkup = React.createElement(Wprr.FlexRow, {"className": "full-size centered-cell-holder cursor-pointer"},
			React.createElement(Wprr.Image, {"src": "arrow-down.svg", "location": "images", "className": "background-contain"})
		);
		let expandButtonContentMarkup = this.getFirstInputWithDefault("expandButtonContentMarkup", Wprr.sourceReference("menuItem/expandButtonContentMarkup"), defaultExpandButtonContentMarkup);
		
		let defaultExpandButtonMarkup = React.createElement(Wprr.CommandButton, {"commands": [
			Wprr.commands.toggleValue(Wprr.sourceReference("value/open"), "open", Wprr.sourceProp("open"))
		]},
			React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("menuItem/expandButtonContentMarkup")})
		);
		let expandButtonMarkup = this.getFirstInputWithDefault("expandButtonMarkup", Wprr.sourceReference("menuItem/expandButtonMarkup"), defaultExpandButtonMarkup);
		
		let defaultExpandLayoutMarkup = React.createElement(Wprr.ExternalStorageInjection, {"initialValues": {"open": false}},
			React.createElement(Wprr.FlexRow, {"className": "justify-between", "itemClasses": "flex-resize,flex-no-resize menu-item-expand-button-cell"},
				React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("menuItem/linkMarkup")}),
				React.createElement(Wprr.EditableProps, {"editableProps": "open", "externalStorage": Wprr.sourceReference("externalStorage")},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("menuItem/expandButtonMarkup")})
				)
			),
			React.createElement(Wprr.ExternalStorageProps, {"props": "open", "externalStorage": Wprr.sourceReference("externalStorage")},
				React.createElement(Wprr.OpenCloseExpandableArea, {},
					React.createElement(Wprr.Loop, {"loop": Wprr.adjusts.markupLoop(Wprr.sourceReference("currentMenuItem", "children"), React.createElement(ExpandableMenuItem, {}))})
				)
			)
		);
		let expandLayoutMarkup = this.getFirstInputWithDefault("expandLayoutMarkup", Wprr.sourceReference("menuItem/expandLayoutMarkup"), defaultExpandLayoutMarkup);
		
		let startElementName = "menuItem/linkMarkup";
		if(menuItem.children && menuItem.children.length) {
			startElementName = "menuItem/expandLayoutMarkup";
		}
		
		return React.createElement(Wprr.ReferenceInjection, {"injectData": {
			"currentMenuItem": menuItem,
			"menuItem/itemContentMarkup": itemContentMarkup,
			"menuItem/linkMarkup": linkMarkup,
			"menuItem/expandButtonContentMarkup": expandButtonContentMarkup,
			"menuItem/expandButtonMarkup": expandButtonMarkup,
			"menuItem/expandLayoutMarkup": expandLayoutMarkup
		}},
			React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference(startElementName)})
		);
	}
}