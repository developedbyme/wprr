import React from 'react';
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactVisibleUpdater from "wprr/imageloader/ReactVisibleUpdater";

//import ScrollActivatedItem from "wprr/manipulation/measure/ScrollActivatedItem";
export default class ScrollActivatedItem extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["isVisible"] = false;
		
		this._updater = null;
	}
	
	componentDidMount() {
		console.log("wprr/manipulation/measure/ScrollActivatedItem::componentDidMount");
		
		let imageLoaderManager = this.getReference("wprr/imageLoaderManager");
		
		this._updater = ReactVisibleUpdater.create(this, ReactDOM.findDOMNode(this), imageLoaderManager);
		imageLoaderManager.addUpdater(this._updater);
		
		super.componentDidMount();
	}

	componentWillUnmount() {
		console.log("wprr/manipulation/measure/ScrollActivatedItem::componentWillUnmount");
		
		let imageLoaderManager = this.getReference("wprr/imageLoaderManager");
		
		imageLoaderManager.removeUpdater(this._updater);
		this._updater = null;
		
		super.componentWillUnmount();
	}
	
	_renderMainElement() {
		if(this.state["isVisible"]) {
			return React.createElement("wrapper", {}, this.props.children);
		}
		return React.createElement("wrapper");
	}
}
