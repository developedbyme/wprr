import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import UserRoleSection from "wprr/elements/area/selectsections/UserRoleSection";
export default class UserRoleSection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_renderClonedElement() {
		//console.log("wprr/elements/area/selectsections/UserRoleSection::_renderClonedElement");
		
		let userData = this.getReference("wprr/userData");
		
		let sections = "none";
		if(userData) {
			sections = userData.roles;
		}
		
		return React.createElement(Wprr.SelectSection, {"selectedSections": sections, "canBeEmpty": true},
			this.props.children
		);
	}
}
