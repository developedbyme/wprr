import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import LoggedInStatusSection from "wprr/elements/area/selectsections/LoggedInStatusSection";
export default class LoggedInStatusSection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_renderClonedElement() {
		//console.log("wprr/elements/area/selectsections/LoggedInStatusSection::_renderClonedElement");
		
		let userData = this.getReference("wprr/userData");
		let loggedIn = userData ? true : false;
		
		let options = Wprr.utils.KeyValueGenerator.create().addKeyValue(true, "loggedIn").addKeyValue(false, "loggedOut").getAsArray();
		
		return React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.switchValue(loggedIn, options, "selectedSections")},
			React.createElement(Wprr.SelectSection, {},
				this.props.children
			)
		);
	}
}
