import React from "react";
import {Fragment} from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";
import SourceData from "wprr/reference/SourceData";

//import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";
export default class ManipulationBaseObject extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._propsThatShouldNotCopy = new Array();
		this._propsThatShouldNotCopy.push("didMountCommands");
		this._propsThatShouldNotCopy.push("didUpdateCommands");
		this._propsThatShouldNotCopy.push("willUnmountCommands");
		this._propsThatShouldNotOverride = new Array(); //METODO: implement this
		
		this._clonedElement = null;
	}
	
	_cleanupProp(aPropName, aProps) {
		let prop = aProps[aPropName];
		
		if(prop instanceof SourceData) {
			console.log(">>", prop);
			if(!prop.shouldCleanup()) {
				return;
			}
			prop.removeUsedProps(aProps);
		}
		
		delete aProps[aPropName];
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		
		//MENOTE: should be overridden
		
		return aReturnObject;
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_manipulateProps");
		
		//MENOTE: should be overridden
		
		return aReturnObject;
	}
	
	_getMainElementProps() {
		//console.log("wprr/manipulation/ManipulationBaseObject::_getMainElementProps");
		var returnObject = super._getMainElementProps();

		for(var objectName in this.props) {
			if(objectName === "className") {
				//MENOTE: className is copied in _getMainElementProps
				continue;
			}
			if(this._propsThatShouldNotCopy.indexOf(objectName) !== -1) {
				continue;
			}
			returnObject[objectName] = this.props[objectName];
		}
		
		returnObject = this._removeUsedProps(returnObject);
		returnObject = this._manipulateProps(returnObject);
		
		return returnObject;
	}
	
	_performCloneWithNewChildren(aChild, aProps, aChildren) {
		var callArray = [aChild, aProps];
		
		callArray = callArray.concat(aChildren);
		
		return React.cloneElement.apply(React, callArray);
	}
	
	_performClone(aChild, aProps) {
		
		if(aChild instanceof Array) {
			let returnArray = new Array();
			
			let currentArray = aChild;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentChild = currentArray[i];
				returnArray.push(this._performClone(currentChild, aProps));
			}
			
			return returnArray;
		}
		
		let newProps = aProps;
		if(aProps.className && aChild.props && aChild.props.className) {
			newProps = new Object();
			for(let objectName in aProps) {
				newProps[objectName] = aProps[objectName];
			}
			newProps.className = aProps.className + " " + aChild.props.className;
		}
		
		let callArray = [aChild, newProps];
		
		if(aChild && aChild.props) {
			let firstChildChildren = aChild.props.children;
			if(!firstChildChildren) {
				callArray.push(null);
			}
			else if(firstChildChildren instanceof Array) {
				callArray = callArray.concat(firstChildChildren);
			}
			else {
				callArray.push(firstChildChildren);
			}
		}
		
		return React.cloneElement.apply(React, callArray);
	}
	
	_getChildrenToClone() {
		return ReactChildFunctions.getChildrenForComponent(this);
	}
	
	_cloneChildrenAndAddProps(aChildren) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_cloneChildrenAndAddProps");
		
		let children = aChildren;
		
		if(children.length === 0) {
			return null;
		}
		else if(children.length === 1) {
			return this._performClone(children[0], this._getMainElementProps());
		}
		
		let returnArray = new Array();
		
		let mainElementProps = this._getMainElementProps();
		
		let currentArray = children;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentChild = currentArray[i];
			
			if(currentChild !== null) {
				let newChild = this._performClone(currentChild, mainElementProps);
				returnArray.push(newChild);
			}
		}
		
		let callArray = [Fragment, {}].concat(returnArray);
		return React.createElement.apply(React, callArray);
	}
	
	_renderClonedElement() {
		return this._cloneChildrenAndAddProps(this._getChildrenToClone());
	}
	
	_createClonedElement() {
		//console.log("wprr/manipulation/ManipulationBaseObject::_createClonedElement");
		
		this._clonedElement = this._renderClonedElement();
	}
	
	_renderMainElement() {
		this._createClonedElement();
		return this._clonedElement;
	}
}
