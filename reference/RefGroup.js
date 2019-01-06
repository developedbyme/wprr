import React from "react";
import objectPath from "object-path";

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
		//console.log("wprr/reference/RefGroup::trigger");
		//console.log(aName, aValue);
		
		let group = this.getSourcedPropWithDefault("group", "main");
		
		if(aName === "addRef/" + group) {
			this.addRef(aValue.name, aValue.item);
		}
		else if(aName === "removeRef/" + group) {
			let refs = this.state["refs"];
			delete refs[aValue.name];
			this.setState({"refs": refs});
		}
	}
	
	addRef(aName, aObject) {
		let refs = this.state["refs"];
		refs[aName] = aObject;
		this.setState({"refs": refs});
		
		return this;
	}
	
	getRef(aName) {
		let currentRef = this.state.refs[aName];
		if(currentRef) {
			return currentRef;
		}
		console.warn("Group doesn't have ref " + aName);
		return null;
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
		injectData["refGroup/" + group] = this;
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
		
		let fullCallbackPath = aGroup + "." + aName;
		
		//MENOTE: reusing callbacks as the causes unmount/mount in other cases
		let existingFunction = objectPath.get(RefGroup._callbackFunctions, fullCallbackPath);
		if(existingFunction) {
			return  existingFunction;
		}
		
		let refCallbackFunction = function(aRef) {
			if(aRef instanceof WprrBaseObject) {
				let refGroup = aRef.getReference("trigger/addRef/" + aGroup);
				
				if(refGroup) {
					refGroup.trigger("addRef/" + aGroup, {"name": aName, "item": aRef});
				}
				else {
					console.warn("Ref doesn't have any group " + aGroup + ". Can't add.", aRef);
				}
			}
			else if(aRef === null) {
				//MENOTE: React send out a null ref when a component is unmounted.
				//METODO: solve so that the ref is removed
			}
			else {
				console.warn("Ref is not a WprrBaseObject. Can't set " + aName + " in group " + aGroup + ".", aRef);
			}
		};
		
		
		objectPath.set(RefGroup._callbackFunctions, fullCallbackPath, refCallbackFunction);
		
		return refCallbackFunction;
	}
	
	static createRef(aPath) {
		let pathArray = aPath.split("/");
		if(pathArray.length === 1) {
			console.error("Path " + aPath + " doesn't have any group name. Format is \"group/element-path\"");
			return null;
		}
		
		let group = pathArray.shift();
		let elementPath = pathArray.join("/");
		return RefGroup.getCallback(elementPath, group);
	}
}

RefGroup._callbackFunctions = new Object();
