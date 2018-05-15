import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Loop from "wprr/elements/create/Loop";
import SourceData from "wprr/reference/SourceData";
import InjectChildren from "wprr/manipulation/InjectChildren";

//import WpMenu from "wprr/wp/menu/WpMenu";
export default class WpMenu extends ManipulationBaseObject {

	constructor (props) {
		super(props);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/menu/WpMenu::_removeUsedProps");
		
		delete aReturnObject["menuLocation"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let menuLocation = this.getSourcedProp("menuLocation");
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = <InjectChildren />;
		}
		
		return [<WprrDataLoader loadData={{"input": "m-router-data/v1/menu/" + menuLocation}}>
			<Loop>
				{children}
			</Loop>
		</WprrDataLoader>];
	}
}
