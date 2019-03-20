import React from "react";

import SourceData from "wprr/reference/SourceData";

import WprrContext from "wprr/reference/WprrContext";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import WprrBaseObject from "wprr/WprrBaseObject";
export default class WprrBaseObject extends React.Component {
	
	constructor(aProps) {
		super(aProps);
		
		this.state = new Object();
		
		this._mainElementType = "div";
		this._classNames = new Array();
		
		this._propsToCheckForUpdate = null;
		this._statesToCheckForUpdate = null;
		
		this._isRendering = false;
		this._hasRendered = false;
		this._elementRef = React.createRef();
		
		this._namedRefs = new Object();
	}
	
	getProps() {
		return this.props;
	}
	
	getContext() {
		return this.context;
	}
	
	getRef(aName) {
		let currentRef = this._namedRefs[aName];
		if(currentRef) {
			return currentRef.current;
		}
		
		console.warn("No ref named " + aName);
		return null;
	}
	
	createRef(aName) {
		let currentRef = this._namedRefs[aName];
		if(currentRef) {
			return currentRef;
		}
		
		let newRef = React.createRef();
		this._namedRefs[aName] = newRef;
		
		return newRef;
	}
	
	setState(aNewState) {
		if(this._hasRendered) {
			super.setState(aNewState);
		}
		else {
			for(let objectName in aNewState) {
				this.state[objectName] = aNewState[objectName];
			}
		}
	}
	
	getReferences() {
		return this.getContext().references;
	}
	
	getReference(aPath) {
		return this.getContext().references.getObject(aPath);
	}
	
	getMainElement() {
		if(this._elementRef.current) {
			return this._elementRef.current;
		}
		console.warn("Component doesn't have a main element.", this);
		
		return null;
	}
	
	getReferenceIfExists(aPath) {
		return this.getContext().references.getObjectIfExists(aPath);
	}
	
	getPropWithDefault(aPropName, aDefaultValue) {
		let props = this.getProps();
		
		if(props[aPropName] !== undefined) {
			return props[aPropName];
		}
		return aDefaultValue;
	}
	
	getFirstValidSource(...aArguments) {
		return this.getFirstValidSourceInArray(aArguments);
	}
	
	getFirstValidSourceInArray(aSources) {
		let currentArray = aSources;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSource = currentArray[i];
			let resolvedValue = this.resolveSourcedData(currentSource);
			if(resolvedValue !== null && resolvedValue !== undefined) {
				return resolvedValue;
			}
		}
		
		console.warn("No sourced resolved", aSources, this);
		return null;
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
		let props = this.getProps();
		
		return this.resolveSourcedData(props[aPropName]);
	}
	
	getSourcedPropWithDefault(aPropName, aDefault) {
		return this.resolveSourcedData(this.getPropWithDefault(aPropName, aDefault));
	}
	
	getSourcedPropInStateChange(aPropName, aNewPropsAndState) {
		let props = this.getProps();
		
		return this.resolveSourcedDataInStateChange(props[aPropName], aNewPropsAndState);
	}
	
	translate(aText) {
		let textManager = this.getReference("wprr/textManager");
		return textManager.translateText(this.resolveSourcedData(aText));
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
		let returnArray = new Array();
		
		let className = this.getSourcedProp("className");
		
		if(className) {
			returnArray.push(className);
		}
		
		let currentArray = this._classNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]);
		}
		
		return returnArray;
	}
	
	_copyPassthroughProps(aReturnObject) {
		let props = this.getProps();
		
		for(let objectName in props) {
			//MENOTE: copy all data attributes
			if(objectName.indexOf("data-") === 0) {
				aReturnObject[objectName] = props[objectName];
			}
			
			//MENOTE: copy all callbacks
			if(objectName.indexOf("on") === 0 && objectName.charCodeAt(2) >= 65 && objectName.charCodeAt(2) <= 90) {
				aReturnObject[objectName] = props[objectName];
			}
			
			//MENOTE: pass through id and name
			if(objectName === "name" || objectName === "id") {
				aReturnObject[objectName] = props[objectName];
			}
			
			//MENOTE: pass through style
			if(objectName === "style") {
				
				//MENOTE: getting the prop as an object means that it is read only
				let currentStyleObject = props[objectName];
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
			
			let props = this.getProps();
			
			if(this._propsToCheckForUpdate !== null && !returnValue && aNextProps) {
				let currentArray = this._propsToCheckForUpdate;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentPropName = currentArray[i];
				
					if(props[currentPropName] != aNextProps[currentPropName]) {
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

	componentDidMount() {
		//console.log("wprr/WprrBaseObject.componentDidMount");
		
		let commands = this.getSourcedProp("didMountCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}
	
	componentDidUpdate() {
		//console.log("wprr/WprrBaseObject.componentDidUpdate");
		
		let commands = this.getSourcedProp("didUpdateCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}

	componentWillUnmount() {
		//console.log("wprr/WprrBaseObject.componentWillUnmount");
		
		let commands = this.getSourcedProp("willUnmountCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}
	
	_prepareInitialRender() {
		//console.log("wprr/WprrBaseObject::_prepareInitialRender");
		
		//MENOTE: should be overridden
	}
	
	_prepareRender() {
		//console.log("wprr/WprrBaseObject::_prepareRender");
		
		//MENOTE: should be overridden
	}
	
	setPartData(aName, aProps, aElement) {
		//console.log("wprr/WprrBaseObject::setPartData");
		
		//MENOTE: should be overridden
	}
	
	_setActivePart(aName) {
		//console.log("wprr/WprrBaseObject::_setActivePart");
		
		//MENOTE: should be overridden
	}
	
	_getDefaultPart() {
		return "initial";
	}
	
	_renderMainElement(aCurrentElement, aOwner) {
		//console.log("wprr/WprrBaseObject::_renderMainElement");
		let props = this.getProps();
		
		return React.createElement("wrapper", {}, props.children);
	}
	
	_replaceWrapper(aElement) {
		if(aElement && aElement.type === "wrapper") {
			let mainElementProps = this._getMainElementProps();
			mainElementProps["ref"] = this._elementRef;
			
			let renderArguments = [this._getMainElementType(), mainElementProps];
			
			if(aElement.props.children) {
				if(Array.isArray(aElement.props.children)) {
					renderArguments = renderArguments.concat(aElement.props.children);
				}
				else {
					renderArguments.push(aElement.props.children);
				}
			}
			
			return React.createElement.apply(React, renderArguments);
		}
		
		return aElement;
	}
	
	_renderSafe() {
		
		this._isRendering = true;
		
		if(!this._hasRendered) {
			this._prepareInitialRender();
		}
		
		this._prepareRender();
		
		let mainElement = this._replaceWrapper(this._renderMainElement(this, this));
		
		this._hasRendered = true;
		this._isRendering = false;
		
		return mainElement;
	}
	
	_renderErrorComponent(aError) {
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
		
		return React.createElement("div", {className: "react-error"},
			React.createElement("div", {}, "Component had an error while rendering"),
			React.createElement("div", {className: "description"}, errorString)
		);
	}
	
	render() {
		let returnObject;
		
		this.setPartData("initial", this.props, this);
		this._setActivePart("initial");
		
		if(WprrBaseObject.CATCH_RENDER_ERRORS) {
			try {
				returnObject = this._renderSafe();
			}
			catch(theError) {
				returnObject = this._renderErrorComponent(theError);
			}
		}
		else {
			returnObject = this._renderSafe();
		}
		
		this._setActivePart(this._getDefaultPart());
		
		return returnObject;
	}
}

WprrBaseObject.CATCH_RENDER_ERRORS = true;

WprrBaseObject.contextType = WprrContext;