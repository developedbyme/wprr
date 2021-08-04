import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';
import moment from "moment";

let cacheValue = (new Date()).valueOf();

//import TimedContent from "./TimedContent";
export default class TimedContent extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._hasAccess = Wprr.sourceValue(false);
		this._checkInterval = -1;
		
		this._checkForAccessBound = this._checkForAccess.bind(this);
	}
	
	_checkForAccess() {
		//console.log("_checkForAccess");
		
		let access = this.getFirstInput(Wprr.sourceReference("access"));
		let invert = this.getFirstInput(Wprr.sourceReference("blockData", "invert"));
		
		let hasAccess = false;
		let currentTime = moment().unix();
		
		let currentArray = access["access"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentAccess = currentArray[i];
			if((currentAccess["startAt"] === -1 || currentAccess["startAt"] <= currentTime) && (currentAccess["endAt"] === -1 || currentAccess["endAt"] > currentTime)) {
				hasAccess = currentAccess["allow"];
				break;
			}
		}
		
		if(invert) {
			hasAccess = !hasAccess;
		}
		
		if(this._hasAccess.value !== hasAccess) {
			this._hasAccess.value = hasAccess;
			
			if (document.exitFullscreen) {
			    document.exitFullscreen();
			  } else if (document.webkitExitFullscreen) { /* Safari */
			    document.webkitExitFullscreen();
			  } else if (document.msExitFullscreen) { /* IE11 */
			    document.msExitFullscreen();
			}
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		this._checkForAccess();
		this._checkInterval = setInterval(this._checkForAccessBound, 1*1000);
	}
	
	_renderMainElement() {
		//console.log("TimedContent::_renderMainElement");
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: this._hasAccess
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ContentsAndInjectedComponents, {
  content: Wprr.sourceReference("blockData", "innerMarkup"),
  parsedContent: Wprr.sourceReference("blockData", "parsedContent")
}))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"access": {
				"value": "wprr/v1/range-item/dbm_data/idSelection/default,timedAccess?ids={id}",
				"replacements": {
					"{id}": {
						"type": "reference",
						"path": "blockData",
						"deepPath": "timedContent"
					}
				}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: "Timed access"
}, /*#__PURE__*/React.createElement(Wprr.RangeSelection, {
  range: "wprr/v1/range/dbm_data/relation/default?type=timed-access"
}, /*#__PURE__*/React.createElement(Wprr.Selection, {
  value: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "timedContent")
}))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "invert",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  className: "full-width",
  valueName: "invert"
})), /*#__PURE__*/React.createElement("label", null, Wprr.translateText("Invertera matchning"))), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement(wp.editor.InnerBlocks, null), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items",
  itemClasses: "flex-resize,flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
}), /*#__PURE__*/React.createElement("div", null, Wprr.translateText("End:"), " ", Wprr.translateText("Timed content")), /*#__PURE__*/React.createElement("hr", {
  className: "line no-margin"
})));
	}
}
