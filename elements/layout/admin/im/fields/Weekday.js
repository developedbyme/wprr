import Wprr from "wprr";
import React from "react";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Weekday extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let cellSettings = this.getReference("cellSettings");
		
		let tempMoment = moment();
		let options = new Array();
		options.push({"value": null, "label": this.translate("Select")});
		
		for(let i = 1; i < 7; i++) {
			options.push({"value": i, "label": tempMoment.weekday(i).format("dddd")});
		}
		options.push({"value": 0, "label": tempMoment.weekday(0).format("dddd")});
		
		return React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
			React.createElement(Wprr.Selection, {
				valueName: "value",
				className: "full-width",
				"options": options
			})
		);
	}
}