import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import BlockInjectionFunctions from "wprr/wp/blocks/BlockInjectionFunctions";
export default class BlockInjectionFunctions {
	
	static addBlock(aName, aElement, aReferenceHolder) {
		
		let injectFunction = function(aData, aItemKey, aReferences, aReturnArray) {
			let returnElement = React.createElement(Wprr.ReferenceInjection, {"key": aItemKey, "injectData": {"blockData": aData}}, aElement);
			
			aReturnArray.push(returnElement);
		}
		
		aReferenceHolder.addObject("contentCreators/inject/" + aName, injectFunction);
	}
}