import Wprr from "wprr/Wprr";

import * as elements from "wprr/elements";
import * as commands from "wprr/commands";
import * as utils from "wprr/utils";

//Elements
{
	for(let objectName in elements) {
		Wprr.addAutonamedClasses(elements[objectName]);
	}
}

//Commands
{
	for(let objectName in commands) {
		Wprr.addCommand(objectName, commands[objectName]);
	}
}

//Utils
{
	for(let objectName in utils) {
		Wprr.addUtil(objectName, utils[objectName]);
	}
}

export default Wprr;
export * from "wprr/elements";
export {commands as commands};
export {utils as utils};