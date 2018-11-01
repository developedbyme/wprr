import Wprr from "wprr/Wprr";

import * as elements from "wprr/elements";
import * as injections from "wprr/injections";
import * as commands from "wprr/commands";
import * as utils from "wprr/utils";
import * as creators from "wprr/creators";
import * as adjusts from "wprr/adjusts";

let BaseObject = elements.WprrBaseObject;
let DataLoader = elements.WprrDataLoader;
let Validation = elements.ValidationBaseObject;
let AddProps = elements.ManipulationBaseObject;

//Elements
{
	for(let objectName in elements) {
		Wprr.addAutonamedClasses(elements[objectName]);
	}
	
	Wprr.addClass("BaseObject", BaseObject);
	Wprr.addClass("DataLoader", DataLoader);
	Wprr.addClass("Validation", Validation);
	Wprr.addClass("AddProps", AddProps);
}

//Injections
{
	for(let objectName in injections) {
		Wprr.addAutonamedClasses(injections[objectName]);
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

//Creators
{
	for(let objectName in creators) {
		Wprr.addCreator(objectName, creators[objectName]);
	}
}

//Adjusts
{
	for(let objectName in adjusts) {
		Wprr.addAdjust(objectName, adjusts[objectName]);
	}
}

export default Wprr;
export * from "wprr/elements";
export {BaseObject, DataLoader, Validation, AddProps};
export {commands as commands};
export {utils as utils};
export {creators as creators};
export {adjusts as adjusts};