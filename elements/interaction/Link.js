import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import Link from "wprr/elements/interaction/Link";
export default class Link extends WprrBaseObject {

	_construct() {
		super._construct();
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["href"];
		delete aReturnObject["prefix"];
		delete aReturnObject["target"];
		
		delete aReturnObject["preload"];
	}
	
	_prepareRender() {
		
		super._prepareRender();
		
		let preload = this.getFirstInput("preload");
		if(preload) {
			let siteNavigation = this.getFirstInput(Wprr.sourceReference("wprr/siteNavigation"));
			if(siteNavigation) {
				siteNavigation.preload(this.getUrl());
			}
		}
	}
	
	getUrl() {
		let href = this.getFirstInput("href");
		if(href) {
			let prefix = this.getFirstInput("prefix");
			if(prefix) {
				href = prefix + href;
			}
		}
		
		return href;
	}
	
	_renderMainElement() {
		
		let newProps = new Object();
		newProps["href"] = this.getUrl();
		
		let target = this.getFirstInput("target");
		if(target) {
			newProps["target"] = target;
		}
		
		let download = this.getFirstInput("download");
		if(download) {
			newProps["download"] = download;
		}
		
		return React.createElement("a", newProps, this.props.children);
	}
}