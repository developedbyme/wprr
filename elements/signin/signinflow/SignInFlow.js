import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import * as areas from "./areas/areas.js";
import Configuration from "./Configuration";

export default class SignInFlow extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._configuration = new Configuration();
		
		this._layoutName = "signInFlow";
	}
	
	_getLayout(aSlots) {
		
		this._configuration.setProject(this.getReference("wprr/project"));
		
		this._configuration.setDoneCommands(aSlots.prop("doneCommands", []));
		
		let routes = this._configuration.getRoutes();
		let directions = this._configuration.getDirections();
		let startScreen = this._configuration.getStartScreen();
		
		return React.createElement("div", {
  className: "centered-content-text"
}, /*#__PURE__*/React.createElement(Wprr.ExternalStorageInjection, {
  initialValues: {
    "email": Wprr.sourceFirst(Wprr.sourceQueryString("email"), Wprr.sourceStatic("")),
    "phoneNumber": Wprr.sourceFirst(Wprr.sourceQueryString("phoneNumber"), Wprr.sourceStatic("")),
    "defaultPrefix": aSlots.prop("defaultPrefix", "+46"),
    "password": "",
    "remember": true,
    "verificationCode": "      "
  }
}, aSlots.default( /*#__PURE__*/React.createElement(Wprr.layout.area.SteppedPathRouter, {
  routes: routes,
  directions: directions,
  areaClasses: areas,
  initialPath: startScreen
}))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null, "Settings"));
	}
}
