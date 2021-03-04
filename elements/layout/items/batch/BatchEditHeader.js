"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditHeader from "./BatchEditHeader";
export default class BatchEditHeader extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditHeader";
	}

	_getLayout(aSlots) {
		
		let externalStorageSource = aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"));
		
		return React.createElement("div", null,
			React.createElement(Wprr.FlexRow, {className: "justify-between", "itemClasses": "flex-resize,flex-no-resize"},
				aSlots.slot("left",
					React.createElement("div", null,
						aSlots.slot("titleElement",
							React.createElement("h2", {className: "batch-edit-title no-margins"},
								Wprr.text(aSlots.prop("title", Wprr.sourceTranslation("Edit items", "site.admin.editItems")))
							)
						),
						aSlots.slot("operations",
							React.createElement("div", null)
						)
					)
				),
				aSlots.slot("right",
					React.createElement(Wprr.FlexRow, {className: "small-item-spacing"},
						aSlots.slot("searchStorage",
							React.createElement(Wprr.EditableProps, {editableProps: aSlots.prop("searchTextValueName", "searchText"), externalStorage: externalStorageSource},
								aSlots.slot("searchField",
									React.createElement(Wprr.FormField, {valueName: aSlots.useProp("searchTextValueName")})
								)
							)
						),
						aSlots.slot("moreButton",
							React.createElement(Wprr.layout.form.MoreOptionsDropdown, {},
								aSlots.slot("moreContent",
									React.createElement("div", {"className": "custom-selection-menu custom-selection-menu-padding"},
										React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.setValue(externalStorageSource, "selection", externalStorageSource.deeper("filteredIds"))},
											React.createElement("div", {"className": "action-link cursor-pointer"},
												Wprr.text(Wprr.sourceTranslation("Select all", "site.admin.selectAll"))
											)
										),
										React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.setValue(externalStorageSource, "selection", [])},
											React.createElement("div", {"className": "action-link cursor-pointer"},
												Wprr.text(Wprr.sourceTranslation("Select none", "site.admin.selectNone"))
											)
										),
										aSlots.slot("additionalMoreOptions", React.createElement("div"))
									)
								)
							)
						)
					)
				)
			)
		);
	}
}
