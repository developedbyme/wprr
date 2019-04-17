import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

import BlockInjection from "wprr/wp/blocks/BlockInjection";

// import BlockInjectionFunctions from "wprr/wp/blocks/BlockInjectionFunctions";
export default class BlockInjectionFunctions {
	
	static addBlock(aName, aElement, aReferenceHolder) {
		
		let newInjection = new BlockInjection();
		
		newInjection.setElement(aElement);
		
		aReferenceHolder.addObject("contentCreators/inject/" + aName, newInjection.inject);
		
		return newInjection;
	}
}