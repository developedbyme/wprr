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
	
	static addBlockFromModule(aBlocks, aReferenceHolder) {
		let mappedBlocks = Wprr.utils.array.getPathsInObject(aBlocks);
		let currentArray = mappedBlocks;
		let currentArrayLength = currentArray.length;
	
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			let blockName = Wprr.utils.programmingLanguage.convertToCamelCase(currentObject.key);
			
			let element = React.createElement(currentObject.value, {});
			let elementWithInjection = React.createElement(Wprr.layout.BlockLoader, {}, element);
			
			Wprr.utils.blockInjection.addBlock(blockName, elementWithInjection, aReferenceHolder);
		}
	}
}