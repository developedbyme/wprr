import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import moment from "moment";

export default class AddDbmType extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._updatedIds = Wprr.sourceValue([]);
		this._type = Wprr.sourceValue(0);
	}
	
	_update() {
		//console.log("_update");
		
		let selectedIds = this.getFirstInput(Wprr.sourceReference("externalStorage", "selection"));
		let items = this.getFirstInput(Wprr.sourceReference("items"));
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loadingSequence = Wprr.utils.loading.LoadingSequence.create();
		
		let currentValue = this._type.getValue();
		
		let currentArray = selectedIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			let currentItem = items.getItem(currentId);
			
			let currentLoader = project.getEditLoader(currentId);
			currentLoader.changeData.createChange("addTerms", {"value": [currentValue], "field": "id", "taxonomy": "dbm_type"});
			loadingSequence.addLoader(currentLoader);
		}
		
		loadingSequence.load();
	}
	
	_renderMainElement() {
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.TermSelection, {
  value: this._type,
  taxonomy: "dbm_type"
}), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this._update)
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding"
}, Wprr.translateText("Add terms")))));
	}
}
