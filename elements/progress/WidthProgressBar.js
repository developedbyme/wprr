import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import WidthProgressBar from "wprr/elements/progress/WidthProgressBar";
export default class WidthProgressBar extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("progress-bar width-progress-bar absolute-container");
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/progress/WidthProgressBar::_renderMainElement");
		
		let customIndicatorClasses = this.getSourcedProp("indicatorClassName");
		let indicatorClasses = "indicator full-height";
		if(customIndicatorClasses) {
			indicatorClasses += " " + customIndicatorClasses;
		}
		
		let startValue = this.getSourcedPropWithDefault("startValue", 0);
		let endValue = this.getSourcedPropWithDefault("endValue", 1);
		let progress = this.getSourcedProp("progress");
		
		let width = (100*Math.max(0, Math.min(1, (progress-startValue)/(endValue-startValue)))) + "%";
		
		return React.createElement("wrapper", {},
			React.createElement("div", {"className": indicatorClasses, "style": {"width": width}})
		);
	}

}
