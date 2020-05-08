import React from 'react';

import WprrBaseObject from "wprr/WprrBaseObject";

import Part from "wprr/elements/abstract/Part";

//import MultipleRenderObject from "wprr/elements/abstract/MultipleRenderObject";
export default class MultipleRenderObject extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._partData = new Object();
		this._activePart = "initial";
	}
	
	useElementReplacement() {
		return false;
	}
	
	getProps() {
		return this.getActivePart().props;
	}
	
	getContext() {
		return this.getActivePart().element.context;
	}
	
	_missingRenderFunction() {
		return React.createElement("div", {}, "Missing render function");
	}
	
	getRenderFunction(aType) {
		
		let renderFunction = this["_renderPart_" + aType];
		if(renderFunction) {
			return renderFunction;
		}
		
		console.error("Missing render function " + aType);
		return this._missingRenderFunction;
	}
	
	setPartData(aName, aProps, aElement) {
		if(!this._partData[aName]) {
			this._partData[aName] = new Object();
		}
		
		let currentData = this._partData[aName];
		
		let newProps = new Object();
		
		let initialProps = this.getPartByName("initial").props;
		for(let objectName in initialProps) {
			if(objectName !== "children") {
				newProps[objectName] = initialProps[objectName];
			}
		}
		for(let objectName in aProps) {
			newProps[objectName] = aProps[objectName];
		}
		
		currentData["props"] = newProps;
		currentData["element"] = aElement;
	}
	
	_setActivePart(aName) {
		this._activePart = aName;
	}
	
	getActivePart() {
		return this._partData[this._activePart];
	}
	
	getPartByName(aName) {
		return this._partData[aName];
	}
	
	renderPart(aName, aType, aProps, aElement) {
		this.setPartData(aName, aProps, aElement);
		this._setActivePart(aName);
		
		let returnElement = null;
		try {
			let renderFunction = this.getRenderFunction(aType);
			
			returnElement = this._replaceWrapper(renderFunction.call(this, aElement, this));
		}
		catch(theError) {
			returnElement = this._renderErrorComponent(theError);
		}
		
		this._setActivePart(this._getDefaultPart());
		
		return returnElement;
	}
	
	createPartElement(aPart, aType = null, aAdditionalProps = null) {
		let newProps = new Object();
		newProps['part'] = aPart;
		if(aType) {
			newProps['type'] = aType;
		}
		newProps['owner'] = this;
		if(aAdditionalProps) {
			for(let objectName in aAdditionalProps) {
				newProps[objectName] = aAdditionalProps[objectName]
			}
		}
		
		return React.createElement(Part, newProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Part, {"part": "main", "owner": this}, this.props.children);
	}
}
