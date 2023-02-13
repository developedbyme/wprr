import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SaveValueChanges extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		//console.log("SaveValueChanges::_renderMainElement");
		
		return React.createElement("div", null,
		React.createElement(Wprr.OpenCloseExpandableArea, {
		  open: Wprr.sourceReference("valueEditor", "changedSource")
		}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
		  className: "justify-between"
		}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
		  className: "action-link cursor-pointer",
		  commands: Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "cancelEdit")
		}, /*#__PURE__*/React.createElement("div", null, Wprr.idText("Cancel", "site.cancel")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
		  className: "action-link cursor-pointer",
		  commands: Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "save")
		}, /*#__PURE__*/React.createElement("div", null, Wprr.idText("Save", "site.save"))))))
		);
	}
}
