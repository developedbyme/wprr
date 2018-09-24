import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import WprrBaseObject from "wprr/WprrBaseObject";

//import RefGroup from "wprr/reference/RefGroup";
export default class RefGroup extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		this.state["refs"] = new Object();
	}
	
	trigger(aName, aValue) {
		
		let group = this.getSourcedPropWithDefault("group", "main");
		
		if(aName === "addRef/" + group) {
			let refs = this.state["refs"];
			refs[aValue.name] = aValue.item;
			this.setState({"refs": refs});
		}
		else if(aName === "removeRef/" + group) {
			let refs = this.state["refs"];
			delete refs[aValue.name];
			this.setState({"refs": refs});
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/reference/RefGroup::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["group"];
		
		return returnObject;
	}
	
	_renderClonedElement() {
		
		let group = this.getSourcedPropWithDefault("group", "main");
		
		let injectData = new Object();
		injectData["refs/currentGroupName"] = group;
		injectData["trigger/addRef/" + group] = this;
		injectData["trigger/removeRef/" + group] = this;
		
		let refs = this.state["refs"];
		for(let objectName in refs) {
			injectData["refs/" + group + "/" + objectName] = refs[objectName];
		}
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, super._renderClonedElement());
	}
	
	static getCallback(aName, aGroup = "main") {
		return function(aRef) {
			if(aRef instanceof WprrBaseObject) {
				let refGroup = aRef.getReference("trigger/addRef/" + aGroup);
				
				if(refGroup) {
					refGroup.trigger("addRef/" + aGroup, {"name": aName, "item": aRef});
				}
				else {
					console.warn("Ref doesn't have any group " + aGroup + ". Can't add.", aRef);
				}
			}
			else {
				console.warn("Ref is not a WprrBaseObject. Can't set " + aName + " in group " + aGroup + ".", aRef);
			}
		}
	}
}
