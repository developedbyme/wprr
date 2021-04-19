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
		
		return React.createElement("div", {className: "centered-content-text"},
			React.createElement(Wprr.ExternalStorageInjection,
				{
					initialValues: {
						"email": Wprr.sourceFirst(Wprr.sourceQueryString("email"), Wprr.sourceStatic("")),
						"phoneNumber": Wprr.sourceFirst(Wprr.sourceQueryString("phoneNumber"), Wprr.sourceStatic("")),
						"defaultPrefix": aSlots.prop("defaultPrefix", "+46"),
						"password": "",
						"remember": true,
						"verificationCode": "      "
					}
				},
				React.createElement(Wprr.ReferenceInjection, {"injectData": {"signInFlow/routes": routes, "signInFlow/directions": directions, "signInFlow/areaClasses": areas, "signInFlow/initialPath": startScreen}},
					aSlots.slot("adjustFlow", 
						aSlots.default(React.createElement(Wprr.layout.area.SteppedPathRouter, {routes: Wprr.sourceReference("signInFlow/routes"), directions: Wprr.sourceReference("signInFlow/directions"), areaClasses: Wprr.sourceReference("signInFlow/areaClasses"), initialPath: Wprr.sourceReference("signInFlow/initialPath")}))
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null, "Settings")
		);
	}
}
