import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ResponsiveProps from "wprr/manipulation/measure/ResponsiveProps";
export default class ResponsiveProps extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._selectedId = "";
		this.state["responsiveProps"] = new Object();
		
		this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
	}
	
	_selectProps() {
		//console.log("wprr/manipulation/measure/ResponsiveProps::_selectProps");
		
		var currentWidth = ReactDOM.findDOMNode(this).clientWidth;
		
		var selectedQueries = new Array();
		var selectedIndicies = new Array();
		
		var currentArray = this.getSourcedProp("mediaQueries");
		if(currentArray) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentMediaQuery = currentArray[i];
				console.log(currentMediaQuery, currentWidth);
				if((currentMediaQuery.minWidth === undefined || currentWidth >= currentMediaQuery.minWidth) && (currentMediaQuery.maxWidth === undefined || currentWidth <= currentMediaQuery.maxWidth)) {
					selectedIndicies.push(i);
					selectedQueries.push(currentMediaQuery);
				}
			}
		}
		
		var newId = selectedIndicies.join("-");
		if(newId !== this._selectedId) {
			
			var stateResponsiveProps = new Object();
			
			var currentArray = selectedQueries;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentProps = currentArray[i]["props"];
				for(var objectName in currentProps) {
					stateResponsiveProps[objectName] = currentProps[objectName];
				}
			}
			
			this._selectedId = newId;
			this.setState({"responsiveProps": stateResponsiveProps});
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
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		var responsiveProps = this.state["responsiveProps"];
		for(var objectName in responsiveProps) {
			returnObject[objectName] = responsiveProps[objectName];
		}
		
		delete aReturnObject["mediaQueries"];
		
		return returnObject;
	}
}
