import React from "react";
import PropTypes from "prop-types";

import SourceData from "wprr/reference/SourceData";

//import WprrBaseObject from "wprr/WprrBaseObject";
export default class WprrBaseObject extends React.Component {
	
	constructor(aProps) {
		super(aProps);
		this.state = {
		
		};
		this._mainElementType = "div";
		this._classNames = new Array();
		
		this._propsToCheckForUpdate = null;
		this._statesToCheckForUpdate = null;
		
		this._elementRef = React.createRef();
	}
	
	getReferences() {
		return this.context.references;
	}
	
	getReference(aPath) {
		return this.context.references.getObject(aPath);
	}
	
	getMainElement() {
		if(this._elementRef.current) {
			return this._elementRef.current;
		}
		console.warn("Component doesn't have a main element.", this);
		
		return null;
	}
	
	getReferenceIfExists(aPath) {
		return this.context.references.getObjectIfExists(aPath);
	}
	
	getPropWithDefault(aPropName, aDefaultValue) {
		if(this.props[aPropName] !== undefined) {
			return this.props[aPropName];
		}
		return aDefaultValue;
	}
	
	resolveSourcedData(aData) {
		//console.log("wprr/WprrBaseObject::resolveSourcedData");
		//console.log(aData);
		
		if(aData && aData.getSource) {
			return aData.getSource(this);
		}
		
		return aData;
	}
	
	resolveSourcedDataInStateChange(aData, aNewPropsAndState) {
		if(aData && aData.getSourceInStateChange) {
			return aData.getSourceInStateChange(this, aNewPropsAndState);
		}
		
		return aData;
	}
	
	getSourcedProp(aPropName) {
		return this.resolveSourcedData(this.props[aPropName]);
	}
	
	getSourcedPropWithDefault(aPropName, aDefault) {
		return this.resolveSourcedData(this.getPropWithDefault(aPropName, aDefault));
	}
	
	getSourcedPropInStateChange(aPropName, aNewPropsAndState) {
		return this.resolveSourcedDataInStateChange(this.props[aPropName], aNewPropsAndState);
	}
	
	_createPropsToCheckIfNeeded() {
		if(this._propsToCheckForUpdate === null) {
			this._propsToCheckForUpdate = new Array();
		}
		
		return this._propsToCheckForUpdate;
	}
	
	_addPropToCheck(aName) {
		this._createPropsToCheckIfNeeded().push(aName);
		
		return this;
	}
	
	_createStatesToCheckIfNeeded() {
		if(this._statesToCheckForUpdate === null) {
			this._statesToCheckForUpdate = new Array();
		}
		
		return this._statesToCheckForUpdate;
	}
	
	_addStateToCheck(aName) {
		this._createStatesToCheckIfNeeded().push(aName);
		
		return this;
	}
	
	_addMainElementClassName(aName) {
		this._classNames.push(aName);
	}
	
	_getMainElementType() {
		let overrideType = this.getSourcedProp("overrideMainElementType");
		if(overrideType) {
			return overrideType;
		}
		return this._mainElementType;
	}
	
	_getMainElementClassNames() {
		var returnArray = new Array();
		
		if(this.props.className) {
			returnArray.push(this.props.className);
		}
		
		let currentArray = this._classNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]);
		}
		
		return returnArray;
	}
	
	_copyPassthroughProps(aReturnObject) {
		for(let objectName in this.props) {
			//MENOTE: copy all data attributes
			if(objectName.indexOf("data-") === 0) {
				aReturnObject[objectName] = this.props[objectName];
			}
			
			//MENOTE: copy all callbacks
			if(objectName.indexOf("on") === 0) {
				aReturnObject[objectName] = this.props[objectName];
			}
			
			//MENOTE: pass through id and name
			if(objectName === "name" || objectName === "id") {
				aReturnObject[objectName] = this.props[objectName];
			}
			
			//MENOTE: pass through style
			if(objectName === "style") {
				
				//MENOTE: getting the prop as an object means that it is read only
				let currentStyleObject = this.props[objectName];
				let newStyleObject = new Object();
				for(let styleProperty in currentStyleObject) {
					newStyleObject[styleProperty] = currentStyleObject[styleProperty];
				}
				
				aReturnObject[objectName] = newStyleObject;
			}
		}
	}
	
	_getMainElementProps() {
		let returnObject = new Object();
		
		let classNames = this._getMainElementClassNames();
		
		if(classNames.length > 0) {
			returnObject["className"] = classNames.join(" ");
		}
		
		this._copyPassthroughProps(returnObject);
		
		return returnObject;
	}
	
	shouldComponentUpdate(aNextProps, aNextStates) {
		//console.log("wprr/WprrBaseObject::shouldComponentUpdate");
		
		let returnValue = true;
		
		if(this._propsToCheckForUpdate !== null || this._statesToCheckForUpdate !== null) {
			returnValue = false;
			
			if(this._propsToCheckForUpdate !== null && !returnValue && aNextProps) {
				let currentArray = this._propsToCheckForUpdate;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentPropName = currentArray[i];
				
					if(this.props[currentPropName] != aNextProps[currentPropName]) {
						returnValue = true;
						break;
					}
				}
			}
		
		
			if(this._statesToCheckForUpdate !== null && !returnValue && aNextStates) {
				let currentArray = this._statesToCheckForUpdate;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentStateName = currentArray[i];
					
					if(this.state[currentStateName] != aNextStates[currentStateName]) {
						returnValue = true;
						break;
					}
				}
			}
		}
		
		return returnValue;
	}
	
	componentWillMount() {
		//console.log("wprr/WprrBaseObject.componentWillMount");
		
	}

	componentDidMount() {
		//console.log("wprr/WprrBaseObject.componentDidMount");
	}

	componentWillUnmount() {
		//console.log("wprr/WprrBaseObject.componentWillUnmount");
	}
	
	_prepareRender() {
		//console.log("wprr/WprrBaseObject::_prepareRender");
	}
	
	_renderMainElement(aCurrentElement, aOwner) {
		//console.log("wprr/WprrBaseObject::_renderMainElement");
		
		return React.createElement("wrapper", {}, this.props.children);
	}
	
	_renderSafe() {
		
		this._prepareRender();
		
		let mainElement = this._renderMainElement(this, this);
		
		if(mainElement && mainElement.type === "wrapper") {
			let mainElementProps = this._getMainElementProps();
			mainElementProps["ref"] = this._elementRef;
			
			let renderArguments = [this._getMainElementType(), mainElementProps];
			
			if(mainElement.props.children) {
				if(Array.isArray(mainElement.props.children)) {
					renderArguments = renderArguments.concat(mainElement.props.children);
				}
				else {
					renderArguments.push(mainElement.props.children);
				}
			}
			
			mainElement = React.createElement.apply(React, renderArguments);
		}
		
		return mainElement;
		
	}
	
	render() {
		let returnObject;
		if(WprrBaseObject.CATCH_RENDER_ERRORS) {
			try {
				returnObject = this._renderSafe();
			}
			catch(aError) {
				let errorProperties = new Array();
				if(aError.fileName) {
					errorProperties.push("fileName: " + aError.fileName);
				}
				if(aError.sourceURL) {
					errorProperties.push("sourceURL: " + aError.sourceURL);
				}
				if(aError.lineNumber) {
					errorProperties.push("lineNumber: " + aError.lineNumber);
				}
				if(aError.line) {
					errorProperties.push("lineNumber: " + aError.line);
				}
				if(aError.stack) {
					errorProperties.push("stack: " + aError.stack);
				}
		
				let errorString = aError.message +" (" + errorProperties.join(", ") + ")";
		
				console.error(this, aError, errorString);
				
				returnObject = React.createElement("div", {className: "react-error"},
					React.createElement("div", {}, "Component had an error while rendering"),
					React.createElement("div", {className: "description"}, errorString)
				);
			}
		}
		else {
			returnObject = this._renderSafe();
		}
		
		return returnObject;
	}
}

WprrBaseObject.CATCH_RENDER_ERRORS = true;

WprrBaseObject.contextTypes = {
	"references": PropTypes.object
};