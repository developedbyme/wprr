import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ResponsiveProps from "wprr/manipulation/measure/ResponsiveProps";
export default class ResponsiveProps extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._selectedId = "";
		this.state["responsiveProps"] = new Object();
		
		this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
	}
	
	_selectProps() {
		//console.log("wprr/manipulation/measure/ResponsiveProps::_selectProps");
		
		let currentElement = ReactDOM.findDOMNode(this);
		if(currentElement) {
			let currentWidth = currentElement.clientWidth;
		
			let selectedQueries = new Array();
			let selectedIndicies = new Array();
		
			let currentArray = this.getSourcedProp("mediaQueries");
			if(currentArray) {
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentMediaQuery = currentArray[i];
				
					if((currentMediaQuery.minWidth === undefined || currentWidth >= currentMediaQuery.minWidth) && (currentMediaQuery.maxWidth === undefined || currentWidth <= currentMediaQuery.maxWidth)) {
						selectedIndicies.push(i);
						selectedQueries.push(currentMediaQuery);
					}
				}
			}
		
			let newId = selectedIndicies.join("-");
			if(newId !== this._selectedId) {
			
				let stateResponsiveProps = new Object();
			
				let currentArray = selectedQueries;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentProps = currentArray[i]["props"];
					for(let objectName in currentProps) {
						stateResponsiveProps[objectName] = currentProps[objectName];
					}
				}
			
				this._selectedId = newId;
				this.setState({"responsiveProps": stateResponsiveProps});
			}
		}
		else {
			console.log("Element doesn't exist, can't get responsive props.", this);
		}
	}
	
	_callback_sizeChanged(aEvent) {
		//console.log("wprr/manipulation/measure/ResponsiveProps::_callback_sizeChanged");
		
		this._selectProps();
	}
	
	componentDidMount() {
		//console.log("wprr/manipulation/measure/ResponsiveProps::componentDidMount");
		
		this._selectProps();
		
		window.addEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	componentDidUpdate() {
		//console.log("wprr/manipulation/measure/ResponsiveProps::componentDidUpdate");
		
		this._selectProps();
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/measure/ResponsiveProps::componentWillUnmount");
		
		window.removeEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/measure/ResponsiveProps::_manipulateProps");
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		let responsiveProps = this.state["responsiveProps"];
		for(let objectName in responsiveProps) {
			returnObject[objectName] = responsiveProps[objectName];
		}
		
		delete aReturnObject["mediaQueries"];
		
		return returnObject;
	}
}
