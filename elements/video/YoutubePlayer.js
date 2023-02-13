import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class YoutubePlayer extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		
		let ratio = this.getFirstInputWithDefault("ratio", 9/16);
		let url = this.getFirstInput("url");
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ElementSize, null, /*#__PURE__*/React.createElement(Wprr.Adjust, {
  adjust: [Wprr.adjusts.ratio(Wprr.sourceProp("width"), ratio, "height"), Wprr.adjusts.styleFromHeight()],
  sourceUpdates: this._ratio
}, /*#__PURE__*/React.createElement("div", {
  className: "full-width"
}, /*#__PURE__*/React.createElement("iframe", {
  src: url,
  title: "YouTube video player",
  frameborder: "0",
  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowfullscreen: "",
  className: "full-size"
})))));
	}
}