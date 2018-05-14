import React from "react";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

import SourceData from "wprr/reference/SourceData";
import PostData from "wprr/wp/postdata/PostData";

//import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
export default class PostDataInjection extends ReferenceInjection {

	constructor (props) {
		super(props);
		
		this._postData = new PostData();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/postdata/PostDataInjection::_removeUsedProps");
		
		delete aReturnObject["postData"];
		
		return aReturnObject;
	}
	
	_getInjectData() {
		//console.log("wprr/wp/postdata/PostDataInjection::_getInjectData");
		
		let returnObject = new Object();
		
		let postData = this.getSourcedProp("postData");
		
		if(postData) {
			this._postData.setData(postData);
			returnObject["wprr/postData"] = this._postData;
			returnObject["wprr/postData/meta"] = postData.meta;
			returnObject["wprr/postData/acfObject"] = postData.acf;
		}
		else {
			console.error("No post data provided.", this);
		}
		
		return returnObject;
	}
}
