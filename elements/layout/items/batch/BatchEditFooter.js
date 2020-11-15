"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditFooter from "./BatchEditFooter";
export default class BatchEditFooter extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditFooter";
	}

	_getLayout(aSlots) {
		return React.createElement("div", null,
			React.createElement(Wprr.FlexRow, {className: "justify-between"},
				aSlots.slot("left",
					React.createElement("div", null,
						React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "createItem", [])},
							React.createElement("div", {className: "standard-button standard-button-padding"}, Wprr.idText("Add", "site.admin.add"))
						)
					)
				),
				aSlots.slot("right",
					React.createElement(Wprr.ExternalStorageProps, {props: "saveAll.hasChanges", externalStorage: Wprr.sourceReference("externalStorage")},
						React.createElement(Wprr.HasData, {check: Wprr.sourcePropWithDots("saveAll.hasChanges")},
							React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "saveAll", [])},
								React.createElement("div", {className: "standard-button standard-button-padding"},
									Wprr.idText("Save all changes", "site.admin.saveAllChanges")
								)
							)
						),
						React.createElement(Wprr.HasData, {check: Wprr.sourcePropWithDots("saveAll.hasChanges"),checkType: "invert/default"},
							React.createElement("div", {className: "standard-button standard-button-padding inactive"},
								Wprr.idText("No changes to save", "site.admin.noChangesToSave")
							)
						)
					)
				)
			)
		);
	}
}
