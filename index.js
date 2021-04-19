import Wprr from "wprr/Wprr";

import * as elements from "wprr/elements";
import * as injections from "wprr/injections";
import * as commands from "wprr/commands";
import * as utils from "wprr/utils";
import * as creators from "wprr/creators";
import * as adjusts from "wprr/adjusts";
import * as qualifications from "wprr/qualifications";
import * as wp from "wprr/wp";
import * as routing from "wprr/routing";
import * as core from "wprr/core";

let BaseObject = elements.WprrBaseObject;
let DataLoader = elements.WprrDataLoader;
let Validation = elements.ValidationBaseObject;
let AddProps = elements.ManipulationBaseObject;

//Elements
{
	for(let objectName in elements) {
		Wprr.addClass(objectName, elements[objectName]);
	}
	
	Wprr.addClass("BaseObject", BaseObject);
	Wprr.addClass("DataLoader", DataLoader);
	Wprr.addClass("Validation", Validation);
	Wprr.addClass("AddProps", AddProps);
}

//Injections
{
	for(let objectName in injections) {
		Wprr.addClass(objectName, injections[objectName]);
	}
}

Wprr.addAllItems("commands", commands);
Wprr.addAllItems("utils", utils);
Wprr.addAllItems("creators", creators);
Wprr.addAllItems("adjusts", adjusts);
Wprr.addAllItems("qualifications", qualifications);
Wprr.addAllItems("wp", wp);
Wprr.addAllItems("routing", routing);
Wprr.addAllItems("core", core);

export default Wprr;
export * from "wprr/elements";
export {BaseObject, DataLoader, Validation, AddProps};
export {commands as commands};
export {utils as utils};
export {creators as creators};
export {adjusts as adjusts};
export {qualifications as qualifications};
export {wp as wp};
export {routing as routing};
export {core as core};