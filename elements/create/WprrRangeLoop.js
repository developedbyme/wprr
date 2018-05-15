import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import Loop from "wprr/elements/create/Loop";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import RangeDataInjection from "wprr/wp/postdata/RangeDataInjection";
import SourceData from "wprr/reference/SourceData";

//import WprrRangeLoop from "wprr/elements/create/WprrRangeLoop";
export default class WprrRangeLoop extends ManipulationBaseObject {
	
	constructor(props) {
		super(props);
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aReturnObject	Object	The props object that should be adjusted
	 */
	_removeUsedProps(aReturnObject) {
		//METODO: change this to actual source cleanup
		aReturnObject = super._removeUsedProps(aReturnObject);
		delete aReturnObject["range"];
		delete aReturnObject["markup"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		let markup = this.getSourcedProp("markup");
		
		let injectedMarkup = <RangeDataInjection rangeData={SourceData.create("reference", "loop/item")}>
			{markup}
			</RangeDataInjection>;
		
		let loop;
		if(children && children.length > 0) {
			loop = <Loop loop={MarkupLoop.create()} markup={injectedMarkup}>
				{children}
			</Loop>;
		}
		else {
			loop = <Loop loop={MarkupLoop.create()} markup={injectedMarkup} />;
		}
		
		console.log(children);
		//{children}
		
		let range = this.getSourcedProp("range");
		
		
		return [<WprrDataLoader loadData={{"input": "m-router-data/v1/" + range}}>
			{loop}
		</WprrDataLoader>];
	}
}