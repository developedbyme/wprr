import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class VimeoPlayer extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	componentDidMount() {
		super.componentDidMount();
		
		wprr.loadScript("https://player.vimeo.com/api/player.js", Wprr.commands.callFunction(this, this._playerScriptLoaded));
		
	}
	
	_playerScriptLoaded() {
		console.log("_playerScriptLoaded");
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
  frameborder: "0",
  allow: "autoplay; fullscreen; picture-in-picture",
  allowfullscreen: true,
  className: "full-size"
})))));
	}
}