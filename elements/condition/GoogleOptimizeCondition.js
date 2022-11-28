import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import GoogleOptimizeCondition from "./GoogleOptimizeCondition";
export default class GoogleOptimizeCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["show"] = false;
		
		this._timeout = -1;
		this._callback_optimizeDataBound = this._callback_optimizeData.bind(this);
		this._callback_timeoutBound = this._callback_timeout.bind(this);
	}
	
	_callback_timeout() {
		//console.log("GoogleOptimizeCondition::_callback_timeout");
		this._timeout = -1;
		this.setState({"show": true});
	}
	
	_callback_optimizeData(aVariant, aExperimentId) {
		//console.log("GoogleOptimizeCondition::_callback_optimizeData");
		
		if(this._timeout !== -1) {
			clearTimeout(this._timeout);
			this._timeout = -1;
		}
		
		let variant = objectPath.get(this.getReference("blockData"), "variant");
		
		if(variant == aVariant) {
			this.setState({"show": true});
		}
		else {
			this.setState({"show": false});
		}
	}
	
	_addToDataLayer() {
		//console.log("GoogleOptimizeCondition::_addToDataLayer");
		
		if(dataLayer) {
			dataLayer.push(arguments);
		}
	}
	
	componentDidMount() {
		//console.log("GoogleOptimizeCondition::componentDidMount");
		super.componentDidMount();
		
		let experimentId = objectPath.get(this.getReference("blockData"), "experimentId");
		
		let isDefault = objectPath.get(this.getReference("blockData"), "isDefault");
		if(isDefault) {
			let seconds = parseFloat(objectPath.get(this.getReference("blockData"), "defaultTimeout"));
			if(isNaN(seconds)) {
				console.error("Seconds is not a number", objectPath.get(this.getReference("blockData"), "defaultTimeout"), this);
				seconds = 4;
			}
			this._timeout = setTimeout(this._callback_timeoutBound, Math.round(seconds*1000));
		}
		
		this._addToDataLayer('event', 'optimize.callback', {
			name: experimentId,
			callback: this._callback_optimizeDataBound
		});
	}
	
	_renderMainElement() {
		//console.log("GoogleOptimizeCondition::_renderMainElement");
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: this.state["show"]
}, /*#__PURE__*/React.createElement(Wprr.ContentsAndInjectedComponents, {
  content: Wprr.sourceReference("blockData", "innerMarkup")
})));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Google optimize condition")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing",
  itemClasses: "width-70,width-30"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Experiment id")), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "experimentId",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "experimentId",
  className: "full-width"
}))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Variant")), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "variant",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "variant",
  className: "full-width"
})))), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "isDefault",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  valueName: "isDefault"
})), /*#__PURE__*/React.createElement("span", null, Wprr.translateText("Show by default after ")), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "defaultTimeout",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  type: "number",
  valueName: "defaultTimeout"
})), /*#__PURE__*/React.createElement("span", null, Wprr.translateText(" seconds if experiment doesn't exist or is too slow to load."))), /*#__PURE__*/React.createElement(wp.editor.InnerBlocks, null), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("Slut:"), " ", Wprr.translateText("Google optimize condition")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})));
	}
}
