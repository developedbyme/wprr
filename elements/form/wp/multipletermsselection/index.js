import * as parts from "./parts/parts.js";
export {parts};

import circular from "./parts/parts-circular.js";
for(let objectName in parts) {
	circular[objectName] = parts[objectName];
}

export {default as MultipleTermsSelection} from "./MultipleTermsSelection";