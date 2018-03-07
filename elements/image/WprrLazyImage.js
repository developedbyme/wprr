import React from 'react';

import LazyImage from "wprr/elements/image/LazyImage";

//import WprrLazyImage from "wprr/elements/image/WprrLazyImage";
export default class WprrLazyImage extends LazyImage {

	constructor (props) {
		super(props);
	}
	
	_getImageData() {
		
		let data = this.getSourcedProp("data");
		
		if(!data) {
			console.warn("Image doesn't have any data.", this);
			
			return null;
		}
		
		return data.sizes;
	}
}
