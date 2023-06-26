import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import WidthProgressBar from "wprr/elements/progress/WidthProgressBar";
export default class WidthProgressBar extends WprrBaseObject {

	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/progress/WidthProgressBar::_renderMainElement");
		
		let customIndicatorClasses = this.getFirstInput("indicatorClassName");
		let indicatorClasses = "indicator full-height";
		if(customIndicatorClasses) {
			indicatorClasses += " " + customIndicatorClasses;
		}
		
		let startValue = this.getFirstInputWithDefault("startValue", 0);
		let endValue = this.getFirstInputWithDefault("endValue", 1);
		let progress = this.getFirstInput("progress");
		
		let width = (100*Math.max(0, Math.min(1, (progress-startValue)/(endValue-startValue)))) + "%";
		
		let children = this.props.dynamicChildren ? this.getFirstInput("dynamicChildren") : this.props.children;
		
		return React.createElement("div", {"className": "progress-bar width-progress-bar absolute-container"},
			React.createElement("div", {"className": indicatorClasses, "style": {"width": width}}, children)
		);
	}

}
