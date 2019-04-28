import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import StatusSection from "wprr/elements/area/selectsections/StatusSection";
export default class StatusSection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/StatusGroup::_removeUsedProps");
		
		delete aReturnObject["statusName"];
		delete aReturnObject["externalStorage"];
		
		return aReturnObject;
	}
	
	_renderClonedElement() {
		//console.log("wprr/elements/area/selectsections/StatusSection::_renderClonedElement");
		
		let keyMapGenerator = Wprr.utils.KeyValueGenerator.create();
		keyMapGenerator.addKeyValue(0, "waiting");
		keyMapGenerator.addKeyValue(2, "processing");
		keyMapGenerator.addKeyValue(1, "done");
		keyMapGenerator.addKeyValue(-1, "error");
		
		let statusName = this.getSourcedProp("statusName");
		let externalStorage = this.getSourcedPropWithDefault("externalStorage", this.getReferenceIfExists("status/externalStorage"));
		
		return React.createElement(Wprr.ExternalStorageProps, {"props": statusName, "externalStorage": externalStorage},
			React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.selectItemInArray(keyMapGenerator.getAsArray(), Wprr.sourceProp(statusName), "key", "selectedSections").setInput("outputField", "value")},
				React.createElement(Wprr.SelectSection, {},
					this.props.children
				)
			)
		);
	}
}
