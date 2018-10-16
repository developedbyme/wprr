import Wprr from "wprr/Wprr";

export default Wprr;

import * as elements from "wprr/elements";

for(let objectName in elements) {
	Wprr.addAutonamedClasses(elements[objectName]);
}

export * from "wprr/elements";