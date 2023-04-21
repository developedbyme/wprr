import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SaveValueChanges extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		//console.log("SaveValueChanges::_renderMainElement");
		
		return React.createElement("div", null,
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("editorsGroup", "item.changed")},
				React.createElement(Wprr.layout.interaction.Button, {"commands": Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save"), "text": Wprr.sourceTranslation("Save all changes", "site.saveAllChanges")})
			),
			React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("editorsGroup", "item.changed"), "checkType": "invert/default"},
				React.createElement("div", {"className": "standard-button standard-button-padding inactive"}, 
					Wprr.idText("No changes to save", "site.noChangesToSave")
				)
			)
		);
	}
}
