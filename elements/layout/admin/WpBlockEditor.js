"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import WpBlockEditor from "./WpBlockEditor";
export default class WpBlockEditor extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("WpBlockEditor::constructor");

		super();
		
		this._layoutName = "wpBlockEditor";
	}
	
	_getLayout(aSlots) {
		
		let settingsSource = Wprr.sourceReference("editorViewSettings");
		
		//METODO: inject block data for preview
		
		return React.createElement("div", {},
			React.createElement(Wprr.ExternalStorageInjection, {"initialValues": {"section": "edit"}, "storageName": "editorViewSettings"},
				aSlots.slot("topBar", 
					React.createElement("div", {"className": "standard-box standard-box-padding"},
						React.createElement(Wprr.FlexRow, {"className": "justify-between"},
							React.createElement("div", {"className": ""},
								React.createElement("div", {"className": ""},
									Wprr.text(aSlots.prop("editorName", Wprr.sourceReference("editorName")))
								),
								React.createElement("div", {"className": "small-description"},
									Wprr.text(aSlots.prop("editorPath", Wprr.sourceReference("editorPath")))
								)
							),
							React.createElement(Wprr.FlexRow, {"className": "micro-item-spacing"},
								React.createElement(Wprr.layout.interaction.Button, {"commands": Wprr.commands.setValue(settingsSource, "section", "view")},
									Wprr.translateText("View")
								),
								React.createElement(Wprr.layout.interaction.Button, {"commands": Wprr.commands.setValue(settingsSource, "section", "edit")},
									Wprr.translateText("Edit")
								),
								React.createElement(Wprr.layout.interaction.Button, {"commands": Wprr.commands.setValue(settingsSource, "section", "data")},
									Wprr.translateText("Data")
								),
								React.createElement(Wprr.layout.form.MoreOptionsDropdown, {"className": ""},
									React.createElement("div", {}, "Options")
								)
							)
						)
					)
				),
				React.createElement("div", {"className": "spacing small"}),
				React.createElement(Wprr.SelectSection, {"selectedSections": settingsSource.deeper("section")},
					React.createElement("div", {"data-section-name": "view"},
						aSlots.slot("viewElement", React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("editorPreview")}))
					),
					React.createElement("div", {"data-section-name": "edit"}, 
						aSlots.default(React.createElement("div", {}))
					),
					React.createElement("div", {"data-section-name": "data"},
						aSlots.slot("dataElement", React.createElement("div", {}, "No data settings available"))
					)
				)
			)
		);
	}
}