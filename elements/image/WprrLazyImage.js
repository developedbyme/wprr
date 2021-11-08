import React from 'react';
import Wprr from "wprr/Wprr";

import LazyImage from "wprr/elements/image/LazyImage";

//import WprrLazyImage from "wprr/elements/image/WprrLazyImage";
export default class WprrLazyImage extends LazyImage {

	constructor(aProps) {
		super(aProps);
	}
	
	_getImageData() {
		
		let data = this.getFirstInput("data");
		
		if(!data) {
			console.warn("Image doesn't have any data.", this);
			
			return null;
		}
		
		return Wprr.objectPath(data, "sizes");
	}
}
