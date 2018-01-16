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
	}
	
	getReferences() {
		return this.context.references;
	}
	
	getReference(aPath) {
		return this.context.references.getObject(aPath);
	}
	
	getPropWithDefault(aPropName, aDefaultValue) {
		if(this.props[aPropName] !== undefined) {
			return this.props[aPropName];
		}
		return aDefaultValue;
	}
	
	resolveSourcedData(aData) {
		//console.log(aData, aData instanceof SourceData);
		if(aData instanceof SourceData) {
			return aData.getSource(this);
		}
		
		return aData;
	}
	
	resolveSourcedDataInStateChange(aData, aNewPropsAndState) {
		if(aData instanceof SourceData) {
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
		if(this.props.overrideMainElementType) {
			return this.props.overrideMainElementType;
		}
		return this._mainElementType;
	}
	
	_getMainElementClassNames() {
		var returnArray = new Array();
		
		if(this.props.className) {
			returnArray.push(this.props.className);
		}
		
		var currentArray = this._classNames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]);
		}
		
		return returnArray;
	}
	
	_copyPassthroughProps(aReturnObject) {
		for(var objectName in this.props) {
			//MENOTE: copy all data attributes
			if(objectName.indexOf("data-") === 0) {
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
		var returnObject = new Object();
		
		var classNames = this._getMainElementClassNames();
		
		if(classNames.length > 0) {
			returnObject["className"] = classNames.join(" ");
		}
		
		this._copyPassthroughProps(returnObject);
		
		return returnObject;
	}
	
	shouldComponentUpdate(aNextProps, aNextStates) {
		//console.log("wprr/WprrBaseObject::shouldComponentUpdate");
		
		var returnValue = true;
		
		if(this._propsToCheckForUpdate !== null || this._statesToCheckForUpdate !== null) {
			returnValue = false;
			
			if(this._propsToCheckForUpdate !== null && !returnValue && aNextProps) {
				var currentArray = this._propsToCheckForUpdate;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentPropName = currentArray[i];
				
					if(this.props[currentPropName] != aNextProps[currentPropName]) {
						returnValue = true;
						break;
					}
				}
			}
		
		
			if(this._statesToCheckForUpdate !== null && !returnValue && aNextStates) {
				var currentArray = this._statesToCheckForUpdate;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentStateName = currentArray[i];
					
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
		
	}
	
	_renderMainElement() {
		//console.log("wprr/WprrBaseObject::_renderMainElement");
		
		return <wrapper />;
	}
	
	_renderSafe() {
		
		this._prepareRender();
		
		var mainElement = this._renderMainElement();
		
		if(mainElement && mainElement.type === "wrapper") {
			var renderArguments = [this._getMainElementType(), this._getMainElementProps()];
			
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
		var returnObject;
		if(WprrBaseObject.CATCH_RENDER_ERRORS) {
			try {
				returnObject = this._renderSafe();
			}
			catch(aError) {
				var errorProperties = new Array();
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
		
				var errorString = aError.message +" (" + errorProperties.join(", ") + ")";
		
				console.error(this, aError, errorString);
				
				returnObject = <div className="react-error">
					<div>Component had an error while rendering</div>
					<div className="description">{errorString}</div>
				</div>;
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