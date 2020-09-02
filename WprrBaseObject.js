import React from "react";
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import WprrContext from "wprr/reference/WprrContext";

import CommandPerformer from "wprr/commands/CommandPerformer";
import UrlResolver from "wprr/utils/UrlResolver";

//import WprrBaseObject from "wprr/WprrBaseObject";
export default class WprrBaseObject extends React.Component {
	
	constructor(aProps) {
		//console.log("WprrBaseObject::constructor");
		
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
		
		this._registeredSources = new Object();
		this._sourceChangeIndex = 0;
	}
	
	_updateSourceRegistration() {
		
		if(Wprr.settings_enableSourceRegistration) {
			let props = this.props;
			let newSources = new Array();
			let oldSources = this._registeredSources;
			let registeredSources = new Object();
			
			let updateSources = new Array();
			
			for(let objectName in props) {
				if(objectName === "sourceUpdates") {
					let currentArray = Wprr.utils.array.singleOrArray(props[objectName]);
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let name = "sourceUpdates_" + i;
						let currentUpdateProp = currentArray[i];
						
						registeredSources[name] = currentUpdateProp;
						if(oldSources[name] === registeredSources[name]) {
							delete oldSources[name];
						}
						else {
							newSources.push(currentUpdateProp);
							if(currentUpdateProp instanceof SourceData) {
								updateSources.push(currentUpdateProp);
							}
						}
					}
				}
				
				let currentProp = props[objectName];
				if(currentProp instanceof SourceData) {
					registeredSources[objectName] = currentProp;
					if(oldSources[objectName] === registeredSources[objectName]) {
						delete oldSources[objectName];
					}
					else {
						newSources.push(currentProp);
					}
				}
			}
		
			this._registeredSources = registeredSources;
			this._addSources(newSources);
			this._removeSourcesFromObject(oldSources);
			
			{
				let currentArray = updateSources;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					currentArray[i].getSource(this);
				}
			}
		}
		
		return this;
	}
	
	_addSources(aSources) {
		let currentArray = aSources;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSource = currentArray[i];
			currentSource.addOwner(this);
		}
		
		return this;
	}
	
	_removeSourcesFromObject(aSources) {
		for(let objectName in aSources) {
			let currentSource = aSources[objectName];
			currentSource.removeOwner(this);
		}
		
		return this;
	}
	
	_removeAllSources() {
		
		this._removeSourcesFromObject(this._registeredSources);
		this._registeredSources = new Object();
		
		return this;
	}
	
	updateForSourceChange() {
		
		let currentIndex = this.state["wprrSourceUpdateIndex"];
		let nextIndex = this._sourceChangeIndex+1;
		if(nextIndex !== currentIndex) {
			this._sourceChangeIndex = nextIndex;
			this.setState({"wprrSourceUpdateIndex": nextIndex});
		}
		
		return this;
	}
	
	useElementReplacement() {
		return true;
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
	
	getRefSource(aName) {
		return Wprr.source("command", Wprr.commands.callFunction(this, this.getRef, [aName]));
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
	
	getReference(aPath, aDeepPath = null) {
		
		let theReference = this.getContext().references.getObject(aPath);
		
		if(aDeepPath) {
			return SourceDataWithPath.getDeepPathValue(theReference, aDeepPath);
		}
		
		return theReference;
	}
	
	getWprrUrl(aPath, aBaseLocation = "rest") {
		
		let baseReferencePath = "wprr/paths/";
		let referencePath =  baseReferencePath + aBaseLocation;
		
		let baseUrl = this.getReference(referencePath);
		if(!baseUrl) {
			console.warn("No base url for location " + aBaseLocation + " (" + referencePath + ")");
			return aPath;
		}
		
		let tempUrlResolver = UrlResolver.tempUrlResolver;
		tempUrlResolver.setupBaseUrlFromPath(baseUrl);
		return tempUrlResolver.getAbsolutePath(aPath);
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
	
	getInput(aPropNameOrSource) {
		//console.log("WprrBaseObject::getInput");
		//console.log(aPropNameOrSource);
		
		if(typeof(aPropNameOrSource) === 'string') {
			return this.getSourcedProp(aPropNameOrSource);
		}
		return this.resolveSourcedData(aPropNameOrSource);
	}
	
	getFirstInput(...aArguments) {
		let currentArray = aArguments;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentInput = currentArray[i];
			let resolvedValue = this.getInput(currentInput);
			if(resolvedValue !== null && resolvedValue !== undefined) {
				return resolvedValue;
			}
		}
		
		return null;
	}
	
	getFirstInputWithDefault(...aArguments) {
		let currentArray = aArguments;
		let currentArrayLength = currentArray.length-1; //MENOTE: skip last item as it is the default
		for(let i = 0; i < currentArrayLength; i++) {
			let currentInput = currentArray[i];
			let resolvedValue = this.getInput(currentInput);
			if(resolvedValue !== null && resolvedValue !== undefined) {
				return resolvedValue;
			}
		}
		
		if(currentArray.length > 0) {
			return currentArray[currentArrayLength];
		}
		
		return null;
	}
	
	getFirstValidSource(...aArguments) {
		return this.getFirstValidSourceInArray(aArguments);
	}
	
	getFirstValidSourceIfExists(...aArguments) {
		return this.getFirstValidSourceInArray(aArguments, false);
	}
	
	getFirstValidSourceInArray(aSources, aWarnIfNoResult = true) {
		let currentArray = aSources;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSource = currentArray[i];
			let resolvedValue = this.resolveSourcedData(currentSource);
			if(resolvedValue !== null && resolvedValue !== undefined) {
				return resolvedValue;
			}
		}
		
		if(aWarnIfNoResult) {
			console.warn("No sourced resolved", aSources, this);
		}
		return null;
	}
	
	resolveSourcedData(aData) {
		//console.log("wprr/WprrBaseObject::resolveSourcedData");
		//console.log(aData);
		
		if(aData && aData.getSourceInStateChange) {
			return aData.getSourceInStateChange(this, {"props": this.getProps(), "state": this.state});
		}
		else if(aData && aData.getSource) {
			console.warn("Source can't handle state change.", aData, this);
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
	
	getSourcedPropInAdjust(aPropName, aProps) {
		return this.getSourcedPropInStateChange(aPropName, {"state": this.state, "props": aProps});
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
	
	_overrideElementType(aDefaultType) {
		let overrideType = this.getSourcedProp("overrideMainElementType");
		if(overrideType) {
			return overrideType;
		}
		return aDefaultType;
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
				let currentStyleObject = this.resolveSourcedData(props[objectName]);
				let newStyleObject = new Object();
				for(let styleProperty in currentStyleObject) {
					newStyleObject[styleProperty] = currentStyleObject[styleProperty];
				}
				
				aReturnObject[objectName] = newStyleObject;
			}
		}
	}
	
	_removeUsedProps(aReturnObject) {
		//MENOTE: should be overridden
		
		delete aReturnObject["sourceUpdates"];
		
		return aReturnObject;
	}
	
	_copyAllProps(aReturnObject) {
		let props = this.getProps();
		
		for(let objectName in props) {
			switch(objectName) {
				case "overrideMainElementType":
				case "didMountCommands":
				case "didUpdateCommands":
				case "willUnmountCommands":
				case "prepareRenderCommands":
				case "prepareInitialRenderCommands":
					//MENOTE: these should not copy
					break;
				case "children":
				case "className":
					//MENOTE: merged in other places: _getMainElementClassNames for className and _replaceWrapper children
					break;
				case "style":
					let currentStyleObject = props[objectName];
					let newStyleObject = new Object();
					for(let styleProperty in currentStyleObject) {
						newStyleObject[styleProperty] = currentStyleObject[styleProperty];
					}
					
					aReturnObject[objectName] = newStyleObject;
					break;
				default:
					aReturnObject[objectName] = props[objectName];
			}
		}
		
		this._removeUsedProps(aReturnObject);
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
	
	_getAllMainElementProps() {
		let returnObject = new Object();
		
		let classNames = this._getMainElementClassNames();
		
		if(classNames.length > 0) {
			returnObject["className"] = classNames.join(" ");
		}
		
		this._copyAllProps(returnObject);
		
		return returnObject;
	}
	
	_mergeInObjectElementProps(aReturnObject, aPropsToMergeIn) {
		for(let objectName in aPropsToMergeIn) {
			switch(objectName) {
				case "children":
					//MENOTE: handled in _replaceWrapper
					break;
				case "className":
					if(!aReturnObject[objectName]) {
						aReturnObject[objectName] = "";
					}
					else {
						aReturnObject[objectName] += " ";
					}
					aReturnObject[objectName] += aPropsToMergeIn[objectName];
					break;
				case "style":
					if(!aReturnObject[objectName]) {
						aReturnObject[objectName] = new Object();
					}
					let currentStyleObject = aPropsToMergeIn[objectName];
					let newStyleObject = aReturnObject[objectName];
					for(let styleProperty in currentStyleObject) {
						if(newStyleObject[objectName] === undefined) {
							newStyleObject[styleProperty] = currentStyleObject[styleProperty];
						}
					}
					break;
				default:
					if(aReturnObject[objectName] === undefined) {
						aReturnObject[objectName] = aPropsToMergeIn[objectName];
					}
					break;
			}
		}
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
		
		this._updateSourceRegistration();
		
		let commands = this.getSourcedProp("didMountCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}
	
	componentDidUpdate() {
		//console.log("wprr/WprrBaseObject.componentDidUpdate");
		
		this._updateSourceRegistration();
		
		let commands = this.getSourcedProp("didUpdateCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}

	componentWillUnmount() {
		//console.log("wprr/WprrBaseObject.componentWillUnmount");
		
		this._removeAllSources();
		
		let commands = this.getSourcedProp("willUnmountCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}
	
	_prepareInitialRender() {
		//console.log("wprr/WprrBaseObject::_prepareInitialRender");
		
		let commands = this.getSourcedProp("prepareInitialRenderCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
	}
	
	_prepareRender() {
		//console.log("wprr/WprrBaseObject::_prepareRender");
		
		let commands = this.getSourcedProp("prepareRenderCommands");
		if(commands) {
			CommandPerformer.perform(commands, null, this);
		}
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
		if(aElement) {
			if(aElement.type === "wrapper") {
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
			
			if(aElement.type) {
				if(aElement.type !== React.Fragment && this.useElementReplacement()) {
					
					let mainElementProps;
					
					if(typeof(aElement.type) === "string") {
						mainElementProps = this._getMainElementProps();
						this._mergeInObjectElementProps(mainElementProps, aElement.props);
					}
					else {
						mainElementProps = this._getAllMainElementProps();
						this._mergeInObjectElementProps(mainElementProps, aElement.props);
					}
					
					let elementType = this._overrideElementType(aElement.type);
					let renderArguments = [elementType, mainElementProps];
					
					if(aElement.props.children) {
						if(Array.isArray(aElement.props.children)) {
							renderArguments = renderArguments.concat(aElement.props.children);
						}
						else {
							renderArguments.push(aElement.props.children);
						}
					}
					
					if(!mainElementProps["ref"]) {
						mainElementProps["ref"] = this._elementRef;
					}
					
					return React.createElement.apply(React, renderArguments);
				}
			}
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