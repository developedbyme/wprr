import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

export default class CreateAction extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		this._action = Wprr.sourceValue("");
		this._from = Wprr.sourceValue("");
		this._data = Wprr.sourceValue({});
	}
	
	_runAction() {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let from = this._from.value.split(",");
		from = Wprr.utils.array.removeValues(Wprr.utils.array.castToFloat(Wprr.utils.array.trimArray(from)), [0]);
		
		let loader = project.getPerformActionLoader(this._action.value, from, this._data.value);
		
		loader.load();
	}
	
	_renderMainElement() {
		
		return React.createElement("div", {
  className: "centered-site"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Action"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  value: (this)._action,
  className: "standard-field standard-field-padding full-width"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "From"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  value: (this)._from,
  className: "standard-field standard-field-padding full-width"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium"
}), /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Data"
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-field standard-field-padding"
}, /*#__PURE__*/React.createElement(Wprr.JsonEditor, {
  value: (this)._data
}))), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  text: "Create and perform",
  commands: Wprr.commands.callFunction(this, (this)._runAction)
})));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		
	}
}
