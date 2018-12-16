import React from "react";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

import SourceData from "wprr/reference/SourceData";
import PostData from "wprr/wp/postdata/PostData";

//import PostDataInjection from "wprr/wp/postdata/PostDataInjection";
export default class PostDataInjection extends ReferenceInjection {

	constructor(aProps) {
		super(aProps);
		
		this._postData = new PostData();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/wp/postdata/PostDataInjection::_removeUsedProps");
		
		delete aReturnObject["postData"];
		delete aReturnObject["injectionName"];
		
		return aReturnObject;
	}
	
	_getInjectData() {
		//console.log("wprr/wp/postdata/PostDataInjection::_getInjectData");
		
		let returnObject = new Object();
		
		let postData = this.getSourcedProp("postData");
		
		let prefix = "wprr/postData";
		let injectionName = this.getSourcedProp("injectionName");
		if(injectionName) {
			prefix = injectionName;
		}
		
		if(postData) {
			this._postData.setData(postData);
			returnObject[prefix] = this._postData;
			returnObject[prefix + "/meta"] = postData.meta;
			returnObject[prefix + "/acfObject"] = postData.acf;
		}
		else {
			console.error("No post data provided.", this);
		}
		
		return returnObject;
	}
}
