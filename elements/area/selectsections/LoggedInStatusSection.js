import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import LoggedInStatusSection from "wprr/elements/area/selectsections/LoggedInStatusSection";
export default class LoggedInStatusSection extends ManipulationBaseObject {

	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("status", "loggedOut");
		
		let comparison = new Wprr.utils.data.nodes.logic.Compare();
		
		comparison.sources.get("input1").input(this.getFirstInput(Wprr.sourceReference("wprr/project", "items.project.session.linkedItem.user")).idSource);
		comparison.input2 = 0;
		comparison.operation = "!==";
		
		this._elementTreeItem.addNode("compare", comparison);
		
		let switchNode = new Wprr.utils.data.nodes.logic.Switch();
		switchNode.addCase(true, "loggedIn");
		switchNode.addCase(false, "loggedOut");
		switchNode.sources.get("input").input(comparison.sources.get("output"));
		
		this._elementTreeItem.getValueSource("status").input(switchNode.sources.get("output"));
	}
	
	_renderClonedElement() {
		//console.log("wprr/elements/area/selectsections/LoggedInStatusSection::_renderClonedElement");
		
		let userData = this.getReference("wprr/userData");
		let loggedIn = userData ? true : false;
		
		let options = Wprr.utils.KeyValueGenerator.create().addKeyValue(true, "loggedIn").addKeyValue(false, "loggedOut").getAsArray();
		
		return React.createElement(Wprr.SelectSection, {"selectedSections": this._elementTreeItem.getValueSource("status")},
			this.props.children
		);
	}
}
